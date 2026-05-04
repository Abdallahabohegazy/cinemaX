import React from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { toggleSeat } from '../../slices/bookingSlice'
import styles from './SeatSelector.module.css'

const TYPE_COLORS = {
  imax: { bg: '#1a1a3e', selected: '#7c3aed', label: 'IMAX' },
  vip: { bg: '#2d1a00', selected: '#b45309', label: 'VIP' },
  standard: { bg: '#0d1f36', selected: '#2563eb', label: 'Standard' },
}

const SeatSelector = ({ seatMap, selectedSeats, moviePrices, totalPrice, onNext, onBack }) => {
  const dispatch = useDispatch()

  const isSeatSelected = (id) => selectedSeats.some(s => s.id === id)

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return
    dispatch(toggleSeat(seat))
  }

  const getPriceForType = (type) => moviePrices?.[type] || moviePrices?.standard || 120

  return (
    <div className={styles.wrapper}>
      {/* Screen */}
      <div className={styles.screenWrap}>
        <div className={styles.screen}>SCREEN</div>
        <div className={styles.screenGlow} />
      </div>

      {/* Seat Map */}
      <div className={styles.seatMap}>
        {seatMap.map(rowData => (
          <div key={rowData.row} className={styles.row}>
            <div className={styles.rowLabel}>{rowData.row}</div>
            <div className={styles.seats}>
              {rowData.seats.map((seat, idx) => {
                const selected = isSeatSelected(seat.id)
                const booked = seat.status === 'booked'
                return (
                  <React.Fragment key={seat.id}>
                    {idx === 6 && <div className={styles.aisle} />}
                    <motion.button
                      className={`${styles.seat} ${styles[seat.type]} ${selected ? styles.selected : ''} ${booked ? styles.booked : ''}`}
                      onClick={() => handleSeatClick(seat)}
                      whileHover={!booked ? { scale: 1.15 } : {}}
                      whileTap={!booked ? { scale: 0.95 } : {}}
                      title={booked ? 'Seat taken' : `${seat.id} - ${seat.type} - EGP ${getPriceForType(seat.type)}`}
                      disabled={booked}
                    >
                      <span className={styles.seatNum}>{seat.number}</span>
                    </motion.button>
                  </React.Fragment>
                )
              })}
            </div>
            <div className={styles.rowLabel}>{rowData.row}</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.sampleAvailable}`} />
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.sampleSelected}`} />
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.sampleBooked}`} />
          <span>Taken</span>
        </div>
        <div className={styles.sep} />
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.standard}`} />
          <span>Standard — EGP {getPriceForType('standard')}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.vip}`} />
          <span>VIP — EGP {getPriceForType('vip')}</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSeat} ${styles.imax}`} />
          <span>IMAX — EGP {getPriceForType('imax')}</span>
        </div>
      </div>

      {/* Order Summary */}
      <div className={styles.summary}>
        <div className={styles.summaryLeft}>
          <div className={styles.summaryLabel}>Selected Seats</div>
          <div className={styles.summarySeats}>
            {selectedSeats.length === 0
              ? <span style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>None selected</span>
              : selectedSeats.map(s => (
                <span key={s.id} className={`${styles.seatChip} ${styles[s.type]}`}>
                  {s.id}
                </span>
              ))}
          </div>
          <div className={styles.summaryCount}>{selectedSeats.length} seat(s) — max 8</div>
        </div>
        <div className={styles.summaryRight}>
          <div className={styles.summaryTotal}>
            Total: <span className={styles.summaryPrice}>EGP {totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className="btn btn-outline" onClick={onBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={selectedSeats.length === 0}
        >
          Continue to Checkout <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default SeatSelector
