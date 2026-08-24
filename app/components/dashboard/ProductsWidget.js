import Card, { CardHeader, CardTitle } from "../ui/Card";
import { useSelector } from "react-redux";

export default function ProductsWidget() {
  const { stats } = useSelector((state) => state.analytics);

  const topProducts = stats?.topProducts || [];

  return (
    <Card padding="md">
      <CardHeader className="flex flex-row justify-between items-center mb-4">
        <CardTitle>Top Selling Dishes</CardTitle>
      </CardHeader>

      <div className="flex flex-col mt-2">
        {topProducts.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No data available
          </div>
        )}

        {topProducts.map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-center py-4 ${i < topProducts.length - 1 ? "border-b border-slate-100" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-slate-800 font-bold text-sm">
                #{i + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-800 text-sm font-bold">
                  {item.name}
                </span>
                <span className="text-slate-400 text-xs font-medium mt-0.5">
                  ₹{item.price}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-slate-800 text-sm font-bold">
                {item.count || 0} Orders
              </span>
              <span className="text-emerald-500 text-xs font-bold mt-0.5">
                {item.trend || "+0%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
