import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../lib/auth/AuthContext';
import { supabase } from '../lib/supabase';
import { HoroscopeFormValues } from '../lib/validation/horoscopeSchema';

export type OwnHoroscope = {
  profile_id: string;
  star: string | null;
  raasi: string | null;
  lagnam: string | null;
  chevvai_dosham: boolean;
  birth_place: string | null;
  horoscope_image_url: string | null;
};

export function useOwnHoroscope() {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['horoscope', userId],
    queryFn: async (): Promise<OwnHoroscope | null> => {
      const { data, error } = await supabase
        .from('horoscope_details')
        .select('*')
        .eq('profile_id', userId as string)
        .maybeSingle();
      if (error) throw error;
      return data as OwnHoroscope | null;
    },
    enabled: !!userId,
  });
}

export function useSaveHoroscope() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: HoroscopeFormValues) => {
      if (!userId) throw new Error('Not authenticated');

      const payload = {
        profile_id: userId,
        star: values.star || null,
        raasi: values.raasi || null,
        lagnam: values.lagnam || null,
        chevvai_dosham: values.chevvaiDosham,
        birth_place: values.birthPlace || null,
        horoscope_image_url: values.horoscopeImageUrl || null,
      };

      const { error } = await supabase.from('horoscope_details').upsert(payload, { onConflict: 'profile_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['horoscope', userId] });
    },
  });
}
