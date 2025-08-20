import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/utils/api';
import { CountryData } from '@/types/map';

export const useCountryData = (countryCode: string | null) => {
  return useQuery({
    queryKey: ['country', countryCode],
    queryFn: () => 
      countryCode ? apiClient.get<CountryData>(`/api/v1/countries/${countryCode}`) : null,
    enabled: !!countryCode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCountriesList = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: () => apiClient.get<CountryData[]>('/api/v1/countries'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
