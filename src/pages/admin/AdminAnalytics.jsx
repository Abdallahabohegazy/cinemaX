import React from 'react'
import { useSelector } from 'react-redux'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, RadarChart,
  PolarGrid, PolarAngleAxis, Radar,
} from 'recharts'
import { TrendingUp, Users, Ticket, DollarSign } from 'lucide-react'
import { REVENUE_DATA, GENRE_STATS } from '../../data/seedData'
import styles from './Admin.module.css'

const COLORS = ['#dc2626', '#f59e0b', '#7c3aed', '#06b6d4', '#4ade80', '#f97316']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'rgba(12,12,22,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value?.toLocaleString?.() ?? p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const ChartCard = ({ title, subtitle, children, fullWidth }) => (
  <div className={`${styles.chartCard} ${fullWidth ? styles.fullWidth : ''}`} style={{ padding: 20 }}>
    <div className={styles.chartHeader}>
      <div>
        <h3 className={styles.chartTitle}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{subtitle}</p>}
      </div>
    </div>
    {children}
  </div>
)

const AdminAnalytics = () => {
  const { revenueData, genreStats, stats } = useSelector(s => s.admin)
  const { bookings } = useSelector(s => s.booking)
  const { movies } = useSelector(s => s.movies)

  // Build monthly bookings data
  const bookingsByDay = REVENUE_DATA.map((r, i) => ({
    ...r,
    avgTicket: Math.round(r.revenue / r.bookings),
    occupancy: [72, 78, 85, 68, 81, 89, 92][i],
  }))

  // Seat type breakdown
  const seatTypeData = [
    { name: 'Standard', value: bookings.filter(b => b.seatType === 'standard').length || 12, fill: '#2563eb' },
    { name: 'VIP',      value: bookings.filter(b => b.seatType === 'vip').length || 8,       fill: '#f59e0b' },
    { name: 'IMAX',     value: bookings.filter(b => b.seatType === 'imax').length || 5,      fill: '#7c3aed' },
  ]

  // Performance radar data
  const radarData = [
    { metric: 'Revenue',    value: 88 },
    { metric: 'Bookings',   value: 76 },
    { metric: 'Users',      value: 82 },
    { metric: 'Occupancy',  value: stats.occupancyRate },
    { metric: 'Rating',     value: 90 },
    { metric: 'Retention',  value: 74 },
  ]

  // Top movies by simulated bookings
  const topByBookings = [...movies]
    .map(m => ({ name: m.title.split(':')[0].slice(0, 20), bookings: Math.floor(Math.random() * 80) + 20, revenue: Math.floor(Math.random() * 15000) + 5000 }))
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 7)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Analytics & Reports</h1>
          <p className={styles.pageSubtitle}>Performance insights and revenue tracking</p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { icon: DollarSign, label: 'Total Revenue',  value: `EGP ${(stats.totalRevenue/1000).toFixed(0)}K`, color: '#f59e0b' },
          { icon: Ticket,     label: 'Total Bookings', value: stats.totalBookings.toLocaleString(),            color: '#dc2626' },
          { icon: Users,      label: 'Active Users',   value: stats.activeUsers.toLocaleString(),              color: '#4ade80' },
          { icon: TrendingUp, label: 'Occupancy Rate', value: `${stats.occupancyRate}%`,                       color: '#818cf8' },
        ].map(kpi => (
          <div key={kpi.label} style={{ padding: '16px 20px', background: 'rgba(15,15,30,0.8)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: `${kpi.color}22`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <kpi.icon size={20} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700 }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{kpi.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className={styles.analyticsGrid}>
        {/* Revenue & Bookings Trend */}
        <ChartCard title="Revenue & Bookings Trend" subtitle="Last 7 months" fullWidth>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={bookingsByDay}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (EGP)" stroke="#dc2626" strokeWidth={2.5} fill="url(#rev)" />
              <Area yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#f59e0b" strokeWidth={2.5} fill="url(#bk)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Movies Bar Chart */}
        <ChartCard title="Top Movies by Bookings" subtitle="Most booked this season">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topByBookings} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#a0a0b5', fontSize: 11 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" name="Bookings" fill="#dc2626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Genre Distribution */}
        <ChartCard title="Genre Distribution" subtitle="Bookings by movie genre">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={genreStats} dataKey="percentage" nameKey="genre" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {genreStats.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'rgba(12,12,22,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Seat Type Breakdown */}
        <ChartCard title="Seat Type Breakdown" subtitle="Preference by class">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={seatTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Bookings" radius={[6, 6, 0, 0]}>
                {seatTypeData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Occupancy Rate Line */}
        <ChartCard title="Occupancy Rate" subtitle="Monthly seat fill percentage">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={bookingsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'rgba(12,12,22,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="occupancy" name="Occupancy %" stroke="#4ade80" strokeWidth={2.5} dot={{ fill: '#4ade80', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Performance Radar */}
        <ChartCard title="Performance Radar" subtitle="Key metrics overview">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#a0a0b5', fontSize: 11 }} />
              <Radar name="Performance" dataKey="value" stroke="#dc2626" fill="#dc2626" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: 'rgba(12,12,22,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Avg Ticket Price Line */}
        <ChartCard title="Average Ticket Price" subtitle="EGP trend over 7 months" fullWidth>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingsByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="avgTicket" name="Avg Price (EGP)" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}

export default AdminAnalytics
