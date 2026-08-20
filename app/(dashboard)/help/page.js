"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Book,
  Settings,
  Printer,
  PieChart,
  FileText,
  MessageCircle,
  PhoneCall,
  Mail,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  Clock,
  LifeBuoy,
  Ticket,
  Video,
} from "lucide-react";

// --- MOCK DATA ---
const TOPICS = [
  {
    id: "t1",
    title: "Getting Started",
    desc: "Basic setup and orientation",
    icon: Book,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    count: 12,
  },
  {
    id: "t2",
    title: "Billing & POS",
    desc: "Order management & payments",
    icon: FileText,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    count: 24,
  },
  {
    id: "t3",
    title: "Menu & Inventory",
    desc: "Items, categories & stock",
    icon: Settings,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    count: 18,
  },
  {
    id: "t4",
    title: "Hardware",
    desc: "Printers, scanners & drawers",
    icon: Printer,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
    count: 8,
  },
  {
    id: "t5",
    title: "Reports & Analytics",
    desc: "Sales, taxes & staff performance",
    icon: PieChart,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    count: 15,
  },
  {
    id: "t6",
    title: "Taxes & GST",
    desc: "Compliance & tax rates",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    count: 6,
  },
];

const FAQS = [
  {
    id: "f1",
    category: "Billing",
    question: "How do I split a bill between multiple customers?",
    answer:
      'To split a bill, open the active order and click on the "Split Bill" button at the bottom of the checkout screen. You can split equally by number of people or by selected items.',
  },
  {
    id: "f2",
    category: "Hardware",
    question: "My receipt printer is not connecting. What should I do?",
    answer:
      'First, check if the printer is turned on and connected to the same Wi-Fi network as your POS device. Go to Settings > Hardware > Printers and click "Refresh". If it still does not show up, try restarting both devices.',
  },
  {
    id: "f3",
    category: "Inventory",
    question: "How to add a new menu item with variations?",
    answer:
      'Navigate to Menu > Items and click "Add Item". Fill in the basic details, then scroll down to the "Variations" section to add sizes or add-ons like extra cheese or toppings.',
  },
  {
    id: "f4",
    category: "Reports",
    question: "Where can I find the end-of-day sales summary?",
    answer:
      'Go to the Reports section and select "Day End Summary". You can filter by date, shift, or employee, and export the report as a PDF or Excel file.',
  },
  {
    id: "f5",
    category: "General",
    question: "How do I reset my POS manager password?",
    answer:
      'Log out of the system, click on "Forgot Password" on the login screen, and enter your registered email address. A reset link will be sent to you.',
  },
];

