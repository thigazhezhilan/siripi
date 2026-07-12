import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../lib/auth/AuthContext';
import { supabase } from '../lib/supabase';
import { FamilyFormValues } from '../lib/validation/familySchema';

export type OwnFamily = {
  profile_id: string;
  father_name: string | null;
  father_occupation: string | null;
  mother_name: string | null;
  mother_occupation: string | null;
  siblings_count: number | null;
  family_type: string | null;
  family_values: string | null;
};

export function useOwnFamily() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['family', userId],
    queryFn: async (): Promise<OwnFamily | null> => {
      const { data, error } = await supabase
        .from('family_details')
        .select('*')
        .eq('profile_id', userId as string)
        .maybeSingle();
      if (error) throw error;
      return data as OwnFamily | null;
    },
    enabled: !!userId,
  });
}

export function useSaveFamily() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: FamilyFormValues) => {
      if (!userId) throw new Error('Not authenticated');

      const payload = {
        profile_id: userId,
        father_name: values.fatherName || null,
        father_occupation: values.fatherOccupation || null,
        mother_name: values.motherName || null,
        mother_occupation: values.motherOccupation || null,
        siblings_count: values.siblingsCount ? Number(values.siblingsCount) : null,
        family_type: values.familyType || null,
        family_values: values.familyValues || null,
      };

      const { error } = await supabase.from('family_details').upsert(payload, { onConflict: 'profile_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family', userId] });
    },
  });
}
