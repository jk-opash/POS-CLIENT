"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { 
  FolderOpen, 
  FileText, 
  Upload, 
  Search, 
  MoreVertical, 
  Download, 
  Eye, 
  Trash2, 
  AlertCircle,
  FileBadge,
  HardDrive,
  Filter
} from "lucide-react";

// MOCK DATA
const CATEGORIES = [
  { id: 'all', name: 'All Documents', count: 42 },
  { id: 'legal', name: 'Legal & Compliance', count: 15 },
  { id: 'operations', name: 'Operations', count: 8 },
  { id: 'financial', name: 'Financial', count: 12 },
  { id: 'hr', name: 'HR & Staff', count: 7 },
];

const DOCUMENTS = [
  { id: 1, name: "FSSAI License - Mumbai", category: "Legal & Compliance", uploadDate: "15 Jan 2023", expiryDate: "15 Jan 2027", status: "Valid", type: "pdf", size: "2.4 MB" },
  { id: 2, name: "Trade License - Bangalore", category: "Legal & Compliance", uploadDate: "10 May 2022", expiryDate: "10 May 2023", status: "Expired", type: "pdf", size: "1.1 MB" },
  { id: 3, name: "Fire Safety NOC - Delhi", category: "Legal & Compliance", uploadDate: "01 Aug 2023", expiryDate: "10 Aug 2024", status: "Expiring Soon", type: "pdf", size: "3.5 MB" },
  { id: 4, name: "Commercial Lease - Indiranagar", category: "Operations", uploadDate: "20 Nov 2021", expiryDate: "20 Nov 2031", status: "Valid", type: "pdf", size: "15.0 MB" },
  { id: 5, name: "GST Registration Certificate", category: "Financial", uploadDate: "05 Apr 2020", expiryDate: "-", status: "Valid", type: "pdf", size: "800 KB" },
  { id: 6, name: "Front of House SOP Manual v2", category: "Operations", uploadDate: "10 Jan 2024", expiryDate: "-", status: "Valid", type: "doc", size: "5.2 MB" },
  { id: 7, name: "Zomato Vendor Agreement", category: "Financial", uploadDate: "15 Jun 2023", expiryDate: "-", status: "Valid", type: "pdf", size: "4.1 MB" },
  { id: 8, name: "Employee Handbook 2024", category: "HR & Staff", uploadDate: "05 Jan 2024", expiryDate: "-", status: "Valid", type: "pdf", size: "8.7 MB" },
  { id: 9, name: "Liquor License - Goa", category: "Legal & Compliance", uploadDate: "20 Dec 2022", expiryDate: "20 Dec 2024", status: "Valid", type: "pdf", size: "4.2 MB" },
];

export default function BriefcasePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = DOCUMENTS.filter(doc => {
    const matchesCategory = activeCategory === 'all' || 
      (activeCategory === 'legal' && doc.category === 'Legal & Compliance') ||
      (activeCategory === 'operations' && doc.category === 'Operations') ||
      (activeCategory === 'financial' && doc.category === 'Financial') ||
      (activeCategory === 'hr' && doc.category === 'HR & Staff');
    
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Valid':
        return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Valid</span>;
      case 'Expiring Soon':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1"><AlertCircle size={12}/> Expiring</span>;
      case 'Expired':
        return <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold border border-rose-100 flex items-center gap-1"><AlertCircle size={12}/> Expired</span>;
      default:
        return <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-hidden flex p-8 gap-8">
          
          {/* Left Panel: Folders & Storage */}
          <div className="w-64 flex flex-col gap-6 shrink-0">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight mb-4">Briefcase</h2>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen size={18} className={activeCategory === cat.id ? 'text-blue-200' : 'text-slate-400'} />
                      {cat.name}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeCategory === cat.id ? 'bg-blue-500/50 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <HardDrive size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">Storage</div>
                  <div className="text-xs font-medium text-slate-500">1.2 GB of 5 GB used</div>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-96">
                <Search size={18} className="absolute left-4 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search documents..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400 shadow-sm transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <Filter size={16} className="text-slate-400" /> Filter
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-sm hover:bg-blue-700 hover:shadow transition-all">
                  <Upload size={18} /> Upload Document
                </button>
              </div>
            </div>

            {/* Expiry Alerts (Only show in 'All' or 'Legal') */}
            {(activeCategory === 'all' || activeCategory === 'legal') && (
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-500 shrink-0 shadow-sm">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-800 mb-1">Trade License Expired</h4>
                    <p className="text-xs font-medium text-rose-600/80">The Trade License for Bangalore outlet expired on 10 May 2023. Immediate renewal required to avoid penalties.</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 mb-1">Fire NOC Expiring Soon</h4>
                    <p className="text-xs font-medium text-amber-600/80">The Fire Safety NOC for Delhi outlet expires in 12 days. Please initiate the renewal process.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Document Data Table */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-100">
                    <tr>
                      <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Document Name</th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Upload Date</th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Expiry Date</th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 font-bold text-xs text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.map((doc, i) => (
                      <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                            }`}>
                              <FileText size={16} />
                            </div>
                            <div>
                              <div className="font-bold text-slate-700">{doc.name}</div>
                              <div className="text-xs font-medium text-slate-400">{doc.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-500">{doc.category}</td>
                        <td className="py-4 px-6 font-medium text-slate-600">{doc.uploadDate}</td>
                        <td className="py-4 px-6 font-medium text-slate-600">{doc.expiryDate}</td>
                        <td className="py-4 px-6">
                          {getStatusBadge(doc.status)}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors tooltip" title="View">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors tooltip" title="Download">
                              <Download size={16} />
                            </button>
                            <button className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors tooltip" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDocs.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-12 text-center text-slate-500 font-medium">
                          <FileBadge size={48} className="mx-auto text-slate-200 mb-4" />
                          No documents found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
