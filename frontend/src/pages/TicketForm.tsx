import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ticketsApi } from '../api/api';

export default function TicketForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    customer_name: '',
    customer_email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await ticketsApi.create(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create ticket.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to tickets
      </button>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Create New Ticket</h2>
          <p className="mt-1 text-sm text-gray-500">Fill in the details below to open a new support request.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium leading-6 text-gray-900">Customer Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  id="customer_name"
                  required
                  disabled={isSubmitting}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label htmlFor="customer_email" className="block text-sm font-medium leading-6 text-gray-900">Customer Email</label>
              <div className="mt-2">
                <input
                  type="email"
                  id="customer_email"
                  required
                  disabled={isSubmitting}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">Subject</label>
            <div className="mt-2">
              <input
                type="text"
                id="subject"
                required
                disabled={isSubmitting}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
            <div className="mt-2">
              <textarea
                id="description"
                rows={4}
                required
                disabled={isSubmitting}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3 disabled:opacity-50"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end gap-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
