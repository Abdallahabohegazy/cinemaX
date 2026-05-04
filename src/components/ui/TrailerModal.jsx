import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { closeModal } from '../../slices/uiSlice'

const TrailerModal = ({ url }) => {
  const dispatch = useDispatch()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="overlay"
        onClick={() => dispatch(closeModal())}
        style={{ zIndex: 'var(--z-modal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'relative',
            width: '90vw',
            maxWidth: '900px',
            background: '#000',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => dispatch(closeModal())}
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 10,
              width: 36, height: 36,
              background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
          <div style={{ position: 'relative', paddingTop: '56.25%' }}>
            <iframe
              src={url}
              title="Movie Trailer"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TrailerModal
