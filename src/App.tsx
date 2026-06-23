import React from 'react'
import { TimeControls } from './ui/TimeControls'

export default function App(): React.ReactElement {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">

      {/* Canvas placeholder — Three.js scene mounts here in Step 2 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/10 text-sm font-mono tracking-widest uppercase">
          Scene renders here — Step 2
        </span>
      </div>

      {/* HUD overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <TimeControls />
      </div>
    </div>
  )
}