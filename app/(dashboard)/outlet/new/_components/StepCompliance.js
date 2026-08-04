import { FileCheck, FileText, DollarSign } from "lucide-react";

export function StepCompliance({ form, updateForm }) {
  return (
    <div className="space-y-8 py-2">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileCheck className="w-3.5 h-3.5" /> Tax Jurisdiction
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
            placeholder="e.g. GST - Tamil Nadu"
            value={form.tax_jurisdiction}
            onChange={(e) => updateForm("tax_jurisdiction", e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" /> Tax Registration Number
          </label>
          <input
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
            placeholder="e.g. 33AADCD3456P1ZM"
            value={form.tax_registration}
            onChange={(e) => updateForm("tax_registration", e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <DollarSign className="w-3.5 h-3.5" /> Currency
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none appearance-none"
            value={form.currency}
            onChange={(e) => updateForm("currency", e.target.value)}
          >
            <option value="INR">Indian Rupee (INR)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="AED">UAE Dirham (AED)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
