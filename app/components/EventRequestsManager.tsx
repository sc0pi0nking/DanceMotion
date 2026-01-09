'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Trash2, 
  Eye, 
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

interface EventRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_type: string;
  event_date?: string;
  guest_count?: number;
  message?: string;
  status: 'new' | 'read' | 'in-progress' | 'completed' | 'rejected';
  notes?: string;
  created_at: string;
}

const STATUS_CONFIG = {
  new: { label: 'Neu', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: Clock },
  read: { label: 'Gelesen', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', icon: Eye },
  'in-progress': { label: 'In Bearbeitung', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: Clock },
  completed: { label: 'Abgeschlossen', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: CheckCircle2 },
  rejected: { label: 'Abgelehnt', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', icon: XCircle },
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: 'Hochzeit',
  corporate: 'Firmenfeier',
  birthday: 'Geburtstag',
  show: 'Show / Auftritt',
  workshop: 'Workshop',
  other: 'Sonstiges',
};

export default function EventRequestsManager() {
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/event-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to load event requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/event-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchRequests();
        if (selectedRequest?.id === id) {
          setSelectedRequest({ ...selectedRequest, status: status as any });
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const updateNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/event-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (res.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm('Anfrage wirklich löschen?')) return;

    try {
      const res = await fetch(`/api/event-requests/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchRequests();
        if (selectedRequest?.id === id) {
          setSelectedRequest(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const newCount = requests.filter(r => r.status === 'new').length;

  if (loading) {
    return <div className="p-8 text-center">Lädt Event-Anfragen...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Liste */}
      <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Event-Anfragen
              {newCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                  {newCount} neu
                </span>
              )}
            </h2>
          </div>

          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            <option value="all">Alle ({requests.length})</option>
            <option value="new">Neu ({requests.filter(r => r.status === 'new').length})</option>
            <option value="read">Gelesen ({requests.filter(r => r.status === 'read').length})</option>
            <option value="in-progress">In Bearbeitung ({requests.filter(r => r.status === 'in-progress').length})</option>
            <option value="completed">Abgeschlossen ({requests.filter(r => r.status === 'completed').length})</option>
            <option value="rejected">Abgelehnt ({requests.filter(r => r.status === 'rejected').length})</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Keine Anfragen gefunden
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {filteredRequests.map((request) => {
                const StatusIcon = STATUS_CONFIG[request.status].icon;
                return (
                  <div
                    key={request.id}
                    onClick={() => {
                      setSelectedRequest(request);
                      if (request.status === 'new') {
                        updateStatus(request.id, 'read');
                      }
                    }}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedRequest?.id === request.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{request.name}</h3>
                          {request.status === 'new' && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {EVENT_TYPE_LABELS[request.event_type] || request.event_type}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(request.created_at).toLocaleDateString('de-DE')}
                        </p>
                      </div>
                      <StatusIcon size={16} className="flex-shrink-0 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {selectedRequest ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedRequest.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedRequest.id, status)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          selectedRequest.status === status
                            ? config.color
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {config.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => deleteRequest(selectedRequest.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Kontaktdaten */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">E-Mail</p>
                    <a href={`mailto:${selectedRequest.email}`} className="font-medium hover:text-blue-600">
                      {selectedRequest.email}
                    </a>
                  </div>
                </div>

                {selectedRequest.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                      <a href={`tel:${selectedRequest.phone}`} className="font-medium hover:text-blue-600">
                        {selectedRequest.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Event-Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Event-Art</p>
                    <p className="font-medium">{EVENT_TYPE_LABELS[selectedRequest.event_type] || selectedRequest.event_type}</p>
                  </div>
                </div>

                {selectedRequest.event_date && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Wunschdatum</p>
                      <p className="font-medium">
                        {new Date(selectedRequest.event_date).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                )}

                {selectedRequest.guest_count && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Gästeanzahl</p>
                      <p className="font-medium">{selectedRequest.guest_count}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Nachricht */}
              {selectedRequest.message && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nachricht</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </div>
              )}

              {/* Notizen */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  Interne Notizen
                </label>
                <textarea
                  value={selectedRequest.notes || ''}
                  onChange={(e) => {
                    setSelectedRequest({ ...selectedRequest, notes: e.target.value });
                  }}
                  onBlur={(e) => updateNotes(selectedRequest.id, e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 resize-y"
                  rows={4}
                  placeholder="Notizen zur Anfrage..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Wählen Sie eine Anfrage aus der Liste</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
