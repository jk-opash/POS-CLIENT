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
          <div className="py-8 text-center text-sm text-brand-muted">
            No data available
          </div>
        )}

        {topProducts.map((item, i) => (
          <div
            key={i}
            className={`flex justify-between items-center py-4 ${i < topProducts.length - 1 ? "border-b border-brand-light" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-brand-dark font-bold text-sm">
                #{i + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-brand-dark text-sm font-bold">
                  {item.name}
                </span>
                <span className="text-brand-muted text-xs font-medium mt-0.5">
                  ₹{item.price}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-brand-dark text-sm font-bold">
                {item.count || 0} Orders
              </span>
              <span className="text-brand-success text-xs font-bold mt-0.5">
                {item.trend || "+0%"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
