import { create } from 'zustand';

type SceneState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
