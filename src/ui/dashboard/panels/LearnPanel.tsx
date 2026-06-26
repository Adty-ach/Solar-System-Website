import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TOPICS = [
  {
    id: 'au',
    icon: '📏',
    title: 'Astronomical Unit (AU)',
    body: 'One AU equals the average distance from Earth to the Sun — approximately 149.6 million km. It is the standard unit for measuring distances within the solar system. Mercury orbits at 0.39 AU; Neptune at 30.1 AU.',
  },
  {
    id: 'declination',
    icon: '🧭',
    title: 'Declination',
    body: 'Solar declination is the angle between the Sun and the celestial equator. It ranges from +23.5° (June solstice) to −23.5° (December solstice). At the equinoxes it is 0°. Declination determines how high the Sun rises and affects day length.',
  },
  {
    id: 'azimuth',
    icon: '🔭',
    title: 'Azimuth',
    body: 'Azimuth is a compass bearing measured clockwise from due North: 0°=N, 90°=E, 180°=S, 270°=W. Solar azimuth tells you the direction of the Sun from your position. Prayer direction (Qibla) is also expressed as an azimuth angle.',
  },
  {
    id: 'lunar-phases',
    icon: '🌙',
    title: 'Lunar Phases',
    body: 'The Moon completes one phase cycle (synodic month) every 29.53 days. New Moon occurs when the Moon is between Earth and Sun. Full Moon when Earth is between Moon and Sun. The Islamic Hijri calendar begins each month at the sighting of the new crescent.',
  },
  {
    id: 'solar-eclipse',
    icon: '🌑',
    title: 'Solar Eclipse',
    body: 'A solar eclipse occurs when the Moon passes directly between Earth and the Sun, casting a shadow on Earth. Total eclipses are only possible because the Moon and Sun appear nearly the same angular size in our sky — a remarkable coincidence.',
  },
  {
    id: 'lunar-eclipse',
    icon: '🌕',
    title: 'Lunar Eclipse',
    body: 'A lunar eclipse occurs when Earth passes between the Sun and the Moon. Earth\'s shadow falls on the Moon, turning it red-orange — a "blood moon." This happens only at full moon when all three bodies align.',
  },
]

export function LearnPanel() {
  const [selected, setSelected] = useState<string | null>(null)
  const topic = TOPICS.find((t) => t.id === selected)

  return (
    <div style={{ fontFamily: 'system-ui', color: '#fff' }}>
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
              Select a topic
            </div>
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '12px',
                  width:        '100%',
                  padding:      '10px 12px',
                  borderRadius: '9px',
                  background:   'rgba(255,255,255,0.03)',
                  border:       '1px solid rgba(255,255,255,0.07)',
                  cursor:       'pointer',
                  marginBottom: '5px',
                  color:        '#fff',
                  textAlign:    'left',
                  fontFamily:   'system-ui',
                }}
              >
                <span style={{ fontSize: '16px', minWidth: '20px' }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0' }}>{t.title}</div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px' }}>›</span>
              </button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0  }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '6px',
                background:   'transparent',
                border:       'none',
                color:        'rgba(255,255,255,0.45)',
                cursor:       'pointer',
                fontSize:     '12px',
                marginBottom: '14px',
                padding:      0,
                fontFamily:   'system-ui',
              }}
            >
              ← Back
            </button>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{topic?.icon}</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#93C5FD', marginBottom: '12px' }}>
              {topic?.title}
            </div>
            <p style={{
              fontSize:   '12px',
              color:      'rgba(255,255,255,0.65)',
              lineHeight: '1.75',
              margin:     0,
            }}>
              {topic?.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}