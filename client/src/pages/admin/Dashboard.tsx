import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../../api-client';
import Loader from '@/components/common/Loader';
import Title from '@/components/common/Title';
import { useAppContext } from '@/context/AppContext';
import StatsCard from '@/components/admin/StatsCard';
import ChartArea from '@/components/admin/ChartArea';
import PieChartArea from '@/components/admin/PieChartArea';

const Dashboard = () => {
  const { user } = useAppContext();

  const { data: dashboardData, isPending: isVisitorDataPending } = useQuery({
    queryKey: ['adminFetchVisitorsStats'],
    queryFn: () => apiClient.adminDashBoardData(),
  });

  const { data: travelStyleData, isPending: isTravelStylePending } = useQuery({
    queryKey: ['adminFetchTravelStyleStats'],
    queryFn: () => apiClient.travelStyleData(),
  });

  if (isVisitorDataPending || isTravelStylePending) return <Loader />;

  return (
    <div className="flex flex-col gap-10 items-start justify-between mb-10">
      <Title
        align="left"
        title={`Welcome ${user?.username.split(' ')[0]} 👏`}
        subtitle="Track activity, trends and popular destinations in real time"
      />

      <div className="grid justify-center md:justify-start grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6 md:gap-8 w-full">
        <StatsCard
          headerTitle="Total Revenue"
          subtitle={{
            increment: 'Trending up this month',
            decrement: 'Trending down this month',
          }}
          description={{
            increment: 'Revenue exceed targets',
            decrement: 'Revenue below targets',
          }}
          total={new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(dashboardData.revenue.total)}
          currentCount={dashboardData.revenue.thisMonth}
          lastCount={dashboardData.revenue.lastMonth}
        />
        <StatsCard
          headerTitle="New Users"
          subtitle={{
            increment: 'Up this week',
            decrement: 'Down this week',
          }}
          description={{
            increment: 'Strong user growth',
            decrement: 'Poor user growth',
          }}
          total={dashboardData.users.thisWeek.toLocaleString()}
          currentCount={dashboardData.users.thisWeek}
          lastCount={dashboardData.users.lastWeek}
        />
        <StatsCard
          headerTitle="Completed Bookings"
          subtitle={{
            increment: 'Steady performance increase',
            decrement: 'Performance requires attention',
          }}
          description={{
            increment: 'Meets target projections',
            decrement: 'Below target projections',
          }}
          total={dashboardData.bookings.thisMonth.toLocaleString()}
          currentCount={dashboardData.bookings.thisMonth}
          lastCount={dashboardData.bookings.lastMonth}
        />
      </div>

      <ChartArea visitorsCount={dashboardData.visitors} />

      <div className="flex flex-wrap gap-3">
        <PieChartArea
          visitorsCount={dashboardData.visitors}
          travelStyle={travelStyleData.budgets}
          title="Budget"
        />
        <PieChartArea
          visitorsCount={dashboardData.visitors}
          travelStyle={travelStyleData.interests}
          title="Interest"
        />
      </div>
    </div>
  );
};

export default Dashboard;
