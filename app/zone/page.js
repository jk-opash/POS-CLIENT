"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Plus, Users, Grid, MoreVertical, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

const MOCK_ZONES = [
  { id: 'main-dining', name: 'Main Dining Room', type: 'Indoor', tables: 24, activeTables: 12, capacity: 96, revenue: '₹ 45,200', status: 'Active', color: 'bg-blue-500' },
  { id: 'patio', name: 'Outdoor Patio', type: 'Outdoor', tables: 15, activeTables: 10, capacity: 60, revenue: '₹ 18,500', status: 'Active', color: 'bg-emerald-500' },
  { id: 'rooftop', name: 'Rooftop Lounge', type: 'Premium', tables: 8, activeTables: 8, capacity: 40, revenue: '₹ 32,000', status: 'Busy', color: 'bg-purple-500' },
  { id: 'bar', name: 'Main Bar', type: 'Bar', tables: 12, activeTables: 4, capacity: 24, revenue: '₹ 12,400', status: 'Active', color: 'bg-amber-500' },
];

export default function ZonePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Zone Management</h1>
              <p className="text-sm font-medium text-slate-500">Manage floor plans, table layouts, and dining areas.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow transition-all">
              <Plus size={18} /> Create New Zone
            </button>
          </div>

          {/* Zones Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MOCK_ZONES.map((zone) => (
              <div key={zone.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                
                {/* Card Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm ${zone.color}`}>
                      <Grid size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{zone.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{zone.type}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          zone.status === 'Busy' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {zone.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Card Stats */}
                <div className="p-6 bg-slate-50/50 grid grid-cols-3 gap-4 border-b border-slate-50">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tables</div>
                    <div className="text-lg font-black text-slate-700 flex items-end gap-1">
                      {zone.activeTables} <span className="text-sm font-semibold text-slate-400 mb-0.5">/ {zone.tables}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Capacity</div>
                    <div className="text-lg font-black text-slate-700 flex items-center gap-1.5">
                      {zone.capacity} <Users size={16} className="text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue Today</div>
                    <div className="text-lg font-black text-emerald-600 flex items-center gap-1.5">
                      {zone.revenue}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 flex gap-3 bg-white">
                  <button className="flex-1 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                    Zone Settings
                  </button>
                  <Link href={`/zone/${zone.id}`} className="flex-1 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-sm">
                    View Layout <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
