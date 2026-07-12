import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../lib/auth/AuthContext';
import { supabase } from '../lib/supabase';
import { PersonalDetailsFormValues } from '../lib/validation/personalDetailsSchema';

export type OwnProfile = {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  time_of_birth: string | null;
  profile_owner_relation: string;
  marital_status: string;
  height_cm: number | null;
  mother_tongue: string | null;
  religion: string | null;
  caste: string | null;
  sub_caste: string | null;
  education: string | null;
  occupation: string | null;
  annual_income_range: string | null;
  city: string;
  district: string | null;
  state: string | null;
  country: string | null;
  about_me_ta: string | null;
  about_me_en: string | null;
  phone_number: string | null;
  status: 'pending_review' | 'active' | 'suspended' | 'hidden';
};

export function useOwnProfile() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async (): Promise<OwnProfile | null> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId as string)
        .maybeSingle();
      if (error) throw error;
      return data as OwnProfile | null;
    },
    enabled: !!userId,
  });
}

export function useSavePersonalDetails() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: PersonalDetailsFormValues) => {
      if (!userId) throw new Error('Not authenticated');

      const { data: userData } = await supabase.auth.getUser();
      const phoneNumber =
        (userData.user?.user_metadata as { phone_number?: string } | undefined)?.phone_number ?? null;

      const payload = {
        id: userId,
        full_name: values.fullName,
        gender: values.gender,
        date_of_birth: values.dateOfBirth,
        time_of_birth: values.timeOfBirth || null,
        profile_owner_relation: values.profileOwnerRelation,
        marital_status: values.maritalStatus,
        height_cm: values.heightCm ? Number(values.heightCm) : null,
        mother_tongue: values.motherTongue || null,
        religion: values.religion || null,
        caste: values.caste || null,
        sub_caste: values.subCaste || null,
        education: values.education || null,
        occupation: values.occupation || null,
        annual_income_range: values.annualIncomeRange || null,
        city: values.city,
        district: values.district || null,
        state: values.state || null,
        country: values.country || null,
        about_me_ta: values.aboutMeTa || null,
        about_me_en: values.aboutMeEn || null,
        phone_number: phoneNumber,
      };

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}

export function useFinalizeProfile() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Not authenticated');
      const { error } = await supabase.from('profiles').update({ status: 'active' }).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
