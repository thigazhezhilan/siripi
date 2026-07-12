import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../lib/auth/AuthContext';
import { supabase } from '../lib/supabase';
import { computeAge } from '../lib/utils/age';
import { OwnFamily } from './useFamily';
import { OwnHoroscope } from './useHoroscope';
import { OwnPhoto } from './usePhotos';
import { OwnPreferences } from './usePreferences';
import { OwnProfile } from './useProfile';

export type AdminContactStatus = 'not_contacted' | 'contacted' | 'matched' | 'closed';

export function useIsAdmin() {
  const { userId, initializing } = useAuth();

  const query = useQuery({
    queryKey: ['isAdmin', userId],
    queryFn: async (): Promise<boolean> => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', userId as string)
        .maybeSingle();
      if (error) throw error;
      return data !== null;
    },
    enabled: !!userId,
  });

  return { ...query, isLoading: initializing || query.isLoading };
}

export type AdminFilters = {
  gender?: string;
  religion?: string;
  caste?: string;
  location?: string;
  maritalStatus?: string;
  education?: string;
  ageMin?: number;
  ageMax?: number;
};

export type AdminProfileListRow = OwnProfile & { adminStatus: AdminContactStatus };

export function useAdminProfileList(filters: AdminFilters) {
  return useQuery({
    queryKey: ['adminProfileList', filters],
    queryFn: async (): Promise<AdminProfileListRow[]> => {
      let query = supabase.from('profiles').select('*');

      if (filters.gender) query = query.eq('gender', filters.gender);
      if (filters.maritalStatus) query = query.eq('marital_status', filters.maritalStatus);
      if (filters.religion) query = query.ilike('religion', `%${filters.religion}%`);
      if (filters.caste) query = query.ilike('caste', `%${filters.caste}%`);
      if (filters.education) query = query.ilike('education', `%${filters.education}%`);
      if (filters.location) {
        query = query.or(
          `city.ilike.%${filters.location}%,district.ilike.%${filters.location}%,state.ilike.%${filters.location}%`
        );
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;

      let rows = (data ?? []) as OwnProfile[];
      if (filters.ageMin !== undefined) {
        rows = rows.filter((row) => computeAge(row.date_of_birth) >= filters.ageMin!);
      }
      if (filters.ageMax !== undefined) {
        rows = rows.filter((row) => computeAge(row.date_of_birth) <= filters.ageMax!);
      }

      if (rows.length === 0) return [];

      const { data: notes, error: notesError } = await supabase
        .from('admin_notes')
        .select('profile_id, status')
        .in(
          'profile_id',
          rows.map((r) => r.id)
        );
      if (notesError) throw notesError;

      const statusByProfile = new Map((notes ?? []).map((n) => [n.profile_id, n.status as AdminContactStatus]));

      return rows.map((row) => ({
        ...row,
        adminStatus: statusByProfile.get(row.id) ?? 'not_contacted',
      }));
    },
  });
}

export type AdminProfileDetail = {
  profile: OwnProfile;
  horoscope: OwnHoroscope | null;
  family: OwnFamily | null;
  preferences: OwnPreferences | null;
  photos: OwnPhoto[];
  adminStatus: AdminContactStatus;
};

export function useAdminProfileDetail(profileId: string | undefined) {
  return useQuery({
    queryKey: ['adminProfileDetail', profileId],
    queryFn: async (): Promise<AdminProfileDetail | null> => {
      if (!profileId) return null;

      const [profileRes, horoscopeRes, familyRes, preferencesRes, photosRes, notesRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', profileId).maybeSingle(),
        supabase.from('horoscope_details').select('*').eq('profile_id', profileId).maybeSingle(),
        supabase.from('family_details').select('*').eq('profile_id', profileId).maybeSingle(),
        supabase.from('partner_preferences').select('*').eq('profile_id', profileId).maybeSingle(),
        supabase.from('photos').select('*').eq('profile_id', profileId).order('is_primary', { ascending: false }),
        supabase.from('admin_notes').select('status').eq('profile_id', profileId).maybeSingle(),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (horoscopeRes.error) throw horoscopeRes.error;
      if (familyRes.error) throw familyRes.error;
      if (preferencesRes.error) throw preferencesRes.error;
      if (photosRes.error) throw photosRes.error;
      if (notesRes.error) throw notesRes.error;

      if (!profileRes.data) return null;

      return {
        profile: profileRes.data as OwnProfile,
        horoscope: horoscopeRes.data as OwnHoroscope | null,
        family: familyRes.data as OwnFamily | null,
        preferences: preferencesRes.data as OwnPreferences | null,
        photos: (photosRes.data ?? []) as OwnPhoto[],
        adminStatus: (notesRes.data?.status as AdminContactStatus | undefined) ?? 'not_contacted',
      };
    },
    enabled: !!profileId,
  });
}

export function useUpdateAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, status }: { profileId: string; status: AdminContactStatus }) => {
      const { error } = await supabase
        .from('admin_notes')
        .upsert({ profile_id: profileId, status, updated_at: new Date().toISOString() }, { onConflict: 'profile_id' });
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminProfileList'] });
      queryClient.invalidateQueries({ queryKey: ['adminProfileDetail', variables.profileId] });
    },
  });
}
