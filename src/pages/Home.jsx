import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, useInView } from 'framer-motion'
import { ChevronRight, TrendingUp, Clock, Star, Zap, Shield, Award, Film, Play } from 'lucide-react'
import HeroCarousel from '../components/movies/HeroCarousel'
import MovieCard from '../components/movies/MovieCard'
import TrailerModal from '../components/ui/TrailerModal'
import styles from './Home.module.css'

const SectionTitle = ({ children, subtitle, badge }) => {
  const ref = useRef()
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={styles.sectionHeader}
    >
      {badge && <span className={`badge badge-crimson ${styles.sectionBadge}`}>{badge}</span>}
      <h2 className={`section-title ${styles.sectionTitle}`}>{children}</h2>
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </motion.div>
  )
}

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className={styles.statCard}>
    <div className={styles.statIcon} style={{ background: `rgba(${color}, 0.15)`, color: `rgb(${color})` }}>
      <Icon size={22} />
    </div>
    <div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  </div>
)

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className={`glass-card glass-card-hover ${styles.featureCard}`}>
    <div className={styles.featureIcon}><Icon size={24} /></div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDesc}>{description}</p>
  </div>
)

const Home = () => {
  const navigate = useNavigate()
  const { movies } = useSelector(s => s.movies)
  const { modalOpen, trailerUrl } = useSelector(s => s.ui)

  const nowShowing = movies.filter(m => m.category === 'now_showing')
  const comingSoon = movies.filter(m => m.category === 'coming_soon')
  const topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 6)

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statsInner}>
          <StatCard icon={Film} value="200+" label="Movies Available" color="220,38,38" />
          <StatCard icon={Star} value="1M+" label="Happy Customers" color="245,158,11" />
          <StatCard icon={TrendingUp} value="98%" label="Satisfaction Rate" color="34,197,94" />
          <StatCard icon={Award} value="50+" label="Awards Won" color="99,102,241" />
        </div>
      </div>

      {/* Now Showing Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <SectionTitle badge="Live Now" subtitle="Don't miss out – these films are playing this week">
              Now Showing
            </SectionTitle>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/movies?cat=now_showing')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.scrollRow}>
            <motion.div
              className={styles.movieRow}
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {nowShowing.map(movie => (
                <motion.div key={movie.id} variants={item}>
                  <MovieCard movie={movie} size="md" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className={styles.featuredBanner}>
        <div className={styles.bannerBg} />
        <div className={styles.bannerContent}>
          <div className={styles.bannerLeft}>
            <span className="badge badge-gold">IMAX Experience</span>
            <h2 className={styles.bannerTitle}>Premium IMAX Screening</h2>
            <p className={styles.bannerDesc}>
              Immerse yourself in crystal-clear visuals and thunderous sound. 
              Our IMAX screens are 40% larger than standard screens with laser projection.
            </p>
            <button className="btn btn-gold btn-lg" onClick={() => navigate('/movies')}>
              Explore IMAX Movies
            </button>
          </div>
          <div className={styles.bannerRight}>
            <div className={styles.bannerCard}>
              <div className={styles.bannerCardIcon}><Play size={32} fill="currentColor" /></div>
              <div className={styles.bannerCardText}>
                <div className={styles.bannerCardTitle}>4K Laser Projection</div>
                <div className={styles.bannerCardSub}>Experience cinema like never before</div>
              </div>
            </div>
            <div className={styles.bannerCard}>
              <div className={styles.bannerCardIcon} style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--color-gold)' }}><Zap size={32} /></div>
              <div className={styles.bannerCardText}>
                <div className={styles.bannerCardTitle}>Dolby Atmos Sound</div>
                <div className={styles.bannerCardSub}>360° immersive audio experience</div>
              </div>
            </div>
            <div className={styles.bannerCard}>
              <div className={styles.bannerCardIcon} style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8' }}><Shield size={32} /></div>
              <div className={styles.bannerCardText}>
                <div className={styles.bannerCardTitle}>VIP Comfort Seating</div>
                <div className={styles.bannerCardSub}>Reclining leather seats with service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <SectionTitle badge="Fan Favorites" subtitle="Highest-rated films selected by our audience">
              Top Rated
            </SectionTitle>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/movies')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.scrollRow}>
            <motion.div
              className={styles.movieRow}
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {topRated.map(movie => (
                <motion.div key={movie.id} variants={item}>
                  <MovieCard movie={movie} size="md" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionRow}>
            <SectionTitle badge="Upcoming" subtitle="Mark your calendars – these films are coming soon">
              Coming Soon
            </SectionTitle>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/movies?cat=coming_soon')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className={styles.scrollRow}>
            <motion.div
              className={styles.movieRow}
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {comingSoon.map(movie => (
                <motion.div key={movie.id} variants={item}>
                  <MovieCard movie={movie} size="md" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge badge-gold" style={{ marginBottom: 12 }}>Why CineMax</span>
            <h2 className={`${styles.sectionTitle} ${styles.centered}`}>The Ultimate Cinema Experience</h2>
          </div>
          <div className={styles.featuresGrid}>
            <FeatureCard
              icon={Film}
              title="Latest Releases"
              description="Be the first to watch blockbusters with our exclusive premiere screenings."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Booking"
              description="Your booking is protected with end-to-end encryption and instant confirmation."
            />
            <FeatureCard
              icon={Zap}
              title="Instant QR Tickets"
              description="Skip the queue. Your QR ticket is delivered instantly to your phone."
            />
            <FeatureCard
              icon={Star}
              title="VIP Experience"
              description="Premium leather recliners, in-seat service, and exclusive VIP lounges."
            />
            <FeatureCard
              icon={Award}
              title="Loyalty Rewards"
              description="Earn CinePoints on every booking and redeem for free tickets."
            />
            <FeatureCard
              icon={Clock}
              title="Flexible Scheduling"
              description="Morning to midnight shows. Pick the perfect time with real-time availability."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaGlow} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.ctaTitle}>Ready for the Ultimate Cinema Experience?</h2>
            <p className={styles.ctaDesc}>Join over 1 million movie lovers who book with CineMax</p>
            <div className={styles.ctaBtns}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                Create Free Account
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate('/movies')}>
                Browse Movies
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trailer Modal */}
      {modalOpen === 'trailer' && <TrailerModal url={trailerUrl} />}
    </div>
  )
}

export default Home
