import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/api";

// Format a Date object → "YYYY-MM-DD" for safe URL params
function toISO(date) {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboardAnalytics",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/dashboard?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch analytics",
      );
    }
  },
);

export const fetchItemWiseSales = createAsyncThunk(
  "analytics/fetchItemWiseSales",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/item-wise-sales?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch item-wise sales",
      );
    }
  },
);

export const fetchTaxLiability = createAsyncThunk(
  "analytics/fetchTaxLiability",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/tax-liability?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch tax liability",
      );
    }
  },
);

export const fetchDiscountsVoids = createAsyncThunk(
  "analytics/fetchDiscountsVoids",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/discounts-voids?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch discounts & voids",
      );
    }
  },
);

export const fetchStaffPerformance = createAsyncThunk(
  "analytics/fetchStaffPerformance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/staff-performance?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch staff performance",
      );
    }
  },
);

export const fetchStockVariance = createAsyncThunk(
  "analytics/fetchStockVariance",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics/stock-variance", { params });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch stock variance",
      );
    }
  },
);

export const fetchConsumptionReport = createAsyncThunk(
  "analytics/fetchConsumptionReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/consumption-report?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch consumption report",
      );
    }
  },
);

export const fetchExpenseReport = createAsyncThunk(
  "analytics/fetchExpenseReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/expense-report?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch expense report",
      );
    }
  },
);

export const fetchHourlyTrends = createAsyncThunk(
  "analytics/fetchHourlyTrends",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { branchId, timeRange, startDate, endDate } = params;
      let url = "/analytics/hourly-trends?";
      if (branchId) url += `branch_id=${branchId}&`;
      if (startDate && endDate) {
        url += `startDate=${toISO(startDate)}&endDate=${toISO(endDate)}&`;
      } else if (timeRange) {
        url += `timeRange=${timeRange}&`;
      }

      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch hourly trends",
      );
    }
  },
);

const initialState = {
  stats: null,
  itemSales: [],
  taxData: null,
  discountsVoidsData: null,
  loading: false,
  itemSalesLoading: false,
  taxDataLoading: false,
  discountsVoidsLoading: false,
  error: null,
  hourlyTrendsData: [],
  hourlyTrendsLoading: false,
  stockVarianceData: null,
  stockVarianceLoading: false,
  stockVarianceError: null,
  staffPerformanceData: null,
  staffPerformanceLoading: false,
  staffPerformanceError: null,
  expenseReportData: null,
  expenseReportLoading: false,
  expenseReportError: null,

  consumptionReportData: null,
  consumptionReportLoading: false,
  consumptionReportError: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchItemWiseSales.pending, (state) => {
        state.itemSalesLoading = true;
        state.error = null;
      })
      .addCase(fetchItemWiseSales.fulfilled, (state, action) => {
        state.itemSalesLoading = false;
        state.itemSales = action.payload;
      })
      .addCase(fetchItemWiseSales.rejected, (state, action) => {
        state.itemSalesLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchTaxLiability.pending, (state) => {
        state.taxDataLoading = true;
        state.error = null;
      })
      .addCase(fetchTaxLiability.fulfilled, (state, action) => {
        state.taxDataLoading = false;
        state.taxData = action.payload;
      })
      .addCase(fetchTaxLiability.rejected, (state, action) => {
        state.taxDataLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDiscountsVoids.pending, (state) => {
        state.discountsVoidsLoading = true;
        state.error = null;
      })
      .addCase(fetchDiscountsVoids.fulfilled, (state, action) => {
        state.discountsVoidsLoading = false;
        state.discountsVoidsData = action.payload;
      })
      .addCase(fetchDiscountsVoids.rejected, (state, action) => {
        state.discountsVoidsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchHourlyTrends.pending, (state) => {
        state.hourlyTrendsLoading = true;
        state.error = null;
      })
      .addCase(fetchHourlyTrends.fulfilled, (state, action) => {
        state.hourlyTrendsLoading = false;
        state.hourlyTrendsData = action.payload;
      })
      .addCase(fetchHourlyTrends.rejected, (state, action) => {
        state.hourlyTrendsLoading = false;
        state.error = action.payload;
      })
      // Staff Performance
      .addCase(fetchStaffPerformance.pending, (state) => {
        state.staffPerformanceLoading = true;
        state.staffPerformanceError = null;
      })
      .addCase(fetchStaffPerformance.fulfilled, (state, action) => {
        state.staffPerformanceLoading = false;
        state.staffPerformanceData = action.payload;
      })
      .addCase(fetchStaffPerformance.rejected, (state, action) => {
        state.staffPerformanceLoading = false;
        state.staffPerformanceError = action.payload;
      })
      // Stock Variance
      .addCase(fetchStockVariance.pending, (state) => {
        state.stockVarianceLoading = true;
        state.stockVarianceError = null;
      })
      .addCase(fetchStockVariance.fulfilled, (state, action) => {
        state.stockVarianceLoading = false;
        state.stockVarianceData = action.payload;
      })
      .addCase(fetchStockVariance.rejected, (state, action) => {
        state.stockVarianceLoading = false;
        state.stockVarianceError = action.payload;
      })
      // Consumption Report
      .addCase(fetchConsumptionReport.pending, (state) => {
        state.consumptionReportLoading = true;
        state.consumptionReportError = null;
      })
      .addCase(fetchConsumptionReport.fulfilled, (state, action) => {
        state.consumptionReportLoading = false;
        state.consumptionReportData = action.payload;
      })
      .addCase(fetchConsumptionReport.rejected, (state, action) => {
        state.consumptionReportLoading = false;
        state.consumptionReportError = action.payload;
      });
    // Expense Report
    builder
      .addCase(fetchExpenseReport.pending, (state) => {
        state.expenseReportLoading = true;
        state.expenseReportError = null;
      })
      .addCase(fetchExpenseReport.fulfilled, (state, action) => {
        state.expenseReportLoading = false;
        state.expenseReportData = action.payload;
      })
      .addCase(fetchExpenseReport.rejected, (state, action) => {
        state.expenseReportLoading = false;
        state.expenseReportError = action.payload;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;

export default analyticsSlice.reducer;
