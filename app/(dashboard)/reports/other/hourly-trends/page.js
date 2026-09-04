"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronLeft,
  Calendar,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  Activity,
  Search,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchHourlyTrends } from "../../../../store/slices/analyticsSlice";
import { fetchBranches } from "../../../../store/slices/branchSlice";
import StatCard from "../../../../components/ui/StatCard";
import DateRangePicker from "../../../../components/ui/DateRangePicker";
import PosAdminPagination from "../../../menu/components/PosAdminPagination";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

export default function HourlyTrendsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { branches } = useSelector((state) => state.branch);
  const { hourlyTrendsData, hourlyTrendsLoading } = useSelector(
    (state) => state.analytics,
  );

  const [timeRange, setTimeRange] = useState("today");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const businessId =
      user?.businesses?.[0]?.id || user?.businessId || user?.business_id;
    if (businessId && branches.length === 0) {
      dispatch(fetchBranches(businessId));
    }
  }, [dispatch, user, branches.length]);

  // Auto-select first branch when branches load
  useEffect(() => {
    if (!selectedBranch && branches && branches.length > 0) {
      setSelectedBranch(branches[0].id);
    }
  }, [branches, selectedBranch]);

  useEffect(() => {
    const params = { timeRange };
    if (selectedBranch) params.branchId = selectedBranch;
    if (dateRange.start && dateRange.end) {
      params.startDate = dateRange.start;
      params.endDate = dateRange.end;
      delete params.timeRange;
    }
    dispatch(fetchHourlyTrends(params));
  }, [dispatch, timeRange, selectedBranch, dateRange]);

  const fmt = (num) => Number(num || 0).toLocaleString("en-IN");

  const formattedData = useMemo(() => {
    if (!hourlyTrendsData || hourlyTrendsData.length === 0) return [];

    // Check if there is any data at all to avoid showing a flat zero chart
    const hasData = hourlyTrendsData.some(
      (d) => d.orderCount > 0 || d.totalSales > 0,
    );
    if (!hasData) return [];

    return hourlyTrendsData.map((d) => ({
      ...d,
      timeLabel: `${d.hour.toString().padStart(2, "0")}:00`,
      displaySales: Number(d.totalSales.toFixed(2)),
      displayAvg: Number(d.averageOrderValue.toFixed(2)),
    }));
  }, [hourlyTrendsData]);

  // Calculations for KPIs
  const totalOrders = useMemo(
    () => formattedData.reduce((acc, curr) => acc + curr.orderCount, 0),
    [formattedData],
  );

  const totalRevenue = useMemo(
    () => formattedData.reduce((acc, curr) => acc + curr.totalSales, 0),
    [formattedData],
  );

  const avgOrderValue =
    totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  const busiestHourData = [...formattedData].sort(
    (a, b) => b.orderCount - a.orderCount,
  )[0];
  const busiestHour =
    busiestHourData?.orderCount > 0 ? busiestHourData.timeLabel : "N/A";

  const peakRevenueData = [...formattedData].sort(
    (a, b) => b.totalSales - a.totalSales,
  )[0];
  const peakRevenueHour =
    peakRevenueData?.totalSales > 0 ? peakRevenueData.timeLabel : "N/A";

  const totalPages = Math.ceil(formattedData.length / itemsPerPage);
  const paginatedData = formattedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [timeRange, selectedBranch, dateRange]);

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
      <div className="flex flex-1 min-w-0 flex-col">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Header & Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  href="/reports/other"
                  className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors mb-2"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back to Reports
                </Link>
                <h2 className="text-2xl font-bold text-brand-dark">
                  Hourly Trends
                </h2>
                <p className="mt-1 text-sm text-brand-muted">
                  Analyze peak operating hours, sales velocity, and customer
                  footfall.
                </p>
              </div>

              <div className="flex flex-1 justify-end flex-wrap items-center gap-3">
                <DateRangePicker
                  value={{
                    startDate: dateRange.start
                      ? new Date(dateRange.start)
                      : null,
                    endDate: dateRange.end ? new Date(dateRange.end) : null,
                  }}
                  onChange={(val) => {
                    if (val.startDate && val.endDate) {
                      setDateRange({
                        start: new Date(
                          val.startDate.getTime() -
                            val.startDate.getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .split("T")[0],
                        end: new Date(
                          val.endDate.getTime() -
                            val.endDate.getTimezoneOffset() * 60000,
                        )
                          .toISOString()
                          .split("T")[0],
                      });
                    } else {
                      setDateRange({ start: "", end: "" });
                    }
                  }}
                  placeholder="Select Date Range"
                />

                <div className="relative flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2 shadow-sm">
                  <Building2 size={14} className="text-brand-muted shrink-0" />
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="text-sm font-semibold text-brand-dark outline-none bg-transparent cursor-pointer pr-2 max-w-[150px] truncate"
                  >
                    {branches?.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Busiest Hour"
                  value={busiestHour}
                  subtext="Highest order volume"
                  icon={<Activity size={16} />}
                  highlight
                />
                <StatCard
                  label="Peak Revenue Hour"
                  value={peakRevenueHour}
                  subtext="Highest sales generated"
                  icon={<TrendingUp size={16} />}
                />
                <StatCard
                  label="Total Orders"
                  value={fmt(totalOrders)}
                  subtext="In selected timeframe"
                  icon={<Clock size={16} />}
                />
                <StatCard
                  label="Avg Order Value"
                  value={`₹${fmt(avgOrderValue)}`}
                  subtext="Across all hours"
                  icon={<DollarSign size={16} />}
                />
              </div>
            </section>

            {/* Chart Area */}
            <div className="lg:col-span-2 rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-sm font-black text-brand-dark uppercase tracking-wider">
                  Sales Velocity vs Revenue
                </h3>
                <p className="text-xs text-brand-muted font-medium mt-1">
                  Correlation between number of orders and total sales generated
                  per hour.
                </p>
              </div>
              <div className="h-[400px] w-full">
                {hourlyTrendsLoading ? (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted/70 font-medium">
                    Loading chart data...
                  </div>
                ) : formattedData.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-brand-muted/70 font-medium">
                    No data available for selected criteria
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={formattedData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis
                        dataKey="timeLabel"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        dy={10}
                      />
                      <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        tickFormatter={(value) =>
                          `₹${value >= 1000 ? (value / 1000).toFixed(1) + "k" : value}`
                        }
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                        formatter={(value, name) => {
                          if (name === "Revenue")
                            return [`₹${fmt(value)}`, name];
                          if (name === "Orders") return [value, name];
                          return [value, name];
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Bar
                        yAxisId="right"
                        dataKey="orderCount"
                        name="Orders"
                        fill="#fef08a"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="displaySales"
                        name="Revenue"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{
                          r: 4,
                          fill: "#2563eb",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="lg:col-span-1 rounded-2xl border border-brand-border/80 bg-white/70 backdrop-blur-lg shadow-sm overflow-hidden flex flex-col h-full lg:max-h-[515px]">
              <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar scroll-smooth relative">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10 bg-brand-bg/90 backdrop-blur-md shadow-sm">
                    <tr className="border-b border-brand-border text-[11px] font-black text-brand-muted/70 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Hour of Day</th>
                      <th className="py-3.5 px-4 text-right">Orders Count</th>
                      <th className="py-3.5 px-4 text-right">
                        Avg Order Value
                      </th>
                      <th className="py-3.5 px-6 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-xs">
                    {hourlyTrendsLoading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-12 text-center text-brand-muted/70"
                        >
                          <p className="font-bold text-brand-dark">
                            Loading data...
                          </p>
                        </td>
                      </tr>
                    ) : formattedData.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-12 text-center text-brand-muted/70"
                        >
                          <Clock
                            size={36}
                            className="mx-auto mb-2 text-brand-muted/70"
                          />
                          <p className="font-bold text-brand-dark">
                            No data found
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((hr, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                          key={hr.hour}
                          className="hover:bg-brand-bg/60 transition-colors duration-150"
                        >
                          <td className="py-3 px-6 text-brand-dark font-medium">
                            {hr.timeLabel}
                          </td>
                          <td className="py-3 px-4 text-right text-brand-dark">
                            <span className="font-bold text-brand-dark text-sm bg-brand-light px-2 py-0.5 rounded-md">
                              {hr.orderCount}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-brand-dark">
                            ₹{fmt(hr.averageOrderValue.toFixed(2))}
                          </td>
                          <td className="py-3 px-6 text-right font-bold text-brand-success text-sm">
                            ₹{fmt(hr.totalSales.toFixed(2))}
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-brand-border bg-white/90 backdrop-blur-sm z-10 relative">
                <PosAdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={(size) => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                  totalItems={formattedData.length}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
