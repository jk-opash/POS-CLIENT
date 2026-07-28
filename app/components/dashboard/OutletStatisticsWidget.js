import Card from "../ui/Card";
import { ExternalLink } from "lucide-react";

export default function OutletStatisticsWidget() {
  return (
    <Card title="Outlet wise Statistics" className="col-span-full" padding="p-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider"></th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Total Orders</th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Total Sales</th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Total Tax</th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Total Discount</th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Bills Modified</th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Bills Re-printed</th>
              <th className="py-4 px-5 text-slate-500 font-bold text-xs uppercase tracking-wider">Total Waived Off</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-4 px-5 font-bold text-slate-800">Total</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">142</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">45,890.50</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">2,294.52</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">1,250.00</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">24</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">8</td>
              <td className="py-4 px-5 text-slate-800 font-semibold">450.00</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-4 px-5 text-slate-700 font-semibold flex items-center gap-2 group cursor-pointer">
                Ghaziabad-AmrenderSingh-Demo
                <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
              </td>
              <td className="py-4 px-5 text-slate-500 font-medium">85</td>
              <td className="py-4 px-5 text-slate-500 font-medium">28,450.00</td>
              <td className="py-4 px-5 text-slate-500 font-medium">1,422.50</td>
              <td className="py-4 px-5 text-slate-500 font-medium">800.00</td>
              <td className="py-4 px-5 text-slate-500 font-medium">14</td>
              <td className="py-4 px-5 text-slate-500 font-medium">5</td>
              <td className="py-4 px-5 text-slate-500 font-medium">200.00</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-4 px-5 text-slate-700 font-semibold flex items-center gap-2 group cursor-pointer">
                Indiranagar (Main)
                <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
              </td>
              <td className="py-4 px-5 text-slate-500 font-medium">57</td>
              <td className="py-4 px-5 text-slate-500 font-medium">17,440.50</td>
              <td className="py-4 px-5 text-slate-500 font-medium">872.02</td>
              <td className="py-4 px-5 text-slate-500 font-medium">450.00</td>
              <td className="py-4 px-5 text-slate-500 font-medium">10</td>
              <td className="py-4 px-5 text-slate-500 font-medium">3</td>
              <td className="py-4 px-5 text-slate-500 font-medium">250.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
