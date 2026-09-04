"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createBranch } from "../../../../store/slices/branchSlice";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Store,
  MapPin,
  Settings,
  FileCheck,
} from "lucide-react";

import { StepBranchInfo } from "./StepBranchInfo";
import { StepLocation } from "./StepLocation";
import { StepOperational } from "./StepOperational";
import { StepCompliance } from "./StepCompliance";
import { cn } from "../../../../lib/utils";

const STEPS = [
  { id: 1, title: "Branch Info", desc: "Basic branch details", icon: Store },
  { id: 2, title: "Location", desc: "Address & contact", icon: MapPin },
  { id: 3, title: "Operational", desc: "Size & capacity", icon: Settings },
  { id: 4, title: "Compliance", desc: "Tax details", icon: FileCheck },
];

export function OnboardingWizard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading: isProvisioning, branches: reduxBranches } = useSelector(
    (state) => state.branch,
  );
  const { user } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    code: "",
    branch_type: "",
    status: "Operational",
    contact: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    store_size: "",
    capacity: "",
    tables_count: "",
    time_zone: "Asia/Kolkata",
    tax_jurisdiction: "",
    tax_registration: "",
    currency: "INR",
  });

  const updateForm = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!form.name.trim()) newErrors.name = "Branch Name is required";
      if (!form.code.trim()) newErrors.code = "Branch Code is required";
      else if (form.code.length < 2)
        newErrors.code = "Branch Code must be at least 2 characters";
    } else if (currentStep === 1) {
      if (!form.contact.trim())
        newErrors.contact = "Contact number is required";
      else if (!/^\d{10}$/.test(form.contact.replace(/\D/g, "")))
        newErrors.contact = "Must be a valid 10-digit number";
      if (form.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
        newErrors.email = "Must be a valid email address";
      if (!form.address.trim()) newErrors.address = "Address is required";
      if (!form.city.trim()) newErrors.city = "City is required";
      if (!form.state.trim()) newErrors.state = "State is required";
    } else if (currentStep === 3) {
      if (form.tax_registration && form.tax_registration.length !== 15)
        newErrors.tax_registration = "GST must be exactly 15 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < STEPS.length - 1)
      setCurrentStep((c) => c + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((c) => c - 1);
  };

  const business = user?.businesses?.[0];
  const branches =
    reduxBranches?.length > 0 ? reduxBranches : business?.branches || [];
  const subscription = business?.subscription_plan;
  const baseBranches = Number(subscription?.max_branches || 0);
  const extraBranches = Number(business?.extra_branches || 0);
  const maxBranches =
    baseBranches + extraBranches > 0 ? baseBranches + extraBranches : 0;

  useEffect(() => {
    if (maxBranches > 0 && branches.length >= maxBranches) {
      alert(
        `You have reached your limit of ${maxBranches} branches. Please upgrade your plan to add more.`,
      );
      router.push("/outlet");
    }
  }, [maxBranches, branches.length, router]);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    try {
      await dispatch(createBranch(form)).unwrap();
      router.push("/outlet");
    } catch (err) {
      console.error("Failed to create branch:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden flex min-h-[600px] h-[calc(100vh-12rem)]">
      {/* Left Sidebar Stepper */}
      <div className="w-1/3 max-w-[320px] bg-brand-bg border-r border-brand-border p-8 hidden md:block overflow-y-auto">
        <h2 className="text-lg font-bold text-brand-dark mb-8">Create Branch</h2>

        <div className="space-y-6">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex gap-4 relative">
                {idx !== STEPS.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-5 top-10 bottom-[-24px] w-0.5 transition-colors duration-500",
                      isCompleted ? "bg-brand-primary" : "bg-brand-border",
                    )}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isActive
                      ? "border-brand-primary text-brand-primary bg-brand-primary/10 ring-4 ring-brand-primary/10"
                      : isCompleted
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-brand-border text-brand-muted bg-white",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="pt-2 pb-4">
                  <h3
                    className={cn(
                      "text-sm font-bold transition-colors",
                      isActive
                        ? "text-brand-dark"
                        : isCompleted
                          ? "text-brand-dark"
                          : "text-brand-muted",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-brand-muted">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
          <div className="max-w-2xl">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-brand-dark mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-brand-muted mb-8">
                Please fill in the details below to proceed.
              </p>
            </div>

            <div
              key={currentStep}
              className="animate-in fade-in slide-in-from-right-4 duration-500"
            >
              {currentStep === 0 && (
                <StepBranchInfo
                  form={form}
                  updateForm={updateForm}
                  errors={errors}
                />
              )}
              {currentStep === 1 && (
                <StepLocation
                  form={form}
                  updateForm={updateForm}
                  errors={errors}
                />
              )}
              {currentStep === 2 && (
                <StepOperational
                  form={form}
                  updateForm={updateForm}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <StepCompliance
                  form={form}
                  updateForm={updateForm}
                  errors={errors}
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-6 md:px-12 border-t border-brand-border bg-white flex items-center justify-between shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || isProvisioning}
            className={cn(
              "px-6 py-2.5 text-sm font-medium rounded-xl border border-brand-border bg-white hover:bg-brand-light hover:text-brand-dark text-brand-dark transition-all flex items-center gap-2",
              currentStep === 0 && "opacity-0 pointer-events-none",
            )}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 text-sm font-medium rounded-xl bg-brand-primary hover:bg-brand-dark text-white shadow-md shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all flex items-center gap-2"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isProvisioning}
              className="px-8 py-2.5 text-sm font-medium rounded-xl bg-brand-success hover:bg-brand-success text-white shadow-md shadow-brand-success/20 hover:shadow-brand-success/40 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:shadow-none"
            >
              {isProvisioning ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Saving...
                </>
              ) : (
                <>
                  Create Branch <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
