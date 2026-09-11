"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchBranchById,
  updateBranch,
  deleteBranch,
} from "../../../store/slices/branchSlice";
import { fetchDashboardAnalytics } from "../../../store/slices/analyticsSlice";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import DateRangePicker from "../../../components/ui/DateRangePicker";
import LottieLoader from "../../../components/common/LottieLoader";
import { cn } from "../../../lib/utils";
import { Building2, ChevronLeft, Edit, AlertCircle } from "lucide-react";

import EditBranchModal from "../../../components/outlet/EditBranchModal";
import OverviewTab from "../../../components/outlet/tabs/OverviewTab";
import AnalyticsTab from "../../../components/outlet/tabs/AnalyticsTab";
import SettingsTab from "../../../components/outlet/tabs/SettingsTab";

export default function BranchDetailsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;

  const [activeTab, setActiveTab] = useState("overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const { currentBranch, loading, error } = useSelector(
    (state) => state.branch,
  );

  const handleToggle = useCallback(() => setCollapsed((c) => !c), []);

  useEffect(() => {
    if (id) {
      dispatch(fetchBranchById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && dateRange?.startDate && dateRange?.endDate) {
      dispatch(
        fetchDashboardAnalytics({
          branchId: id,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
        }),
      );
    }
  }, [id, dispatch, dateRange]);

  const handleSaveBranch = async (data) => {
    try {
      await dispatch(updateBranch({ id, data })).unwrap();
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update branch", err);
    }
  };

  const handleDeleteBranch = async () => {
    if (
      confirm(
        "Are you sure you want to delete this branch? This action cannot be undone.",
      )
    ) {
      try {
        await dispatch(deleteBranch(id)).unwrap();
        router.push("/outlet");
      } catch (err) {
        console.error("Failed to delete branch", err);
      }
    }
  };

  if (loading && !currentBranch) {
    return <LottieLoader fullScreen text="Loading branch details..." />;
  }

  if (error && !currentBranch) {
    return (
      <div className="flex h-screen bg-brand-bg items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-brand-danger mx-auto" />
          <h2 className="text-lg font-bold text-brand-dark">
            Branch Not Found
          </h2>
          <p className="text-brand-muted text-sm max-w-sm">{error}</p>
          <Button variant="primary" onClick={() => router.push("/outlet")}>
            Back to Branches
          </Button>
        </div>
      </div>
    );
  }

  const b = currentBranch;
  if (!b) return null;

  return (
    <div className="flex flex-col bg-brand-bg font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-12">
            {/* Back Button */}
            <div>
              <button
                onClick={() => router.push("/outlet")}
                className="inline-flex items-center text-sm font-medium text-brand-muted hover:text-brand-dark transition-colors"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Branches
              </button>
            </div>

            {/* Header section matching Pos-admin businesses profile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-brand-dark">
                    {b.name}
                  </h1>
                  <Badge
                    variant={
                      b.status === "Operational" || b.status === "active"
                        ? "success"
                        : "warning"
                    }
                    dot
                  >
                    {b.status || "Operational"}
                  </Badge>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-brand-muted capitalize">
                  <Building2 className="h-4 w-4" /> {b.branch_type || "Branch"}
                  <span className="text-brand-placeholder">|</span>
                  Joined{" "}
                  {b.created_at
                    ? new Date(b.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
                {b.status === "Closed" || b.status === "Maintenance" ? (
                  <Button variant="primary">Restore Access</Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={handleDeleteBranch}
                    className="bg-brand-dangerLight text-brand-danger hover:bg-brand-dangerLight border-none shadow-none"
                  >
                    Delete Branch
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(true)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border">
              <nav
                className="-mb-px flex space-x-6 overflow-x-auto"
                aria-label="Tabs"
              >
                {[
                  { id: "overview", label: "Overview" },
                  { id: "analytics", label: "Analytics" },
                  { id: "settings", label: "Settings" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                      activeTab === tab.id
                        ? "border-brand-dark text-brand-dark"
                        : "border-transparent text-brand-muted hover:border-brand-border hover:text-brand-dark",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              {activeTab === "analytics" && (
                <div className="pb-2 pt-2 sm:pt-0">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Filter by Date"
                  />
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "overview" && <OverviewTab branch={b} />}
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        </main>
      </div>

      {showEditModal && (
        <EditBranchModal
          branch={currentBranch}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveBranch}
        />
      )}
    </div>
  );
}
