import { Store, Hash, Tag, Activity } from "lucide-react";

export function StepBranchInfo({ form, updateForm, errors = {} }) {
  return (
    <div className="space-y-8 py-2">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <Store className="w-3.5 h-3.5" /> Branch Name
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
            placeholder="e.g. Downtown Cafe"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />
          {errors.name && <span className="text-brand-danger text-xs mt-1 block">{errors.name}</span>}
        </div>
        
        <div>
          <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <Hash className="w-3.5 h-3.5" /> Branch Code
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
            placeholder="e.g. DT-01"
            value={form.code}
            onChange={(e) => updateForm("code", e.target.value)}
          />
          {errors.code && <span className="text-brand-danger text-xs mt-1 block">{errors.code}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> Branch Type
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="e.g. Dine-in, Takeaway"
              value={form.branch_type}
              onChange={(e) => updateForm("branch_type", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Status
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none appearance-none"
              value={form.status}
              onChange={(e) => updateForm("status", e.target.value)}
            >
              <option value="Operational">Operational</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
