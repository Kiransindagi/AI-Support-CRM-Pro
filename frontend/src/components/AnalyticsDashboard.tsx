import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { CheckCircle2, CircleDashed, LayoutDashboard, TicketIcon } from 'lucide-react';
import { analyticsApi } from '../api/api';
import type { AnalyticsSummary } from '../types';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await analyticsApi.getSummary();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-5 border border-gray-100 shadow-sm h-24"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm h-80"></div>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm h-80"></div>
        </div>
      </div>
    );
  }

  // Format data for charts
  const categoryData = Object.entries(data.categories).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  const sentimentData = Object.entries(data.sentiments).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = {
    'Positive': '#10B981', // green
    'Neutral': '#9CA3AF',  // gray
    'Negative': '#F43F5E', // rose
    'Urgent': '#F59E0B'    // amber
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <LayoutDashboard className="h-5 w-5 mr-2 text-indigo-600" />
        System Overview
      </h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
              <TicketIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
              <dd className="text-2xl font-bold text-gray-900">{data.overview.total}</dd>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-amber-50 rounded-md p-3">
              <CircleDashed className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Open / In Progress</dt>
              <dd className="text-2xl font-bold text-gray-900">{data.overview.open + data.overview.in_progress}</dd>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-emerald-50 rounded-md p-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
              <dd className="text-2xl font-bold text-gray-900">{data.overview.resolved}</dd>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-rose-50 rounded-md p-3">
              <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Urgent Issues</dt>
              <dd className="text-2xl font-bold text-gray-900">{data.sentiments['Urgent'] || 0}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Bar Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base font-medium text-gray-900 mb-4">Ticket Volume by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
          <h3 className="text-base font-medium text-gray-900 mb-4">AI Sentiment Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#4F46E5'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
