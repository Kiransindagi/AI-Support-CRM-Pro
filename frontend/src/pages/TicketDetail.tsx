import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, User, Mail, Calendar, MessageSquare } from 'lucide-react';
import { ticketsApi, notesApi, usersApi } from '../api/api';
import type { TicketResponse, NoteResponse, User as AgentUser } from '../types';
import { cn } from '../utils';

export default function TicketDetail() {
  const { id } = useParams();
  const ticketId = parseInt(id as string, 10);
  
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [notes, setNotes] = useState<NoteResponse[]>([]);
  const [agents, setAgents] = useState<AgentUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [newNote, setNewNote] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true);
      try {
        const [ticketData, notesData, agentsData] = await Promise.all([
          ticketsApi.get(ticketId),
          notesApi.list(ticketId),
          usersApi.getAgents()
        ]);
        setTicket(ticketData);
        setNotes(notesData);
        setAgents(agentsData);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load ticket details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketData();
    }
  }, [ticketId]);

  const handlePostNote = async () => {
    if (!newNote.trim()) return;
    
    setIsPosting(true);
    try {
      const addedNote = await notesApi.create(ticketId, { note_text: newNote });
      setNotes([...notes, addedNote]);
      setNewNote('');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to post note.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket || ticket.status === newStatus) return;
    
    setIsUpdatingStatus(true);
    try {
      const updated = await ticketsApi.update(ticketId, { status: newStatus });
      setTicket(updated);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssigneeChange = async (agentId: string) => {
    if (!ticket) return;
    
    setIsUpdatingStatus(true);
    try {
      const updated = await ticketsApi.update(ticketId, { assigned_to_id: agentId ? parseInt(agentId) : null });
      setTicket(updated);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to assign agent.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading ticket details...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>{error || 'Ticket not found'}</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link 
        to="/"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Ticket Header & Description */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
                <p className="text-sm font-medium text-gray-500">Ticket #{ticket.ticket_id}</p>
              </div>
              <span className={cn(
                "inline-flex items-center rounded-md px-2.5 py-1 text-sm font-medium ring-1 ring-inset",
                ticket.status === 'Open' ? "bg-green-50 text-green-700 ring-green-600/20" :
                ticket.status === 'In Progress' ? "bg-blue-50 text-blue-700 ring-blue-600/20" :
                "bg-gray-50 text-gray-600 ring-gray-500/10"
              )}>
                {ticket.status}
              </span>
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-700 mt-6 pt-6 border-t border-gray-100">
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
              Notes & Activity
            </h2>

            <div className="space-y-6 mb-8">
              {notes.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No notes yet.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Agent</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-700">
                        <p className="whitespace-pre-wrap">{note.note_text}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Note Form */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              <label htmlFor="note" className="sr-only">Add a note</label>
              <textarea
                id="note"
                rows={3}
                disabled={isPosting}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                placeholder="Add a note to this ticket..."
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  disabled={isPosting || !newNote.trim()}
                  onClick={handlePostNote}
                  className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50"
                >
                  {isPosting ? 'Posting...' : 'Post Note'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-900">{ticket.customer_name}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <a href={`mailto:${ticket.customer_email}`} className="text-indigo-600 hover:underline">{ticket.customer_email}</a>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Ticket Info</h3>
            <div className="space-y-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600">Created: </span>
                <span className="text-gray-900 ml-1 font-medium">{format(new Date(ticket.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600">Updated: </span>
                <span className="text-gray-900 ml-1 font-medium">{format(new Date(ticket.updated_at), 'MMM d, yyyy')}</span>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Category</span>
                  <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                    {ticket.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Sentiment</span>
                  <span className={cn(
                    "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                    ticket.sentiment === 'Positive' ? "bg-green-50 text-green-700 ring-green-600/20" :
                    ticket.sentiment === 'Urgent' ? "bg-red-50 text-red-700 ring-red-600/20" :
                    ticket.sentiment === 'Negative' ? "bg-orange-50 text-orange-700 ring-orange-600/20" :
                    "bg-gray-50 text-gray-600 ring-gray-500/10"
                  )}>
                    {ticket.sentiment}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <select 
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white disabled:opacity-50"
                  value={ticket.status}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Agent</label>
                <select 
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white disabled:opacity-50"
                  value={ticket.assigned_to_id || ""}
                  disabled={isUpdatingStatus}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.full_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
