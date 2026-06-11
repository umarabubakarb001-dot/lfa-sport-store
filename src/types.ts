export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  costPrice: number;
  minStockLevel: number;
}

export interface SaleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  profit: number;
  customerType: 'Member' | 'Regular';
}

export interface ForecastPeriod {
  period: string; // e.g., "June 2026" or "Week 1"
  predictedSales: number;
  predictedGrowth: number;
  confidenceScore: number;
}

export interface CategorySummary {
  category: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
}

export interface DashboardStats {
  totalRevenue: number;
  totalProfit: number;
  totalSalesCount: number;
  lowStockCount: number;
  salesGrowthRate: number; // percentage
  profitMargin: number; // percentage
}

export interface ForecastResponse {
  forecasts: ForecastPeriod[];
  insights: string; // Brief qualitative notes
  recommendations: {
    stockAdvice: { productId: string; productName: string; advice: string }[];
    marketingStrategies: string[];
    riskWarnings: string[];
  };
}
