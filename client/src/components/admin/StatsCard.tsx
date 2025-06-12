import { calculateTrendPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

const StatsCard = ({
  headerTitle,
  subtitle,
  description,
  currentCount,
  lastCount,
  total,
}: StatsCard) => {
  const { trend, percentage } = calculateTrendPercentage(
    currentCount,
    lastCount
  );

  const isDecrement = trend === 'decrement';

  return (
    <div className="flex flex-col md:text-sm text-base gap-4 h-full p-6 rounded-2xl shadow border-gray-300 bg-gray-50 transition-transform duration-200 group hover:scale-103">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">{headerTitle}</p>
          <div className="rounded-lg p-1 border border-gray-400 flex items-center gap-1 lg:gap-2">
            <TrendingUp className="w-3 h-4 md:w-4 text-gray-600" />
            <p className="text-xs md:text-sm font-semibold">
              {`${isDecrement ? '-' : '+'}${percentage}%`}
            </p>
          </div>
        </div>
        <h2 className="font-semibold text-lg sm:text-xl md:text-2xl">
          {total}
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center">
          <p className="font-semibold">
            {isDecrement ? subtitle.decrement : subtitle.increment}
          </p>
          {isDecrement ? (
            <TrendingDown className="size-4 text-gray-600" />
          ) : (
            <TrendingUp className="size-4 text-gray-600" />
          )}
        </div>
        <p className="text-gray-500">
          {isDecrement ? description.decrement : description.increment}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
