import Card from "../ui/Card";
import { RefreshCcw } from "lucide-react";

export default function ProductsWidget() {
  const items = [
    { name: "Apple Pie", price: "4,500.00" },
    { name: "Citrus Fizz", price: "3,250.00" },
    { name: "Virgin Pina Colada", price: "2,800.00" },
    { name: "Bhaaji Pau (Butter)", price: "1,428.50" },
    { name: "Bheja Fry", price: "1,180.00" },
  ];
  
  return (
    <Card
      title="Products"
      action={
        <div className="flex items-center gap-2">
          <select className="bg-slate-50 text-xs px-2 h-7 border border-slate-200 rounded-md text-slate-700 outline-none focus:ring-2 focus:ring-blue-100">
            <option>Today</option>
          </select>
          <button className="bg-slate-50 border border-slate-200 text-slate-500 rounded-md w-7 h-7 flex items-center justify-center hover:bg-slate-100 transition-colors">
            <RefreshCcw size={14} />
          </button>
        </div>
      }
    >
      <div className="flex gap-5 border-b border-slate-100 mb-2">
        <div className="text-blue-600 border-b-2 border-blue-600 pb-2 font-bold text-xs -mb-[1px] cursor-pointer">
          Top Selling
        </div>
        <div className="text-slate-400 pb-2 text-xs font-semibold cursor-pointer hover:text-slate-600 transition-colors">
          Low Selling
        </div>
      </div>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <div key={i} className={`flex justify-between items-center py-3 ${i < items.length - 1 ? 'border-b border-dashed border-slate-100' : ''}`}>
            <span className="text-slate-500 text-sm font-medium">{item.name}</span>
            <span className="text-slate-800 text-sm font-bold">₹ {item.price}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
