import { Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const PieChartArea = ({
  travelStyle,
  title,
}: {
  visitorsCount: VisitorsCountData;
  travelStyle: travelStyleProps[];
  title: string;
}) => {
  const chartData = travelStyle?.map(
    (style: travelStyleProps, index: number) => ({
      option: style.option,
      count: style.count,
      fill: `var(--chart-${index})`,
    })
  );

  const chartConfig: ChartConfig = Object.fromEntries(
    travelStyle.map((style, index) => [
      style.option,
      {
        label: style.option.split(' ')[0],
        color: `hsl(var(--chart-${index}))`,
      },
    ])
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{`${title} Trends`}</CardTitle>
        <CardDescription>{`Total Bookings by ${title}`}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square ">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="option"
              innerRadius={60}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="option" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartArea;
