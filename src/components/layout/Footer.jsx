import React from 'react'
import { Link } from 'react-router-dom'
import { Film, Share2, Globe, Rss, ExternalLink, Mail, Phone, MapPin } from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link to="/" className={styles.logo}>
            <Film size={24} strokeWidth={2.5} className={styles.logoIcon} />
            <span className={styles.logoText}>
              <span className={styles.logoHighlight}>CINE</span>MAX
            </span>
          </Link>
          <p className={styles.tagline}>
            Experience cinema at its finest. Luxury seating, premium sound, unforgettable moments.
          </p>
          <div className={styles.socials}>
            {[Share2, Globe, Rss, ExternalLink].map((Icon, i) => (
              <a key={i} href="#" className={styles.socialLink}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className={styles.colTitle}>Quick Links</h4>
          <ul className={styles.linkList}>
            {['Now Showing', 'Coming Soon', 'Cinemas', 'Promotions', 'Gift Cards'].map(item => (
              <li key={item}><a href="#" className={styles.footerLink}>{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className={styles.colTitle}>Support</h4>
          <ul className={styles.linkList}>
            {['Help Center', 'Booking Guide', 'Refund Policy', 'Privacy Policy', 'Terms of Use'].map(item => (
              <li key={item}><a href="#" className={styles.footerLink}>{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className={styles.colTitle}>Contact Us</h4>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <Mail size={15} className={styles.contactIcon} />
              <span>support@cinemax.com</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={15} className={styles.contactIcon} />
              <span>+1 800-CINEMAX</span>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={15} className={styles.contactIcon} />
              <span>Downtown Plaza, Cinema District</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} CineMax. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy</a>
            <a href="#" className={styles.bottomLink}>Terms</a>
            <a href="#" className={styles.bottomLink}>Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
