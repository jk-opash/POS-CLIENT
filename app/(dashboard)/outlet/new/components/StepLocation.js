import { Mail, Phone, MapPin, Map, Globe } from "lucide-react";

export function StepLocation({ form, updateForm, errors = {} }) {
  return (
    <div className="space-y-8 py-2">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Contact Phone
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="+1 (555) 000-0000"
              value={form.contact}
              onChange={(e) => updateForm("contact", e.target.value)}
            />
          {errors.contact && <span className="text-brand-danger text-xs mt-1 block">{errors.contact}</span>}
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="branch@company.com"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />
          {errors.email && <span className="text-brand-danger text-xs mt-1 block">{errors.email}</span>}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Street Address
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none resize-none h-24"
            placeholder="123 Main St, Suite 100"
            value={form.address}
            onChange={(e) => updateForm("address", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Map className="w-3.5 h-3.5" /> City
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="City"
              value={form.city}
              onChange={(e) => updateForm("city", e.target.value)}
            />
          {errors.city && <span className="text-brand-danger text-xs mt-1 block">{errors.city}</span>}
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> State/Region
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="State"
              value={form.state}
              onChange={(e) => updateForm("state", e.target.value)}
            />
          {errors.state && <span className="text-brand-danger text-xs mt-1 block">{errors.state}</span>}
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> Country
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              placeholder="Country"
              value={form.country}
              onChange={(e) => updateForm("country", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
