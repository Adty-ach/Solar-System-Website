import { create } from 'zustand'

export type CelestialObjectId =
  | 'sun' | 'mercury' | 'venus' | 'earth' | 'moon'
  | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  | null

interface SceneState {
  selectedObject: CelestialObjectId
  cameraTarget:   CelestialObjectId
}

interface SceneActions {
  setSelectedObject: (id: CelestialObjectId) => void
  setCameraTarget:   (id: CelestialObjectId) => void
}

export const useSceneStore = create<SceneState & SceneActions>((set) => ({
  selectedObject: null,
  cameraTarget:   null,

  setSelectedObject: (id) => set({ selectedObject: id }),
  setCameraTarget:   (id) => set({ cameraTarget: id }),
}))