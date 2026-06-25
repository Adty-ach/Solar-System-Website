export function AboutPanel() {
  const rows = [
    { label: 'Project',    value: 'AstroVerse Observatory'              },
    { label: 'Version',    value: '1.0 — Unified Time Engine'           },
    { label: 'Renderer',   value: 'React Three Fiber + Three.js'        },
    { label: 'Astronomy',  value: 'Jean Meeus Algorithms'               },
    { label: 'Prayer',     value: 'MWL / ISNA / Egypt / Makkah / Karachi' },
    { label: 'Orbits',     value: 'NASA/JPL Keplerian Elements J2000.0' },
    { label: 'Textures',   value: 'Solar System Scope (CC BY 4.0)'      },
    { label: 'Deployment', value: 'Vercel — zero backend'               },
  ]

  return (
    <div style={{ color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{ textAlign: 'center', padding: '16px 0 20px' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔭</div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#93C5FD' }}>
          AstroVerse Observatory
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
          Educational astronomy & prayer platform
        </div>
      </div>

      {rows.map((r) => (
        <div key={r.label} style={{
          display:        'flex',
          justifyContent: 'space-between',
          padding:        '7px 0',
          borderBottom:   '1px solid rgba(255,255,255,0.05)',
          gap:            '12px',
          fontSize:       '12px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{r.label}</span>
          <span style={{ color: 'rgba(255,255,255,0.75)', textAlign: 'right' }}>{r.value}</span>
        </div>
      ))}

      <div style={{
        marginTop:    '16px',
        padding:      '12px',
        background:   'rgba(99,102,241,0.08)',
        borderRadius: '10px',
        border:       '1px solid rgba(99,102,241,0.2)',
        fontSize:     '11px',
        color:        'rgba(255,255,255,0.4)',
        lineHeight:   '1.6',
        textAlign:    'center',
      }}>
        Built as an educational STEM platform combining
        astronomy, physics, and Islamic science.
      </div>
    </div>
  )
}