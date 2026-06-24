import { create } from 'zustand'

export type CelestialObjectId =
  | 'sun' | 'moon'
  | 'mercury' | 'venus' | 'earth' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  | null

export type CameraMode = 'free' | 'follow' | 'focus'

interface SceneState {
  selectedObject:  CelestialObjectId
  cameraTarget:    CelestialObjectId
  cameraMode:      CameraMode
  triggerReset:    number
  triggerFocus:    number
}

interface SceneActions {
  setSelectedObject:  (id: CelestialObjectId) => void
  setCameraTarget:    (id: CelestialObjectId) => void
  setCameraMode:      (mode: CameraMode) => void
  resetCamera:        () => void
  focusTarget:        () => void
}

export const useSceneStore = create<SceneState & SceneActions>((set) => ({
  selectedObject: null,
  cameraTarget:   null,
  cameraMode:     'free',
  triggerReset:   0,
  triggerFocus:   0,

  setSelectedObject: (id)   => set({ selectedObject: id }),
  setCameraTarget:   (id)   => set({ cameraTarget: id }),
  setCameraMode:     (mode) => set({ cameraMode: mode }),
  resetCamera:       ()     => set((s) => ({ triggerReset: s.triggerReset + 1, cameraMode: 'free', cameraTarget: null })),
  focusTarget:       ()     => set((s) => ({ triggerFocus: s.triggerFocus + 1, cameraMode: 'focus' })),
}))