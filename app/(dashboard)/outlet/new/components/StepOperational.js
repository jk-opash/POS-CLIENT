import { Maximize, Users, Building2, Clock } from "lucide-react";

export function StepOperational({ form, updateForm }) {
  return (
    <div className="space-y-8 py-2">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Maximize className="w-3.5 h-3.5" /> Store Size
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="e.g. 2500 sqft"
              value={form.store_size}
              onChange={(e) => updateForm("store_size", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Capacity (Persons)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="e.g. 50"
              value={form.capacity}
              onChange={(e) => updateForm("capacity", parseInt(e.target.value) || "")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" /> Tables Count
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="e.g. 15"
              value={form.tables_count}
              onChange={(e) => updateForm("tables_count", parseInt(e.target.value) || "")}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Time Zone
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none appearance-none"
              value={form.time_zone}
              onChange={(e) => updateForm("time_zone", e.target.value)}
            >
              <option value="">Select Time Zone...</option>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
