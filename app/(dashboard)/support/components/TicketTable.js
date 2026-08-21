"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";
import Badge from "../../../components/ui/Badge";
import { MessageSquare, AlertCircle, Clock, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import EmptyState from "../../../components/ui/EmptyState";

function formatRelativeTime(dateString) {
  if (!dateString) return "Unknown";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays} days ago`;
  } catch (e) {
    return "Invalid Date";
  }
}

function PriorityBadge({ priority }) {
  switch (priority) {
    case "emergency":
    case "critical":
      return (
        <Badge variant="danger" className="uppercase text-[10px] font-bold">
          Critical
        </Badge>
      );
    case "high":
      return (
        <Badge
          variant="warning"
          className="uppercase text-[10px] font-bold text-amber-700 bg-amber-100"
        >
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="info" className="uppercase text-[10px] font-bold">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="muted" className="uppercase text-[10px] font-bold">
          Low
        </Badge>
      );
    default:
      return <Badge variant="default">{priority}</Badge>;
  }
}

function StatusBadge({ status }) {
  switch (status) {
    case "open":
    case "reopened":
      return (
        <Badge variant="purple" dot>
          Open
        </Badge>
      );
    case "in_progress":
    case "under_investigation":
    case "testing":
      return (
        <Badge variant="info" dot>
          In Progress
        </Badge>
      );
    case "escalated":
      return (
        <Badge variant="danger" dot>
          Escalated
        </Badge>
      );
    case "waiting_for_customer":
    case "pending":
      return (
        <Badge variant="warning" dot>
          Pending
        </Badge>
      );
    case "resolved":
      return (
        <Badge variant="success" dot>
          Resolved
        </Badge>
      );
    case "closed":
    case "cancelled":
      return (
        <Badge variant="muted" dot>
          Closed
        </Badge>
      );
    default:
      return (
        <Badge variant="default" dot>
          {status}
        </Badge>
      );
  }
}

export function TicketTable({ data }) {
  const router = useRouter();

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title="No Tickets"
        message="No support tickets found."
        className="h-64"
      />
    );
  }

  return (
    <div className="rounded-xl border border-brand-border bg-white overflow-x-auto">
      <Table>
        <TableHeader className="bg-brand-light">
          <TableRow>
            <TableHead>Ticket Details</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((ticket) => (
            <TableRow
              key={ticket.id}
              className="cursor-pointer hover:bg-brand-light transition-colors"
              // onClick={() => router.push(`/support/${ticket.id}`)}
            >
              <TableCell>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {ticket.slaBreached ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-brand-placeholder" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-semibold text-brand-dark max-w-sm truncate"
                      title={ticket.subject}
                    >
                      {ticket.subject}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-brand-primary">
                        {ticket.ticketNumber}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-brand-placeholder bg-slate-100 px-1.5 py-0.5 rounded">
                        {(ticket.category || "").replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-brand-dark">
                    {ticket.businessName}
                  </span>
                  {ticket.branchName && (
                    <span className="text-xs text-brand-primary/80 font-medium">
                      Branch: {ticket.branchName}
                    </span>
                  )}
                  <span className="text-xs text-brand-muted">
                    {ticket.contactPerson}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-sm text-brand-muted">
                  {ticket.assignedTo || "Unassigned"}
                </span>
              </TableCell>

              <TableCell>
                <PriorityBadge priority={ticket.priority} />
              </TableCell>

              <TableCell>
                <StatusBadge status={ticket.status} />
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-brand-muted">
                    {formatRelativeTime(ticket.updatedAt)}
                  </span>
                  {ticket.slaDeadline && !ticket.slaBreached && (
                    <span className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> Due{" "}
                      {formatRelativeTime(ticket.slaDeadline)}
                    </span>
                  )}
                  {ticket.slaBreached && (
                    <span className="text-[10px] text-red-600 font-bold mt-0.5">
                      SLA Breached
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
