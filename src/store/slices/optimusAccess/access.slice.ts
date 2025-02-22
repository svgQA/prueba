import { create } from 'zustand';

// Definimos el estado global para manejar el recurso seleccionado
type ResourceState = {
  selectedResource: {
    title: string;
    subtitle: string;
    imageUrl: string;
  } | null;
  setSelectedResource: (resource: {
    title: string;
    subtitle: string;
    imageUrl: string;
  }) => void;
  clearSelectedResource: () => void;
};

export const useResourceStore = create<ResourceState>((set) => ({
  selectedResource: null,
  setSelectedResource: (resource) => set({ selectedResource: resource }),
  clearSelectedResource: () => set({ selectedResource: null }),
}));
