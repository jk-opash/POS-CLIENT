import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import branchReducer from "./slices/branchSlice";
import teamMemberReducer from "./slices/teamMemberSlice";
import zoneReducer from "./slices/zoneSlice";
import categoryReducer from "./slices/categorySlice";
import menuItemReducer from "./slices/menuItemSlice";
import analyticsReducer from "./slices/analyticsSlice";
import inventoryReducer from "./slices/inventorySlice";
import orderReducer from "./slices/orderSlice";
import auditLogReducer from "./slices/auditLogSlice";
import supplierReducer from "./slices/supplierSlice";
import utilityBillReducer from "./slices/utilityBillSlice";
import expenseReducer from "./slices/expenseSlice";
import withdrawalReducer from "./slices/withdrawalSlice";
import paymentReducer from "./slices/paymentSlice";
import reconciliationReducer from "./slices/reconciliationSlice";
import supportTicketReducer from "./slices/supportTicketSlice";
import { socketMiddleware } from "./socketMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    teamMember: teamMemberReducer,
    zone: zoneReducer,
    category: categoryReducer,
    menuItem: menuItemReducer,
    analytics: analyticsReducer,
    inventory: inventoryReducer,
    order: orderReducer,
    auditLog: auditLogReducer,
    supplier: supplierReducer,
    utilityBill: utilityBillReducer,
    expense: expenseReducer,
    withdrawal: withdrawalReducer,
    payment: paymentReducer,
    reconciliation: reconciliationReducer,
    supportTicket: supportTicketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware),
});
