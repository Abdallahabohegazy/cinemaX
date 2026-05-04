import React from 'react'
import { motion } from 'framer-motion'
import { Film } from 'lucide-react'

const PageLoader = () => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'var(--color-bg-primary)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 20, zIndex: 9999,
  }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
    >
      <Film size={48} style={{ color: 'var(--color-crimson)', filter: 'drop-shadow(0 0 16px rgba(220,38,38,0.8))' }} />
    </motion.div>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, color: 'var(--color-text-secondary)' }}>
      <span style={{ color: 'var(--color-crimson)' }}>CINE</span>MAX
    </div>
    <div style={{ display: 'flex', gap: 6 }}>
      {[0,1,2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-crimson)' }}
        />
      ))}
    </div>
  </div>
)

export default PageLoader
