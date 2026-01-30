'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  Clock,
  Target,
  Zap,
  Activity,
  Smartphone,
  BarChart3,
  ChevronDown,
} from 'lucide-react'

interface AdvancedMetrics {
  engagement: {
    bounceRate: number
    avgSessionDuration: number
    pageViewsPerSession: number
    returnVisitorRate: number
    conversionEvents: number
  }
  events: Array<{
    eventId: string
    eventName: string
    eventDate: string
    pageViews: number
    uniqueVisitors: number
    clickThroughRate: number
    conversionRate: number
  }>
  performance: {
    avgPageLoadTime: number
    avgFirstContentfulPaint: number
    avgLargestContentfulPaint: number
    avgCumulativeLayoutShift: number
    mobileVsDesktopLoadTime: {
      mobile: number
      desktop: number
    }
  }
  groups: Array<{
    groupId: string
    groupName: string
    pageViews: number
    uniqueVisitors: number
    avgTimeOnPage: number
    engagementRate: number
  }>
}

interface AdvancedAnalyticsProps {
  daysBack?: number
}

export default function AdvancedAnalytics({ daysBack = 7 }: AdvancedAnalyticsProps) {
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    engagement: true,
    events: true,
    performance: true,
    groups: false,
  })

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics/advanced?days=${daysBack}`)
      if (!res.ok) throw new Error('Failed to fetch advanced metrics')
      const data = await res.json()
      setMetrics(data)
      setError('')
    } catch (err) {
      setError('Fehler beim Laden der erweiterten Metriken')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [daysBack])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
        {error}
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('engagement')}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-800/70 transition"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Engagement-Metriken
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition ${
              expandedSections.engagement ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.engagement && (
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-700">
            {/* Bounce Rate */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Absprungrate</p>
              <p className="text-2xl font-bold text-white">{metrics.engagement.bounceRate}%</p>
              <p className="text-xs text-slate-500 mt-1">Single-Page-Sessions</p>
            </div>

            {/* Avg Session Duration */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Durchschn. Sitzungsdauer</p>
              <p className="text-2xl font-bold text-white">
                {metrics.engagement.avgSessionDuration}
                <span className="text-sm">s</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Pro Sitzung</p>
            </div>

            {/* Pages per Session */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Seiten pro Sitzung</p>
              <p className="text-2xl font-bold text-white">
                {metrics.engagement.pageViewsPerSession}
              </p>
              <p className="text-xs text-slate-500 mt-1">Durchschnitt</p>
            </div>

            {/* Return Visitor Rate */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Rückkehrquote</p>
              <p className="text-2xl font-bold text-white">
                {metrics.engagement.returnVisitorRate}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Wiederkehrende Besucher</p>
            </div>

            {/* Conversion Events */}
            <div className="bg-slate-900/50 rounded-lg p-4 md:col-span-2 lg:col-span-1">
              <p className="text-slate-400 text-sm mb-1">Konversionsereignisse</p>
              <p className="text-2xl font-bold text-white">{metrics.engagement.conversionEvents}</p>
              <p className="text-xs text-slate-500 mt-1">Formulare, Signups, etc.</p>
            </div>
          </div>
        )}
      </div>

      {/* Event Popularity */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('events')}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-800/70 transition"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            Beliebteste Events
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition ${
              expandedSections.events ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.events && (
          <div className="px-6 pb-6 border-t border-slate-700">
            {metrics.events.length === 0 ? (
              <p className="text-slate-500 py-4">Keine Event-Daten vorhanden</p>
            ) : (
              <div className="space-y-3">
                {metrics.events.slice(0, 8).map((event, idx) => (
                  <div key={event.eventId} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-teal-500/20 rounded text-xs text-teal-400 flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="font-medium text-white">{event.eventName}</h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(event.eventDate).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{event.pageViews}</p>
                        <p className="text-xs text-slate-500">Aufrufe</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-400">Besucher</p>
                        <p className="text-sm font-medium text-slate-300">
                          {event.uniqueVisitors}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">CTR</p>
                        <p className="text-sm font-medium text-teal-400">
                          {event.clickThroughRate}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Konv.</p>
                        <p className="text-sm font-medium text-green-400">
                          {event.conversionRate}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('performance')}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-800/70 transition"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Performance-Metriken
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition ${
              expandedSections.performance ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.performance && (
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-700">
            {/* Page Load Time */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Seitenladezeit</p>
              <p className="text-2xl font-bold text-white">
                {metrics.performance.avgPageLoadTime}
                <span className="text-sm text-slate-400">ms</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Durchschnitt</p>
              {metrics.performance.avgPageLoadTime > 3000 && (
                <p className="text-xs text-orange-400 mt-1">⚠️ Optimierung empfohlen</p>
              )}
            </div>

            {/* FCP */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">First Contentful Paint</p>
              <p className="text-2xl font-bold text-white">
                {metrics.performance.avgFirstContentfulPaint}
                <span className="text-sm text-slate-400">ms</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Erste Inhaltsrendering</p>
            </div>

            {/* LCP */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Largest Contentful Paint</p>
              <p className="text-2xl font-bold text-white">
                {metrics.performance.avgLargestContentfulPaint}
                <span className="text-sm text-slate-400">ms</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">Größter Inhaltsblock</p>
              {metrics.performance.avgLargestContentfulPaint > 2500 && (
                <p className="text-xs text-orange-400 mt-1">⚠️ Optimierung empfohlen</p>
              )}
            </div>

            {/* CLS */}
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Cumulative Layout Shift</p>
              <p className="text-2xl font-bold text-white">
                {metrics.performance.avgCumulativeLayoutShift.toFixed(3)}
              </p>
              <p className="text-xs text-slate-500 mt-1">Layout-Stabilität (Ziel: &lt;0.1)</p>
              {metrics.performance.avgCumulativeLayoutShift > 0.1 && (
                <p className="text-xs text-orange-400 mt-1">⚠️ Zu hoch</p>
              )}
            </div>

            {/* Mobile vs Desktop */}
            <div className="bg-slate-900/50 rounded-lg p-4 md:col-span-2">
              <p className="text-slate-400 text-sm mb-3">Mobile vs Desktop Ladezeit</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Mobile</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {metrics.performance.mobileVsDesktopLoadTime.mobile}ms
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">Desktop</span>
                  </div>
                  <p className="text-xl font-bold text-white">
                    {metrics.performance.mobileVsDesktopLoadTime.desktop}ms
                  </p>
                </div>
              </div>
              {metrics.performance.mobileVsDesktopLoadTime.mobile >
                metrics.performance.mobileVsDesktopLoadTime.desktop * 1.5 && (
                <p className="text-xs text-orange-400 mt-3">
                  💡 Mobile ist deutlich langsamer - Image-Optimierung prüfen
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Group Engagement */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('groups')}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-800/70 transition"
        >
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-400" />
            Gruppen-Engagement
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition ${
              expandedSections.groups ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.groups && (
          <div className="px-6 pb-6 border-t border-slate-700">
            {metrics.groups.length === 0 ? (
              <p className="text-slate-500 py-4">Keine Gruppen-Daten vorhanden</p>
            ) : (
              <div className="space-y-3">
                {metrics.groups.slice(0, 10).map((group, idx) => (
                  <div key={group.groupId} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 bg-pink-500/20 rounded text-xs text-pink-400 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-medium text-white">{group.groupName}</h4>
                      </div>
                      <p className="text-sm text-pink-400 font-medium">
                        {group.engagementRate}% Engagement
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/50">
                      <div>
                        <p className="text-xs text-slate-400">Aufrufe</p>
                        <p className="text-sm font-medium text-slate-300">
                          {group.pageViews}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Besucher</p>
                        <p className="text-sm font-medium text-slate-300">
                          {group.uniqueVisitors}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Ø Zeit</p>
                        <p className="text-sm font-medium text-slate-300">
                          {group.avgTimeOnPage}s
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Trend</p>
                        <p className="text-sm font-medium text-teal-400">↑</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
