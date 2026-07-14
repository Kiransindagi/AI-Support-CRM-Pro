import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ticketsApi } from '../api/api';
import type { TicketListResponse } from '../types';
import TicketSearchFilter from '../components/TicketSearchFilter';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { cn } from '../utils';

export default function TicketList() {
  const [tickets, setTickets] = useState<TicketListResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignedToMe, setAssignedToMe] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await ticketsApi.list(searchTerm, statusFilter, assignedToMe);
        setTickets(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to fetch tickets.');
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce could go here, but for now just fetch immediately
    fetchTickets();
  }, [searchTerm, statusFilter, assignedToMe]);

  return (
    <div className="max-w-7xl mx-auto">
      <AnalyticsDashboard />

      <div className="flex items-center justify-between mb-8 mt-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and respond to customer support tickets.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAssignedToMe(!assignedToMe)}
            className={cn(
              "inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg shadow-sm focus:outline-none transition-colors",
              assignedToMe 
                ? "border-indigo-600 text-indigo-700 bg-indigo-50 hover:bg-indigo-100" 
                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            )}
          >
            My Tickets
          </button>
          <Link 
            to="/tickets/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Create Ticket
          </Link>
        </div>
      </div>

      <TicketSearchFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">ID</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Subject</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Sentiment</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  Loading tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-gray-500">
                  No tickets found matching your criteria.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{ticket.ticket_id}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.subject}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.customer_name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                      ticket.status === 'Open' ? "bg-green-50 text-green-700 ring-green-600/20" :
                      ticket.status === 'In Progress' ? "bg-blue-50 text-blue-700 ring-blue-600/20" :
                      "bg-gray-50 text-gray-600 ring-gray-500/10"
                    )}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{ticket.category}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                      ticket.sentiment === 'Positive' ? "bg-green-50 text-green-700 ring-green-600/20" :
                      ticket.sentiment === 'Urgent' ? "bg-red-50 text-red-700 ring-red-600/20" :
                      ticket.sentiment === 'Negative' ? "bg-orange-50 text-orange-700 ring-orange-600/20" :
                      "bg-gray-50 text-gray-600 ring-gray-500/10"
                    )}>
                      {ticket.sentiment}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link to={`/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900">View<span className="sr-only">, {ticket.ticket_id}</span></Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
