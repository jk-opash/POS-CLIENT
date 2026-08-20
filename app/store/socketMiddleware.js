import socketService from "../services/socketService";
import { fetchZones } from "./slices/zoneSlice";
import { fetchCategories } from "./slices/categorySlice";
import { fetchMenuItems } from "./slices/menuItemSlice";
import { fetchInventoryItems } from "./slices/inventorySlice";
import { fetchTeamMembers } from "./slices/teamMemberSlice";
import {
  logout,
  setSessionConflict,
  clearSessionConflict,
} from "./slices/authSlice";

export const socketMiddleware = (store) => (next) => (action) => {
  // Pass the action down first so state gets updated
  const result = next(action);

  if (
    action.type === "auth/loginOwner/fulfilled" ||
    action.type === "socket/init"
  ) {
    const state = store.getState();
    const currentUser = state.auth?.user;
    const currentToken = state.auth?.token;

    // Use restaurant_id or branch_id for the socket connection based on the user's role
    // Since this is an admin POS-CLIENT, they might monitor the entire restaurant or a specific branch.
    // For now, let's use the active branch ID if available, otherwise fallback to their primary branch or restaurant ID
    const branchId =
      state.branch?.activeBranch?.id ||
      currentUser?.branch_id ||
      currentUser?.restaurant_id;

    if (currentToken) {
      socketService.connect(branchId, currentToken);

      if (branchId) {
        // Listen for table status updates
        socketService.on("tableStatusChanged", () => {
          store.dispatch(fetchZones(branchId));
        });

        // Listen for menu updates
        socketService.on("menuChanged", () => {
          store.dispatch(fetchCategories(branchId));
          store.dispatch(fetchMenuItems(branchId));
        });

        // Listen for inventory updates
        socketService.on("inventoryChanged", () => {
          store.dispatch(fetchInventoryItems(branchId));
        });

        // Optional: Add listeners for team members if needed
        socketService.on("teamMemberChanged", () => {
          const currentState = store.getState();
          const authUser = currentState.auth?.user;
          const userBusinessId =
            authUser?.businesses?.[0]?.id ||
            authUser?.business_id ||
            authUser?.restaurant_id;
          if (userBusinessId) {
            store.dispatch(fetchTeamMembers(userBusinessId));
          }
        });
      }

      // Session Conflict Management
      socketService.on("session_conflict", (data) => {
        store.dispatch(setSessionConflict(data?.message));
      });

      socketService.on("session_conflict_resolved", () => {
        store.dispatch(clearSessionConflict());
      });

      socketService.on("session_conflict_failed", (data) => {
        if (typeof window !== "undefined") {
          alert(data?.error || "Invalid PIN");
        }
      });

      socketService.on("session_expired", (data) => {
        store.dispatch(logout());
        if (typeof window !== "undefined") {
          setTimeout(() => {
            alert(
              data?.message ||
                "Session expired. You were logged in from another device.",
            );
          }, 500);
        }
      });
    }
  }

  // Handle logout
  if (action.type === "auth/logoutOwner") {
    socketService.disconnect();
  }

  return result;
};
