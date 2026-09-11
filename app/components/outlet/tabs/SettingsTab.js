"use client";

import Card from "../../ui/Card";
import { Settings } from "lucide-react";

export default function SettingsTab() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-12 text-brand-muted text-center">
        <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mb-4 text-brand-placeholder">
          <Settings className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-brand-dark mb-2">
          Settings Unavailable
        </h3>
        <p className="max-w-sm text-sm">
          Branch-level settings are currently not integrated with the backend.
          Operational and notification preferences will be available in a future
          update.
        </p>
      </div>
    </Card>
  );
}
