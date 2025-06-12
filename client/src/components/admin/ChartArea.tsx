import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import * as apiClient from '../../api-client';
import Loader from '../common/Loader';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { calculateTrendPercentage } from '@/lib/utils';

const ChartArea = ({ visitorsCount }: { visitorsCount: VisitorsCountData }) => {
  const [days, setDays] = useState('7');

  const {
    mutate: fetchStats,
    data: visitorsData,
    isPending,
  } = useMutation({
    mutationFn: (days: string) => apiClient.adminFetchVisitorsStats(days),
  });

  const options = [
    { id: '2', label: '2 Days', value: '2' },
    { id: '7', label: '1 Week', value: '7' },
    { id: '30', label: '1 Month', value: '30' },
  ];

  let trend;
  let percentage;

  if (days === '2') {
    ({ trend, percentage } = calculateTrendPercentage(
      visitorsCount.today.total,
      visitorsCount.yesterday.total
    ));
  } else if (days === '7') {
    ({ trend, percentage } = calculateTrendPercentage(
      visitorsCount.thisWeek.total,
      visitorsCount.lastWeek.total
    ));
  } else if (days === '30') {
    ({ trend, percentage } = calculateTrendPercentage(
      visitorsCount.thisMonth.total,
      visitorsCount.lastMonth.total
    ));
  }

  useEffect(() => {
    fetchStats(days);
  }, [days]);

  if (isPending) return <Loader />;

  const chartData = visitorsData?.data.map((data: ChatDataProps) => ({
    date: data.date,
    total: data.total,
    unique: data.unique,
  }));

  const chartConfig = {
    total: {
      label: 'Total',
      color: 'var(--chart-1)',
    },
    unique: {
      label: 'Unique',
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  const firstDate = chartData?.[0]?.date;
  const lastDate = chartData?.[chartData.length - 1]?.date;

  const formattedFirst = new Date(firstDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
  const formattedLast = new Date(lastDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  //   console.log(chartData);

  return (
    <div className="w-full flex flex-col justify-between gap-6 h-full p-6 rounded-2xl border border-gray-300 shadow bg-gray-50">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-800">
            Total Visitors
          </h2>
          <p className="text-base text-gray-400">{`Total and unique visitors for the last ${
            options.find((option) => option.id === days)?.label || ''
          }`}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-1 border rounded-2xl p-2 border-gray-200 bg-gray-50 text-sm">
          {options.map(({ id, label, value }) => (
            <div className="flex items-center text-center" key={id}>
              <input
                type="radio"
                name="options"
                id={id}
                className="hidden peer"
                checked={days === value}
                onChange={() => setDays(value)}
              />
              <label
                htmlFor={id}
                className="cursor-pointer w-[90px] md:w-[140px] border rounded  py-2 px-2 md:px-8 text-gray-500 transition-colors duration-200 peer-checked:bg-blue-100 peer-checked:text-black"
              >
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full m-auto">
        <ChartContainer config={chartConfig}>
          <AreaChart
            width={600}
            height={250}
            data={chartData}
            margin={{ top: 20, right: 20, left: 12, bottom: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
            />

            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="total"
              type="monotone"
              fill="var(--chart-1)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
            />
            <Area
              dataKey="unique"
              type="monotone"
              fill="var(--chart-2)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2 text-gray-700">
          <div className="flex items-center gap-2 leading-none font-medium">
            {`Trending ${
              trend === 'decrement' ? 'down' : 'up'
            } by ${percentage?.toFixed(1)}% in the last ${
              options.find((option) => option.id === days)?.label || ''
            }`}{' '}
            {trend === 'decrement' ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
          </div>
          <div className="text-muted-foreground flex items-center gap-2 leading-none">
            {`Showing data from ${formattedFirst} to ${formattedLast}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartArea;
