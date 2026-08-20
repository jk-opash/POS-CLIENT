"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { OnboardingWizard } from "./components/OnboardingWizard";

export default function NewBranchOnboardingPage() {
  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-6 py-6">
          <div className="space-y-6">
            {/* Back Button */}
            <div>
              <Link
                href="/outlet"
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-2"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Branches
              </Link>
            </div>

            <OnboardingWizard />
          </div>
        </main>
      </div>
    </div>
  );
}
