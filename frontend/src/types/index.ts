export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface TicketCreate {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}

export interface TicketUpdate {
  status?: string;
  note_text?: string;
  assigned_to_id?: number | null;
}

export interface TicketResponse {
  id: number;
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: string;
  category: string;
  sentiment: string;
  assigned_to_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface TicketListResponse {
  id: number;
  ticket_id: string;
  customer_name: string;
  subject: string;
  status: string;
  category: string;
  sentiment: string;
  assigned_to_id: number | null;
  created_at: string;
}

export interface NoteCreate {
  note_text: string;
}

export interface NoteResponse {
  id: number;
  ticket_id: number;
  note_text: string;
  created_at: string;
}

export interface AnalyticsSummary {
  overview: {
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  sentiments: Record<string, number>;
  categories: Record<string, number>;
}
