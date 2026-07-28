'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Book, Settings, Printer, PieChart, FileText,
  MessageCircle, PhoneCall, Mail, ChevronDown,
  PlayCircle, Ticket, CheckCircle2, Clock, LifeBuoy
} from 'lucide-react';

// --- MOCK DATA ---
const TOPICS = [
  { id: 't1', title: 'Getting Started', desc: 'Basic setup and orientation', icon: Book, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', count: 12 },
  { id: 't2', title: 'Billing & POS', desc: 'Order management & payments', icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100', count: 24 },
  { id: 't3', title: 'Menu & Inventory', desc: 'Items, categories & stock', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', count: 18 },
  { id: 't4', title: 'Hardware', desc: 'Printers, scanners & drawers', icon: Printer, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100', count: 8 },
  { id: 't5', title: 'Reports & Analytics', desc: 'Sales, taxes & staff performance', icon: PieChart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', count: 15 },
  { id: 't6', title: 'Taxes & GST', desc: 'Compliance & tax rates', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100', count: 6 },
];

const FAQS = [
  {
    id: 'f1',
    category: 'Billing',
    question: 'How do I split a bill between multiple customers?',
    answer: 'To split a bill, open the active order and click on the "Split Bill" button at the bottom of the checkout screen. You can split equally by number of people or by selected items.'
  },
  {
    id: 'f2',
    category: 'Hardware',
    question: 'My receipt printer is not connecting. What should I do?',
    answer: 'First, check if the printer is turned on and connected to the same Wi-Fi network as your POS device. Go to Settings > Hardware > Printers and click "Refresh". If it still does not show up, try restarting both devices.'
  },
  {
    id: 'f3',
    category: 'Inventory',
    question: 'How to add a new menu item with variations?',
    answer: 'Navigate to Menu > Items and click "Add Item". Fill in the basic details, then scroll down to the "Variations" section to add sizes or add-ons like extra cheese or toppings.'
  },
  {
    id: 'f4',
    category: 'Reports',
    question: 'Where can I find the end-of-day sales summary?',
    answer: 'Go to the Reports section and select "Day End Summary". You can filter by date, shift, or employee, and export the report as a PDF or Excel file.'
  },
  {
    id: 'f5',
    category: 'General',
    question: 'How do I reset my POS manager password?',
    answer: 'Log out of the system, click on "Forgot Password" on the login screen, and enter your registered email address. A reset link will be sent to you.'
  }
];

const RECENT_TICKETS = [
  { id: 'TCK-9025', subject: 'Tax report mismatch for Q2', status: 'In Progress', date: '5 hours ago', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'TCK-9021', subject: 'Printer alignment issue', status: 'Resolved', date: '2 days ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const VIDEO_GUIDES = [
  { id: 'v1', title: 'Mastering the POS Dashboard', duration: '5:20', thumbBg: 'bg-blue-100', thumbColor: 'text-blue-500' },
  { id: 'v2', title: 'Setting up your first printer', duration: '3:45', thumbBg: 'bg-emerald-100', thumbColor: 'text-emerald-500' },
  { id: 'v3', title: 'Managing employee permissions', duration: '4:15', thumbBg: 'bg-purple-100', thumbColor: 'text-purple-500' },
];

// --- COMPONENTS ---

export default function HelpPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar onMenuClick={() => setCollapsed(c => !c)} />
        
        <main className="flex-1 overflow-y-auto">
          {/* HERO SECTION */}
          <div className="bg-slate-900 pt-16 pb-24 px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-500 blur-[100px]"></div>
              <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-emerald-500 blur-[80px]"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 text-center">
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight">How can we help you today?</h1>
              <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Search our knowledge base, read guides, or get in touch with our support team.</p>
              
              <div className="relative max-w-2xl mx-auto">
                <Search size={20} className="absolute left-4 top-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles, guides, or troubleshooting..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-0 shadow-2xl text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg placeholder:text-slate-400 transition-shadow"
                />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 -mt-10 relative z-20 pb-20">
            {/* MAIN CONTENT GRID */}
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* LEFT COLUMN */}
              <div className="flex-1 space-y-8">
                
                {/* Topics Grid */}
                {!searchQuery && (
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                      <Book size={18} className="text-slate-400" /> Browse by Topic
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {TOPICS.map(topic => (
                        <div key={topic.id} className="group p-4 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex gap-4 bg-slate-50/50 hover:bg-white">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${topic.bg} ${topic.color} ${topic.border} border`}>
                            <topic.icon size={24} strokeWidth={2.5} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{topic.title}</h3>
                            <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{topic.desc}</p>
                            <span className="inline-block mt-2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{topic.count} articles</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQs */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <LifeBuoy size={18} className="text-slate-400" /> {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
                  </h2>
                  <div className="space-y-3">
                    {filteredFaqs.length > 0 ? filteredFaqs.map(faq => (
                      <div key={faq.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                        <button 
                          onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 block">{faq.category}</span>
                            <h3 className="font-bold text-slate-800 text-sm">{faq.question}</h3>
                          </div>
                          <ChevronDown size={18} className={`text-slate-400 transition-transform ${activeFaq === faq.id ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeFaq === faq.id && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 py-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-white">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Search size={24} className="text-slate-400" />
                        </div>
                        <p className="text-slate-500 font-medium">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN */}
              <div className="w-full lg:w-80 space-y-6">
                
                {/* Contact Options */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Contact Support</h2>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors text-left group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                        <MessageCircle size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-blue-900 text-sm">Live Chat</div>
                        <div className="text-blue-600/70 text-xs font-medium">Response in ~2 mins</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-left group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                        <PhoneCall size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Phone Support</div>
                        <div className="text-slate-500 text-xs font-medium">1-800-POS-HELP</div>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-left group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Mail size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Email Us</div>
                        <div className="text-slate-500 text-xs font-medium">support@posystem.com</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Your Tickets</h2>
                    <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {RECENT_TICKETS.map(ticket => (
                      <div key={ticket.id} className="flex gap-3 items-start cursor-pointer group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${ticket.bg} ${ticket.color}`}>
                          <ticket.icon size={14} strokeWidth={3} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{ticket.subject}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-500">{ticket.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-bold text-slate-400">{ticket.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Guides */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <PlayCircle size={16} className="text-red-500" /> Video Guides
                  </h2>
                  <div className="space-y-3">
                    {VIDEO_GUIDES.map(video => (
                      <div key={video.id} className="group cursor-pointer flex gap-3 items-center">
                        <div className={`w-16 h-12 rounded-xl flex items-center justify-center relative overflow-hidden shrink-0 ${video.thumbBg} ${video.thumbColor}`}>
                          <PlayCircle size={20} className="relative z-10 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight mb-1">{video.title}</h4>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{video.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
