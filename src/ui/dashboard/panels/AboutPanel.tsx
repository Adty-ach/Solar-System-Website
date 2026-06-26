export function AboutPanel() {
  const techStack = [
    { name: 'React 18',          desc: 'UI framework'                     },
    { name: 'TypeScript',        desc: 'Type safety'                      },
    { name: 'React Three Fiber', desc: '3D rendering'                     },
    { name: 'Three.js',          desc: 'WebGL engine'                     },
    { name: 'Zustand',           desc: 'State management'                 },
    { name: 'Framer Motion',     desc: 'Animations'                       },
    { name: 'Vite',              desc: 'Build tool'                       },
  ]

  const features = [
    { icon: '🌌', name: 'Solar System Simulation',  desc: 'Real Keplerian orbits, J2000 epoch'     },
    { icon: '🌍', name: 'Earth Observatory',         desc: 'Live solar data, sunrise/sunset'        },
    { icon: '☀️', name: 'Astronomy Engine',          desc: 'Jean Meeus algorithms'                  },
    { icon: '🕌', name: 'Prayer Observatory',        desc: 'MWL, ISNA, Egypt, Makkah, Karachi'     },
    { icon: '🪐', name: 'Planet Info Panels',        desc: 'Scientific data for all 8 planets'     },
    { icon: '⏱️', name: 'Unified Time Engine',       desc: 'Deterministic sim up to 100K×'         },
    { icon: '📷', name: 'Cinematic Camera',          desc: 'Smooth focus & follow modes'            },
  ]

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '12px 0 18px' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔭</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#93C5FD' }}>
          AstroVerse Observatory
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '4px' }}>
          v2.0 — Phase 10 · Educational STEM Platform
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontSize:     '12px',
        color:        'rgba(255,255,255,0.55)',
        lineHeight:   '1.6',
        marginBottom: '16px',
        padding:      '12px',
        background:   'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        border:       '1px solid rgba(255,255,255,0.06)',
      }}>
        An interactive solar system simulator combining real-time orbital mechanics,
        astronomical calculations, and Islamic prayer time science in one educational platform.
      </div>

      {/* Features */}
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
        Features
      </div>
      {features.map((f) => (
        <div key={f.name} style={{
          display:      'flex',
          gap:          '10px',
          padding:      '7px 0',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          alignItems:   'flex-start',
        }}>
          <span style={{ fontSize: '14px', minWidth: '18px' }}>{f.icon}</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0' }}>{f.name}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{f.desc}</div>
          </div>
        </div>
      ))}

      {/* Tech stack */}
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: '14px 0 8px' }}>
        Technology
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        {techStack.map((t) => (
          <div key={t.name} style={{
            padding:      '8px 10px',
            borderRadius: '8px',
            background:   'rgba(255,255,255,0.04)',
            border:       '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#93C5FD' }}>{t.name}</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{t.desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop:  '14px',
        padding:    '10px',
        background: 'rgba(99,102,241,0.06)',
        borderRadius:'8px',
        border:     '1px solid rgba(99,102,241,0.15)',
        fontSize:   '10px',
        color:      'rgba(255,255,255,0.35)',
        textAlign:  'center',
        lineHeight: '1.5',
      }}>
        Built as an educational STEM platform combining astronomy,
        physics, and Islamic science.
      </div>
    </div>
  )
}