import { getFirstWord } from '@/lib/utils';

type LocationType = {
  city: string;
  state?: string;
  country?: string;
};

type Props = {
  id: string;
  imageUrl: string;
  location: LocationType;
  title: string;
  country: string;
  tags: string[];
  price: string;
};

const TripCard = ({
  id,
  imageUrl,
  location,
  title,
  country,
  tags,
  price,
}: Props) => {
  return (
    <div
      key={id}
      className="relative max-w-70 w-full  rounded-2xl shadow border-b border-gray-200 shadow-gray-600 group cursor-pointer overflow-hidden"
    >
      <img
        src={imageUrl}
        alt="trip image"
        className="w-full h-[250px] object- transition-transform duration-300 group-hover:scale-105"
      />
      <span className="absolute top-3 right-3 z-10 px-2 py-0.5 text-sm bg-white text-red-500 font-semibold rounded-full">
        $ {price}
      </span>
      <div className="p-3 flex flex-col gap-3 bg-white ">
        <h2 className=" font-semibold text-xl truncate text-black">{title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <img
            src="/assets/icons/location-mark.svg"
            alt="location"
            className="w-4 h-4"
          />
          <span>
            {location.city}, {country}
          </span>
        </div>
        <div className="flex gap-2">
          {tags.map((tag, index) => (
            <p
              key={index}
              className="text-xs text-pink-400 bg-pink-50 px-2 py-1 shadow rounded-3xl "
            >
              {getFirstWord(tag)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
