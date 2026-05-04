import React, { createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setLanguage } from '../slices/uiSlice'

const TRANSLATIONS = {
  en: {
    home: 'Home', movies: 'Movies', nowShowing: 'Now Showing', comingSoon: 'Coming Soon',
    bookNow: 'Book Now', watchTrailer: 'Watch Trailer', moreInfo: 'More Info',
    signIn: 'Sign In', joinNow: 'Join Now', signOut: 'Sign Out',
    myProfile: 'My Profile', myBookings: 'My Bookings', myWishlist: 'Wishlist',
    adminPanel: 'Admin Panel', search: 'Search movies...',
    totalRevenue: 'Total Revenue', totalBookings: 'Total Bookings', activeUsers: 'Active Users',
    bookingConfirmed: 'Booking Confirmed!', seeYouAtCinema: 'See you at the cinema!',
    seats: 'Seats', total: 'Total', date: 'Date', time: 'Time', cinema: 'Cinema',
    standard: 'Standard', vip: 'VIP', imax: 'IMAX', selectSeats: 'Select Seats',
    chooseShowtime: 'Choose Showtime', checkout: 'Checkout', confirmation: 'Confirmation',
    dashboard: 'Dashboard', manageMovies: 'Manage Movies', manageBookings: 'Manage Bookings',
    manageUsers: 'Manage Users', analytics: 'Analytics',
    from: 'From', rating: 'Rating', duration: 'Duration', language: 'Language',
    releaseDate: 'Release Date', director: 'Director', cast: 'Cast',
    reviews: 'Reviews', writeReview: 'Write a Review', submitReview: 'Submit Review',
    addToWishlist: 'Add to Wishlist', removeFromWishlist: 'Remove from Wishlist',
    backToHome: 'Back to Home', browseMovies: 'Browse Movies',
    noBookings: 'No bookings yet', emptyWishlist: 'Your wishlist is empty',
  },
  ar: {
    home: 'الرئيسية', movies: 'الأفلام', nowShowing: 'يُعرض الآن', comingSoon: 'قريبًا',
    bookNow: 'احجز الآن', watchTrailer: 'شاهد الإعلان', moreInfo: 'مزيد من المعلومات',
    signIn: 'تسجيل الدخول', joinNow: 'انضم الآن', signOut: 'تسجيل الخروج',
    myProfile: 'ملفي الشخصي', myBookings: 'حجوزاتي', myWishlist: 'المفضلة',
    adminPanel: 'لوحة الإدارة', search: 'بحث عن فيلم...',
    totalRevenue: 'إجمالي الإيرادات', totalBookings: 'إجمالي الحجوزات', activeUsers: 'المستخدمون النشطون',
    bookingConfirmed: 'تم تأكيد الحجز!', seeYouAtCinema: 'نراك في السينما!',
    seats: 'المقاعد', total: 'الإجمالي', date: 'التاريخ', time: 'الوقت', cinema: 'السينما',
    standard: 'عادي', vip: 'VIP', imax: 'IMAX', selectSeats: 'اختر المقاعد',
    chooseShowtime: 'اختر موعد العرض', checkout: 'الدفع', confirmation: 'التأكيد',
    dashboard: 'لوحة التحكم', manageMovies: 'إدارة الأفلام', manageBookings: 'إدارة الحجوزات',
    manageUsers: 'إدارة المستخدمين', analytics: 'التحليلات',
    from: 'من', rating: 'التقييم', duration: 'المدة', language: 'اللغة',
    releaseDate: 'تاريخ الإصدار', director: 'المخرج', cast: 'الممثلون',
    reviews: 'التقييمات', writeReview: 'اكتب مراجعة', submitReview: 'إرسال المراجعة',
    addToWishlist: 'إضافة إلى المفضلة', removeFromWishlist: 'إزالة من المفضلة',
    backToHome: 'العودة للرئيسية', browseMovies: 'تصفح الأفلام',
    noBookings: 'لا توجد حجوزات بعد', emptyWishlist: 'قائمة المفضلة فارغة',
  },
}

const I18nContext = createContext()

export const I18nProvider = ({ children }) => {
  const dispatch = useDispatch()
  const lang = useSelector(s => s.ui.language)
  const isRTL = lang === 'ar'

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang, isRTL])

  const t = (key) => TRANSLATIONS[lang]?.[key] ?? key

  const switchLang = (l) => {
    dispatch(setLanguage(l))
  }

  return (
    <I18nContext.Provider value={{ lang, t, switchLang, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} style={{ height: '100%', width: '100%' }}>
        {children}
      </div>
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
export default I18nContext
