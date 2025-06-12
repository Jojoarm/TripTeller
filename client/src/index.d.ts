declare interface TrendResult {
  trend: 'increment' | 'decrement' | 'no change';
  percentage: number;
}

declare interface StatsCard {
  headerTitle: string;
  subtitle: {
    increment: string;
    decrement: string;
  };
  description: {
    increment: string;
    decrement: string;
  };
  total: string;
  lastCount: number;
  currentCount: number;
}

declare interface ChatDataProps {
  date: Date;
  total: number;
  unique: number;
}

declare interface travelStyleProps {
  option: string;
  count: number;
}

declare interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

declare interface VisitorsCountData {
  today: {
    total: number;
    unique: number;
  };
  yesterday: {
    total: number;
    unique: number;
  };
  thisWeek: {
    total: number;
    unique: number;
  };
  lastWeek: {
    total: number;
    unique: number;
  };
  thisMonth: {
    total: number;
    unique: number;
  };
  lastMonth: {
    total: number;
    unique: number;
  };
}
