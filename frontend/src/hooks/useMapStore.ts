import { create } from 'zustand';
import { MapState } from '@/types/map';

interface MapStore extends MapState {
  setSelectedCountry: (countryCode: string | null) => void;
  setHoveredCountry: (countryCode: string | null) => void;
  setViewState: (viewState: Partial<MapState['viewState']>) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedCountry: null,
  hoveredCountry: null,
  viewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
  },
  setSelectedCountry: (countryCode) => set({ selectedCountry: countryCode }),
  setHoveredCountry: (countryCode) => set({ hoveredCountry: countryCode }),
  setViewState: (newViewState) => 
    set((state) => ({ 
      viewState: { ...state.viewState, ...newViewState } 
    })),
}));
