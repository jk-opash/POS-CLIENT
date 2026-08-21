"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSupportTickets } from '../../store/slices/supportTicketSlice';
import { TicketTable } from './components/TicketTable';
import { Select } from '../../components/ui/Select';
import { StatsCard } from '../../components/ui/StatsCard';
import Button from '../../components/ui/Button';
import { Search, Filter, AlertCircle, Clock, CheckCircle2, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const router = useRouter();

  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.supportTicket);

  useEffect(() => {
    dispatch(fetchSupportTickets({ status: statusFilter, priority: priorityFilter, search: searchTerm }));
  }, [dispatch, statusFilter, priorityFilter, searchTerm]);

  // Calculate KPIs based on the fetched tickets
  const totalOpen = (tickets || []).filter(t => ['open', 'in_progress', 'escalated'].includes(t.status)).length;
  const totalBreached = (tickets || []).filter(t => t.slaBreached && t.status !== 'closed' && t.status !== 'resolved').length;
  const validCsatTickets = (tickets || []).filter(t => t.csatScore !== undefined && t.csatScore !== null);
  const avgCsat = validCsatTickets.length > 0 
    ? validCsatTickets.reduce((acc, t) => acc + (t.csatScore || 0), 0) / validCsatTickets.length 
    : 0;

  const validResTimeTickets = (tickets || []).filter(t => t.resolutionTimeHrs !== undefined && t.resolutionTimeHrs !== null);
  const avgResolutionTime = validResTimeTickets.length > 0
    ? validResTimeTickets.reduce((acc, t) => acc + (t.resolutionTimeHrs || 0), 0) / validResTimeTickets.length
    : 0;

  return (
    <div className="space-y-6 pb-12 p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark">Support Desk</h2>
          <p className="mt-1 text-sm text-brand-muted">
            Manage your issues, track resolution, and monitor customer satisfaction.
          </p>
        </div>
        <Button 
          className="bg-brand-primary hover:bg-brand-primaryDark text-white"
          onClick={() => router.push('/support/new')}
        >
          + Create Ticket
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Open Tickets"
          value={totalOpen}
          icon={<Ticket className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="SLA Breached"
          value={totalBreached}
          icon={<AlertCircle className={`h-5 w-5 ${totalBreached > 0 ? 'text-red-500' : 'text-emerald-500'}`} />}
        />
        <StatsCard
          title="Avg Resolution Time"
          value={avgResolutionTime > 0 ? `${avgResolutionTime.toFixed(1)} hrs` : '-'}
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />
        <StatsCard
          title="Avg CSAT Score"
          value={avgCsat > 0 ? `${avgCsat.toFixed(1)} / 5.0` : '-'}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        />
      </div>

      <div className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden p-6 space-y-4">
        {/* Filters Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-placeholder" />
            <input
              type="text"
              placeholder="Search by subject, business or ticket number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-border text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          <div className="flex w-full lg:w-auto gap-3">
            <div className="w-full lg:w-40">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Active Issues', value: 'open' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Closed', value: 'closed' },
                ]}
              />
            </div>
            <div className="w-full lg:w-40">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={[
                  { label: 'All Priorities', value: 'all' },
                  { label: 'Critical', value: 'critical' },
                  { label: 'High', value: 'high' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Low', value: 'low' },
                ]}
              />
            </div>
            <Button variant="outline" className="px-3">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm font-medium text-brand-muted">
            Loading support tickets...
          </div>
        ) : (
          <TicketTable data={tickets} />
        )}
      </div>
    </div>
  );
}