const RECENT_TICKETS = [
  {
    id: "TCK-9025",
    subject: "Tax report mismatch for Q2",
    status: "In Progress",
    date: "5 hours ago",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    id: "TCK-9021",
    subject: "Printer alignment issue",
    status: "Resolved",
    date: "2 days ago",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

const VIDEO_GUIDES = [
  {
    id: "v1",
    title: "Mastering the POS Dashboard",
    duration: "5:20",
    thumbBg: "bg-blue-100",
    thumbColor: "text-blue-500",
  },
  {
    id: "v2",
    title: "Setting up your first printer",
    duration: "3:45",
    thumbBg: "bg-emerald-100",
    thumbColor: "text-emerald-500",
  },
  {
    id: "v3",
    title: "Managing employee permissions",
    duration: "4:15",
    thumbBg: "bg-purple-100",
    thumbColor: "text-purple-500",
  },
];

const TABS = [
  { key: "articles", label: "Articles & Guides", icon: Book },
  { key: "faqs", label: "FAQs", icon: LifeBuoy },
  { key: "support", label: "Support Tickets", icon: Ticket },
  { key: "videos", label: "Video Tutorials", icon: Video },
];

export default function HelpPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("articles");
  const [activeFaq, setActiveFaq] = useState(null);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Help & Support
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search our knowledge base, read guides, or contact support.
              </p>
            </div>

            <button className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center gap-2">
              <Ticket size={16} /> New Support Ticket
            </button>
          </div>

          {/* Tabs & Search */}
          <div className="border-b border-slate-200 bg-white/50 flex flex-col md:flex-row gap-4 justify-between backdrop-blur-md rounded-t-2xl px-2 pt-2 md:pt-0">
            <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-2 border-b-2 font-bold text-sm transition-all duration-300 ease-spring ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <tab.icon size={16} className="inline mr-2 -mt-0.5" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex items-center pb-2 md:pb-0 pr-2 w-full md:w-auto shrink-0">
              <div className="relative w-full md:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full transition-all text-slate-700 placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="space-y-4 md:space-y-5">
            {/* Articles Tab */}
            {activeTab === "articles" && (
              <div className="bg-white p-6 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Book size={20} className="text-indigo-500" /> Browse by Topic
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {TOPICS.map((topic) => (
                    <div
                      key={topic.id}
                      className="group p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex flex-col gap-4 bg-slate-50/50 hover:bg-indigo-50/10"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${topic.bg} ${topic.color} ${topic.border} border`}
                        >
                          <topic.icon size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {topic.title}
                          </h4>
                          <span className="inline-block mt-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                            {topic.count} articles
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-sm">{topic.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === "faqs" && (
              <div className="bg-white p-6 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <LifeBuoy size={20} className="text-indigo-500" /> Frequently
                  Asked Questions
                </h3>
                <div className="space-y-3 max-w-4xl">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50"
                      >
                        <button
                          onClick={() =>
                            setActiveFaq(activeFaq === faq.id ? null : faq.id)
                          }
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-100 transition-colors"
                        >
                          <div>
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 block">
                              {faq.category}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm">
                              {faq.question}
                            </h4>
                          </div>
                          <ChevronDown
                            size={18}
                            className={`text-slate-400 shrink-0 transition-transform ${activeFaq === faq.id ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeFaq === faq.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
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
                    ))
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={24} className="text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">
                        No results found for "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === "support" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                {/* Contact Options */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <MessageCircle size={20} className="text-indigo-500" />{" "}
                    Contact Support
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors text-left group">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-indigo-900 text-sm">
                          Live Chat
                        </div>
                        <div className="text-indigo-600/80 text-xs font-semibold mt-0.5">
                          Response in ~2 mins
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left group">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                        <PhoneCall size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          Phone Support
                        </div>
                        <div className="text-slate-500 text-xs font-semibold mt-0.5">
                          1-800-POS-HELP
                        </div>
                      </div>
                    </button>
                    <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left group">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                        <Mail size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">
                          Email Us
                        </div>
                        <div className="text-slate-500 text-xs font-semibold mt-0.5">
                          support@posystem.com
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Ticket size={20} className="text-indigo-500" /> Your
                      Tickets
                    </h3>
                    <button className="text-indigo-600 text-xs font-bold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {RECENT_TICKETS.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex gap-4 items-start p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 transition-colors cursor-pointer group shadow-sm hover:shadow"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${ticket.bg} ${ticket.color} border-current/10`}
                        >
                          <ticket.icon size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {ticket.subject}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ticket.bg} ${ticket.color} border-current/20`}
                            >
                              {ticket.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <span>{ticket.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span>{ticket.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="bg-white p-6 rounded-b-2xl md:rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Video size={20} className="text-indigo-500" /> Video
                  Tutorials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {VIDEO_GUIDES.map((video) => (
                    <div
                      key={video.id}
                      className="group cursor-pointer flex flex-col gap-3"
                    >
                      <div
                        className={`w-full aspect-video rounded-2xl flex items-center justify-center relative overflow-hidden shrink-0 ${video.thumbBg} ${video.thumbColor} transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg border border-current/10`}
                      >
                        <PlayCircle
                          size={48}
                          strokeWidth={1.5}
                          className="relative z-10 opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-1">
                          <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">
                            {video.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded whitespace-nowrap">
                            {video.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
