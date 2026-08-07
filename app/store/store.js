import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import branchReducer from "./slices/branchSlice";
import teamMemberReducer from "./slices/teamMemberSlice";
import zoneReducer from "./slices/zoneSlice";
import categoryReducer from "./slices/categorySlice";
import menuItemReducer from "./slices/menuItemSlice";
import inventoryReducer from "./slices/inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    teamMember: teamMemberReducer,
    zone: zoneReducer,
    category: categoryReducer,
    menuItem: menuItemReducer,
    inventory: inventoryReducer,
  },
});
