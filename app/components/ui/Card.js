export default function Card({ children, title, action, className = '', padding = 'p-5', ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          {title && <h3 className="m-0 text-sm font-bold text-slate-800 tracking-wide">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding}>
        {children}
      </div>
    </div>
  );
}
