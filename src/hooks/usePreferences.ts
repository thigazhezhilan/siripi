import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../lib/auth/AuthContext';
import { supabase } from '../lib/supabase';
import { csvToArray, PreferencesFormValues } from '../lib/validation/preferencesSchema';

export type OwnPreferences = {
  profile_id: string;
  age_min: number | null;
  age_max: number | null;
  height_min_cm: number | null;
  height_max_cm: number | null;
  preferred_religion: string[] | null;
  preferred_caste: string[] | null;
  preferred_education: string[] | null;
  preferred_location: string[] | null;
};

export function useOwnPreferences() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['preferences', userId],
    queryFn: async (): Promise<OwnPreferences | null> => {
      const { data, error } = await supabase
        .from('partner_preferences')
        .select('*')
        .eq('profile_id', userId as string)
        .maybeSingle();
      if (error) throw error;
      return data as OwnPreferences | null;
    },
    enabled: !!userId,
  });
}

export function useSavePreferences() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: PreferencesFormValues) => {
      if (!userId) throw new Error('Not authenticated');

      const payload = {
        profile_id: userId,
        age_min: values.ageMin ? Number(values.ageMin) : null,
        age_max: values.ageMax ? Number(values.ageMax) : null,
        height_min_cm: values.heightMinCm ? Number(values.heightMinCm) : null,
        height_max_cm: values.heightMaxCm ? Number(values.heightMaxCm) : null,
        preferred_religion: csvToArray(values.preferredReligion),
        preferred_caste: csvToArray(values.preferredCaste),
        preferred_education: csvToArray(values.preferredEducation),
        preferred_location: csvToArray(values.preferredLocation),
      };

      const { error } = await supabase.from('partner_preferences').upsert(payload, { onConflict: 'profile_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences', userId] });
    },
  });
}
