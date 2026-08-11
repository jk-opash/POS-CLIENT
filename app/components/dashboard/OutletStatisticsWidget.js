import React, { useEffect } from "react";
import Card, { CardHeader, CardTitle } from "../ui/Card";
import { ExternalLink } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBranches } from "../../store/slices/branchSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

export default function OutletStatisticsWidget() {
  const { user } = useSelector((state) => state.auth);
  const { branches, hasFetched } = useSelector((state) => state.branch);
  const { stats } = useSelector((state) => state.analytics);
  const dispatch = useDispatch();

  const businessId =
    user?.businesses?.[0]?.id || user?.businessId || user?.business_id;

  useEffect(() => {
    if (businessId && !hasFetched) {
      dispatch(fetchBranches(businessId));
    }
  }, [businessId, hasFetched, dispatch]);

  // If there are no branches, fallback to default for demo purposes
  const displayBranches = branches.length > 0 ? branches : [];

  const outletStats = stats?.outletStats || [];
  const totalOrders = stats?.numOrders || 0;
  const totalSales = stats?.totalSales || 0;
  const totalTax = stats?.taxes || 0;
  const totalDiscount = stats?.discounts || 0;

  return (
    <Card className="col-span-full" padding="none">
      <CardHeader className="pt-5 px-5">
        <CardTitle>Outlet wise Statistics</CardTitle>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Total Orders</TableHead>
            <TableHead>Total Sales</TableHead>
            <TableHead>Total Tax</TableHead>
            <TableHead>Total Discount</TableHead>
            <TableHead>Total Waived Off</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Total</TableCell>
            <TableCell className="font-semibold">{totalOrders}</TableCell>
            <TableCell className="font-semibold">
              {Number(totalSales).toFixed(2)}
            </TableCell>
            <TableCell className="font-semibold">
              {Number(totalTax).toFixed(2)}
            </TableCell>
            <TableCell className="font-semibold">
              {Number(totalDiscount).toFixed(2)}
            </TableCell>
            <TableCell className="font-semibold">0.00</TableCell>
          </TableRow>
          {displayBranches.map((branch) => {
            const branchStat = outletStats.find((s) => s.id === branch.id) || {
              numOrders: 0,
              totalSales: 0,
              totalTax: 0,
              totalDiscount: 0,
              totalWaivedOff: 0,
            };
            return (
              <TableRow key={branch.id} className="group cursor-pointer">
                <TableCell className="font-semibold flex items-center gap-2">
                  {branch.name}
                  <ExternalLink
                    size={14}
                    className="text-brand-primary opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  {branchStat.numOrders}
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  {Number(branchStat.totalSales).toFixed(2)}
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  {Number(branchStat.totalTax).toFixed(2)}
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  {Number(branchStat.totalDiscount).toFixed(2)}
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  {Number(branchStat.totalWaivedOff).toFixed(2)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
