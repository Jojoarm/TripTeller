import { Activity } from 'lucide-react';

type Props = {
  title: string;
  city: string;
  country: string;
  activities: number;
  imageUrl: string;
  rating: number;
  height?: number;
};

const DestinationCard = ({
  title,
  city,
  country,
  activities,
  imageUrl,
  rating,
  height = 200, // default height
}: Props) => {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-md cursor-pointer group"
      style={{ height }}
    >
      <span className="absolute top-3 left-3 z-10 px-2 py-0.5 text-sm bg-white text-red-500 font-semibold rounded-full">
        {rating}
      </span>

      <img
        src={imageUrl}
        alt={`${title}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="w-4 h-4"
          />
          <span>
            {city}, {country}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <Activity className="w-4 h-4 text-green-400" />
          <span>{activities} Activities</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
