"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import Sidebar from '../../../components/Sidebar';
import Topbar from '../../../components/Topbar';
import { OnboardingWizard } from '../_components/OnboardingWizard';

export default function NewBranchOnboardingPage() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setCollapsed((c) => !c)} />
        
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
      </div>
    </div>
  );
}
