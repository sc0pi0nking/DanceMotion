'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  Eye, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  TrendingUp,
  RefreshCw,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  totals: {
    pageViews: number
    uniqueVisitors: number
    liveVisitors: number
  }
  chartData: Array<{ date: string; views: number; visitors: number }>
  topPages: Array<{ path: string; views: number }>
  topReferrers: Array<{ referrer: string; count: number }>
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [range, setRange] = useState('7')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`)
      if (!res.ok) throw new Error('Failed to fetch analytics')
      const json = await res.json()
      setData(json)
      setError('')
    } catch (err) {
      setError('Fehler beim Laden der Analytics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [range])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  }

  const maxViews = data?.chartData?.reduce((max, d) => Math.max(max, d.views), 0) || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-teal-400" />
            Analytics
          </h1>
          <p className="text-slate-400 mt-1">Übersicht über Website-Besucher (DSGVO-konform)</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-teal-500"
          >
            <option value="7">Letzte 7 Tage</option>
            <option value="14">Letzte 14 Tage</option>
            <option value="30">Letzte 30 Tage</option>
            <option value="90">Letzte 90 Tage</option>
          </select>
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            <RefreshCw className={`w-5 h-5 text-slate-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : data ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Live Visitors */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Live Besucher</p>
                  <p className="text-3xl font-bold text-white mt-1">{data.totals.liveVisitors}</p>
                  <p className="text-slate-500 text-xs mt-1">Letzte 5 Minuten</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            {/* Total Page Views */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Seitenaufrufe</p>
                  <p className="text-3xl font-bold text-white mt-1">{data.totals.pageViews.toLocaleString('de-DE')}</p>
                  <p className="text-slate-500 text-xs mt-1">Im Zeitraum</p>
                </div>
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-teal-400" />
                </div>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Eindeutige Besucher</p>
                  <p className="text-3xl font-bold text-white mt-1">{data.totals.uniqueVisitors.toLocaleString('de-DE')}</p>
                  <p className="text-slate-500 text-xs mt-1">Im Zeitraum</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              Besuchertrend
            </h2>
            <div className="h-64 flex items-end gap-1">
              {data.chartData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  Keine Daten für diesen Zeitraum
                </div>
              ) : (
                data.chartData.map((day, i) => (
                  <div 
                    key={day.date} 
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className="relative w-full flex flex-col items-center">
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-700 px-3 py-2 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                        <p className="text-white font-medium">{formatDate(day.date)}</p>
                        <p className="text-slate-300">{day.views} Aufrufe</p>
                        <p className="text-slate-300">{day.visitors} Besucher</p>
                      </div>
                      {/* Bar */}
                      <div
                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-sm hover:from-teal-500 hover:to-teal-300 transition-all cursor-pointer"
                        style={{ 
                          height: `${Math.max((day.views / maxViews) * 200, 4)}px`,
                        }}
                      />
                    </div>
                    {/* Date label - only show every few days for readability */}
                    {(i === 0 || i === data.chartData.length - 1 || i % Math.ceil(data.chartData.length / 7) === 0) && (
                      <span className="text-xs text-slate-500 mt-2">{formatDate(day.date)}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-400" />
                Top Seiten
              </h2>
              {data.topPages.length === 0 ? (
                <p className="text-slate-500">Keine Daten</p>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((page, i) => (
                    <div key={page.path} className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-slate-700 rounded text-xs text-slate-400 flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white truncate text-sm">{page.path}</p>
                      </div>
                      <span className="text-teal-400 font-medium text-sm">{page.views}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Devices */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-teal-400" />
                Geräte
              </h2>
              <div className="space-y-4">
                {/* Desktop */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">Desktop</span>
                    </div>
                    <span className="text-white font-medium">{data.devices.desktop}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${data.devices.desktop}%` }}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">Mobile</span>
                    </div>
                    <span className="text-white font-medium">{data.devices.mobile}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full transition-all"
                      style={{ width: `${data.devices.mobile}%` }}
                    />
                  </div>
                </div>

                {/* Tablet */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">Tablet</span>
                    </div>
                    <span className="text-white font-medium">{data.devices.tablet}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${data.devices.tablet}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Top Referrers */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Top Quellen</h3>
                {data.topReferrers.length === 0 ? (
                  <p className="text-slate-500 text-sm">Keine externen Quellen</p>
                ) : (
                  <div className="space-y-2">
                    {data.topReferrers.slice(0, 5).map((ref) => (
                      <div key={ref.referrer} className="flex items-center justify-between">
                        <span className="text-slate-300 text-sm truncate">{ref.referrer}</span>
                        <span className="text-teal-400 text-sm">{ref.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DSGVO Notice */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <p className="text-slate-500 text-sm text-center">
              🔒 Diese Analytics sind DSGVO-konform. Es werden keine personenbezogenen Daten gespeichert. 
              Session-Hashes werden täglich erneuert und alte Daten nach 90 Tagen gelöscht.
            </p>
          </div>
        </>
      ) : null}
    </div>
  )
}
