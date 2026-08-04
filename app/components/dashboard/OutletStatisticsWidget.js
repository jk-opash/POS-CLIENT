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
  const dispatch = useDispatch();

  const businessId = user?.businesses?.[0]?.id || user?.businessId || user?.business_id;

  useEffect(() => {
    if (businessId && !hasFetched) {
      dispatch(fetchBranches(businessId));
    }
  }, [businessId, hasFetched, dispatch]);

  // If there are no branches, fallback to default for demo purposes
  const displayBranches = branches.length > 0 ? branches : [];

  // We distribute the mock totals evenly among available branches for the demo

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
            <TableHead>Bills Modified</TableHead>
            <TableHead>Bills Re-printed</TableHead>
            <TableHead>Total Waived Off</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-bold">Total</TableCell>
            <TableCell className="font-semibold">0</TableCell>
            <TableCell className="font-semibold">0.00</TableCell>
            <TableCell className="font-semibold">0.00</TableCell>
            <TableCell className="font-semibold">0.00</TableCell>
            <TableCell className="font-semibold">0</TableCell>
            <TableCell className="font-semibold">0</TableCell>
            <TableCell className="font-semibold">0.00</TableCell>
          </TableRow>
          {displayBranches.map((branch) => {
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
                  0
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  0.00
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  0.00
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  0.00
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  0
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  0
                </TableCell>
                <TableCell className="text-brand-muted font-medium">
                  0.00
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
