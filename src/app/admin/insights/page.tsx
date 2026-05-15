'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

function getDeviceType(userAgent: string, isMobile: boolean) {
  if (!userAgent) return isMobile ? '📱 Mobile' : '💻 Desktop';
  
  if (/iPad|Tablet/i.test(userAgent)) return '📟 Tablet';
  if (/iPhone/i.test(userAgent)) return '🍏 iPhone';
  if (/Android/i.test(userAgent)) return '🤖 Android';
  
  return isMobile ? '📱 Mobile' : '💻 Desktop';
}

export default function MarketInsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Aggregated data states
  const [totalVisits, setTotalVisits] = useState(0)
  const [mobilePercentage, setMobilePercentage] = useState(0)
  const [topPages, setTopPages] = useState<{path: string, count: number}[]>([])
  const [topSearches, setTopSearches] = useState<{query: string, count: number}[]>([])
  const [avgTimeSpent, setAvgTimeSpent] = useState(0)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const q = query(
          collection(db, 'market_insights'),
          orderBy('timestamp', 'desc'),
          limit(500)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
        
        setInsights(data)
        
        // Calculate aggregations
        const visits = data.filter(d => d.type === 'visit');
        setTotalVisits(visits.length);
        
        if (visits.length > 0) {
          const mobileCount = visits.filter(d => d.isMobile).length;
          setMobilePercentage(Math.round((mobileCount / visits.length) * 100));
        }

        // Calculate top pages
        const pageViews = data.filter(d => d.type === 'pageview' || d.type === 'visit');
        const pageCounts: Record<string, number> = {};
        pageViews.forEach(v => {
          const path = v.pathname || '/';
          pageCounts[path] = (pageCounts[path] || 0) + 1;
        });
        
        const sortedPages = Object.entries(pageCounts)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
          
        setTopPages(sortedPages);
        
        // Calculate top searches
        const searches = data.filter(d => d.type === 'search');
        const searchCounts: Record<string, number> = {};
        searches.forEach(s => {
          const query = s.query || '';
          if (query) {
            searchCounts[query] = (searchCounts[query] || 0) + 1;
          }
        });
        const sortedSearches = Object.entries(searchCounts)
          .map(([query, count]) => ({ query, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopSearches(sortedSearches);
        
        // Calculate average time spent
        const timeSpents = data.filter(d => d.type === 'timespent');
        const totalSeconds = timeSpents.reduce((acc, curr) => acc + (curr.timeSpentSeconds || 0), 0);
        const avgTime = timeSpents.length > 0 ? Math.round(totalSeconds / timeSpents.length) : 0;
        setAvgTimeSpent(avgTime);
      } catch (error) {
        console.error("Error fetching insights:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#111111]">Market Insights</h2>
          <p className="text-sm text-gray-500">Analyze your customer traffic and behavior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Tracked Visits</h3>
          <div className="text-4xl font-serif font-bold text-[#111111]">{totalVisits}</div>
          <p className="text-sm text-gray-500 mt-2">Recent unique sessions</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Traffic</h3>
          <div className="text-4xl font-serif font-bold text-gold-600">{mobilePercentage}%</div>
          <p className="text-sm text-gray-500 mt-2">Visitors using mobile devices</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Top Page</h3>
          <div className="text-2xl font-bold text-[#111111] truncate">
            {topPages.length > 0 ? topPages[0].path : 'N/A'}
          </div>
          <p className="text-sm text-gray-500 mt-2">Most visited route</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#111111]">Popular Pages</h3>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Page Path</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-widest">Views</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">{page.path}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{page.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#111111]">Recent Visitor Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Device</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Referrer</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {insights.filter(i => i.type === 'visit').slice(0, 10).map((visit, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">
                      {getDeviceType(visit.userAgent, visit.isMobile)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {visit.location ? `${visit.location.city}, ${visit.location.country}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-[150px]">
                      {visit.referrer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#111111]">Top Searches</h3>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-widest">Search Query</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-widest">Count</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {topSearches.map((search, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#111111]">"{search.query}"</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{search.count}</td>
                  </tr>
                ))}
                {topSearches.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">No search data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Average Time Spent</h3>
          <div className="text-5xl font-serif font-bold text-gold-600">{avgTimeSpent}s</div>
          <p className="text-sm text-gray-500 mt-2">Per tracked session</p>
        </div>
      </div>
    </div>
  )
}
