export function HomePanel() {
  return (
    <div style={{ padding: '8px 0', color: '#fff', fontFamily: 'system-ui' }}>
      <div style={{
        background:   'rgba(59,130,246,0.1)',
        border:       '1px solid rgba(59,130,246,0.25)',
        borderRadius: '12px',
        padding:      '16px',
        marginBottom: '16px',
      }}>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
          AstroVerse Observatory
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
          An interactive solar system simulator combining real-time astronomy,
          orbital mechanics, and Islamic prayer time calculations.
        </div>
      </div>

      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
        Quick Guide
      </div>

      {[
        { icon: '🖱️', text: 'Left click + drag to rotate camera' },
        { icon: '🖱️', text: 'Right click + drag to pan' },
        { icon: '⚲',  text: 'Scroll to zoom in/out' },
        { icon: '🪐',  text: 'Click any planet to select it' },
        { icon: '🌍',  text: 'Click Earth to open Earth Observatory' },
        { icon: '☀️',  text: 'Click Sun to open Astronomy data' },
        { icon: '⏩',  text: 'Use time controls to speed up simulation' },
      ].map((item, i) => (
        <div key={i} style={{
          display:      'flex',
          alignItems:   'flex-start',
          gap:          '10px',
          padding:      '7px 0',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          fontSize:     '12px',
          color:        'rgba(255,255,255,0.6)',
        }}>
          <span style={{ fontSize: '14px', minWidth: '20px' }}>{item.icon}</span>
          {item.text}
        </div>
      ))}
    </div>
  )
}