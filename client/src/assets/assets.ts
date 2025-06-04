import type { TripFormData } from '@/pages/admin/CreateTrip';
import type { TripType } from '@/types';

export const userDummyData = {
  _id: '6835e208002bc1f4fcf2',
  username: 'Ofogba George',
  email: 'georgeofogba@gmail.com',
  image:
    'https://lh3.googleusercontent.com/a/ACg8ocKkbf4QUj9iZwdaSI3hcBsu0NcXCVkbpSfT2PXgwY_a3Dgrmg=s100',
  status: 'admin',
  createdAt: '2025-03-25T09:29:16.367Z',
  updatedAt: '2025-04-10T06:34:48.719Z',
  recentSearchedCountries: ['Japan', 'Greece'],
  trips: ['68271d080032898939c2', ''],
};

export const bookingsDummyData = [
  {
    _id: '67f76839994a731e97d3b8ce',
    user: '6835e208002bc1f4fcf2',
    trip: '68271d080032898939c2',
    startDate: '2025-04-30T00:00:00.000Z',
    totalPrice: 2500,
    status: 'pending',
    paymentMethod: 'cash',
    isPaid: false,
    createdAt: '2025-04-10T06:42:01.529Z',
    updatedAt: '2025-04-10T06:43:54.520Z',
  },
];

export const featuredDestinations = [
  {
    _id: '68371e080032898939c5',
    title: 'Barcelona Tour',
    imageUrl:
      'https://cdn.pixabay.com/photo/2020/02/12/00/22/overlook-4841320_1280.jpg',
    activities: 196,
    city: 'Barcelona',
    country: 'Spain',
    rating: 4.5,
  },
  {
    _id: '68371f080032898988c5',
    title: 'Santorini Tour',
    imageUrl:
      'https://cdn.pixabay.com/photo/2014/08/12/00/01/santorini-416135_1280.jpg',
    activities: 86,
    city: 'Santorini',
    country: 'Greece',
    rating: 4.8,
  },
  {
    _id: '68371g080032248988c5',
    title: 'Maldives Tour',
    imageUrl:
      'https://cdn.pixabay.com/photo/2014/06/03/17/48/maldives-361386_1280.jpg',
    activities: 86,
    city: 'Maldives',
    country: 'Maldives',
    rating: 4.9,
  },
  {
    _id: '68371h080032248956c5',
    title: 'Melbourne Tour',
    imageUrl:
      'https://cdn.pixabay.com/photo/2016/08/11/23/48/melbourne-1587291_1280.jpg',
    activities: 180,
    city: 'Melbourne',
    country: 'Australia',
    rating: 4.5,
  },
  {
    _id: '68371i080032248956c5',
    title: 'Cancun Tour',
    imageUrl:
      'https://cdn.pixabay.com/photo/2016/02/29/06/45/xcaret-1228156_1280.jpg',
    activities: 50,
    city: 'Cancun',
    country: 'Mexico',
    rating: 4.2,
  },
  {
    _id: '68371j092032248956c5',
    title: 'Tokyo Tour',
    imageUrl:
      'https://cdn.pixabay.com/photo/2017/03/12/21/30/tokyo-2138168_1280.jpg',
    activities: 50,
    city: 'Tokyo',
    country: 'Japan',
    rating: 4.3,
  },
];

export const sidebarItems = [
  {
    id: 1,
    icon: '/assets/icons/home.svg',
    label: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    id: 3,
    icon: '/assets/icons/users.svg',
    label: 'All Users',
    href: '/admin/all-users',
  },
  {
    id: 4,
    icon: '/assets/icons/itinerary.svg',
    label: 'Create Trips',
    href: '/admin/create-trip',
  },
];

export const travelStyles = [
  'Relaxed',
  'Luxury',
  'Adventure',
  'Cultural',
  'Nature & Outdoors',
  'City Exploration',
];

export const interests = [
  'Food & Culinary',
  'Historical Sites',
  'Hiking & Nature Walks',
  'Beaches & Water Activities',
  'Museums & Art',
  'Nightlife & Bars',
  'Photography Spots',
  'Shopping',
  'Local Experiences',
];

export const budgetOptions = ['Budget', 'Mid-range', 'Luxury', 'Premium'];

export const groupTypes = ['Solo', 'Couple', 'Family', 'Friends', 'Business'];

export const footers = ['Terms & Condition', 'Privacy Policy'];

export const selectItems = [
  'groupType',
  'travelStyle',
  'interests',
  'budget',
] as (keyof TripFormData)[];

export const comboBoxItems = {
  groupType: groupTypes,
  travelStyle: travelStyles,
  interests: interests,
  budget: budgetOptions,
} as Record<keyof TripFormData, string[]>;

export const tripsDummyData: TripType[] = [
  {
    _id: '68271d080032898939c2',
    userId: '6835e208002bc1f4fcf2',
    title: 'Historical Japan Adventure: Temples, Castles, and Trails',
    description:
      "Explore Japan's rich history through its iconic landmarks and natural beauty. This solo adventure focuses on historical sites with an active twist. Hike through ancient trails, explore majestic castles, and immerse yourself in traditional culture. Experience the thrill of discovery and create unforgettable memories in the Land of the Rising Sun.",
    estimatedPrice: 2500,
    duration: 8,
    budget: 'Mid-range',
    travelStyle: 'Adventure',
    country: 'Japan',
    interests: 'Historical Sites',
    groupType: 'Solo',
    bestTimeToVisit: [
      '🌸 Spring (March to May): Cherry blossoms create stunning backdrops for historical sites.',
      '☀️ Summer (June to August): Hiking is ideal in mountainous areas, but prepare for humidity.',
      '🍁 Autumn (September to November): Vibrant foliage enhances the beauty of temples and gardens.',
      '❄️ Winter (December to February): Snow-covered castles offer a unique and picturesque experience.',
    ],
    weatherInfo: [
      '☀️ Summer: 25-35°C (77-95°F)',
      '🌦️ Autumn: 15-25°C (59-77°F)',
      '🌧️ Spring: 10-20°C (50-68°F)',
      '❄️ Winter: 0-10°C (32-50°F)',
    ],
    location: {
      city: 'Kyoto',
      coordinates: [35.0116, 135.7681],
      openStreetMap: 'https://www.openstreetmap.org/#map=12/35.0116/135.7681',
    },
    itinerary: [
      {
        day: 1,
        location: 'Kyoto',
        activities: [
          {
            time: 'Morning',
            description:
              '🏯 Arrive at Kansai International Airport (KIX), take the Haruka Express to Kyoto. Check into your hotel and leave your luggage.',
          },
          {
            time: 'Afternoon',
            description:
              '🚶‍♀️Explore Fushimi Inari Shrine, hike through the thousands of vibrant red torii gates. (2-3 hours)',
          },
          {
            time: 'Evening',
            description:
              '🍜 Enjoy a traditional Kyoto dinner in the Gion district, known for its geishas. Try ramen or a multi-course Kaiseki meal.',
          },
        ],
      },
      {
        day: 2,
        location: 'Kyoto',
        activities: [
          {
            time: 'Morning',
            description:
              '🏯 Visit Kiyomizu-dera Temple, a UNESCO World Heritage site, and enjoy panoramic views of Kyoto.',
          },
          {
            time: 'Afternoon',
            description:
              '🌳 Wander through Arashiyama Bamboo Grove and explore Tenryu-ji Temple. Consider a relaxing boat ride on the Hozugawa River.',
          },
          {
            time: 'Evening',
            description:
              '🍻 Indulge in local craft beer and Izakaya food at Pontocho alley.',
          },
        ],
      },
      {
        day: 3,
        location: 'Nara',
        activities: [
          {
            time: 'Morning',
            description:
              '🦌 Take a day trip to Nara (1-hour train ride). Visit Todai-ji Temple, home to a giant bronze Buddha statue.',
          },
          {
            time: 'Afternoon',
            description:
              '🦌 Interact with the friendly wild deer roaming freely in Nara Park. Visit Kasuga Taisha Shrine with its thousands of lanterns.',
          },
          {
            time: 'Evening',
            description:
              '🍣 Return to Kyoto and enjoy a sushi dinner at Nishiki Market.',
          },
        ],
      },
      {
        day: 4,
        location: 'Osaka',
        activities: [
          {
            time: 'Morning',
            description:
              '🏯 Travel to Osaka (30 min train ride). Visit Osaka Castle, explore the castle grounds and the museum inside.',
          },
          {
            time: 'Afternoon',
            description:
              '🌆 Explore Dotonbori street food. Ride the Tempozan Ferris Wheel.',
          },
          {
            time: 'Evening',
            description: '🦀 Enjoy a crab dinner in Dotonbori.',
          },
        ],
      },
      {
        day: 5,
        location: 'Kanazawa',
        activities: [
          {
            time: 'Morning',
            description:
              '🚄 Take the Shinkansen (bullet train) to Kanazawa (approx. 2.5 hours).',
          },
          {
            time: 'Afternoon',
            description:
              "🪴Explore Kenrokuen Garden, one of Japan's Three Great Gardens.",
          },
          {
            time: 'Evening',
            description:
              '🍻 Try local seafood and sake at Omicho Market. Have dinner in Kanazawa Station.',
          },
        ],
      },
      {
        day: 6,
        location: 'Shirakawa-go',
        activities: [
          {
            time: 'Morning',
            description:
              '🚌 Take a bus from Kanazawa to Shirakawa-go (approx. 1.5 hours).',
          },
          {
            time: 'Afternoon',
            description:
              '🏠 Explore the traditional gassho-style farmhouses in Shirakawa-go, a UNESCO World Heritage site. Hike up to the Shiroyama viewpoint for panoramic views.',
          },
          {
            time: 'Evening',
            description:
              '🛌 Stay overnight in a Gassho style house, try traditional village style dinner.',
          },
        ],
      },
      {
        day: 7,
        location: 'Takayama',
        activities: [
          {
            time: 'Morning',
            description:
              '🚌 Take a bus from Shirakawa-go to Takayama (approx. 1 hour).',
          },
          {
            time: 'Afternoon',
            description:
              "🚶Wander through Takayama's old town (Sanmachi Suji), with its well-preserved Edo-era buildings and sake breweries. ",
          },
          {
            time: 'Evening',
            description: '🥩Try Hida beef, a local specialty, for dinner.',
          },
        ],
      },
      {
        day: 8,
        location: 'Tokyo (Departure)',
        activities: [
          {
            time: 'Morning',
            description:
              '🚄 Take the JR Limited Express Hida to Nagoya, then transfer to the Shinkansen to Tokyo (approx. 4-5 hours).',
          },
          {
            time: 'Afternoon',
            description:
              '✈️ Transfer to Narita (NRT) or Haneda (HND) airport for your departure flight home.',
          },
        ],
      },
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTE2MzB8MHwxfHNlYXJjaHwxfHxKYXBhbiUyMEhpc3RvcmljYWwlMjBTaXRlcyUyMEFkdmVudHVyZXxlbnwwfHx8fDE3NDczOTM4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTE2MzB8MHwxfHNlYXJjaHwyfHxKYXBhbiUyMEhpc3RvcmljYWwlMjBTaXRlcyUyMEFkdmVudHVyZXxlbnwwfHx8fDE3NDczOTM4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTE2MzB8MHwxfHNlYXJjaHwzfHxKYXBhbiUyMEhpc3RvcmljYWwlMjBTaXRlcyUyMEFkdmVudHVyZXxlbnwwfHx8fDE3NDczOTM4MDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    createdAt: '2025-04-10T06:26:04.013Z',
    updatedAt: '2025-04-10T06:26:04.013Z',
  },
  {
    _id: '68271c9b0038f9eae1a0',
    userId: '682483b374f6ffa3870b',
    title: 'Luxury Aegean Escape: Santorini & Mykonos for Couples',
    description:
      'Indulge in a romantic Greek getaway with private beaches, luxury villas, and unforgettable sunset views. Explore the iconic islands of Santorini and Mykonos, savor exquisite cuisine, and enjoy exclusive water activities, creating memories that will last a lifetime.',
    estimatedPrice: 8500,
    duration: 5,
    budget: 'Premium',
    travelStyle: 'Luxury',
    country: 'Greece',
    interests: 'Beaches & Water Activities',
    groupType: 'Couple',
    bestTimeToVisit: [
      '🌸 April to May: Pleasant temperatures, blooming flowers, and fewer crowds make it ideal for exploring.',
      '☀️ June to September: Warm, sunny weather perfect for swimming, sunbathing, and water sports.',
      '🍁 September to October: Warm seas, fewer crowds, and pleasant temperatures for outdoor activities.',
      '❄️ November to March: Mild temperatures and lower prices, though some tourist facilities may be closed.',
    ],
    weatherInfo: [
      '☀️ Summer: 25-35°C (77-95°F)',
      '🌦️ Spring: 15-25°C (59-77°F)',
      '🌧️ Autumn: 15-25°C (59-77°F)',
      '❄️ Winter: 5-15°C (41-59°F)',
    ],
    location: {
      city: 'Santorini & Mykonos',
      coordinates: [36.3932, 25.4615],
      openStreetMap: 'https://www.openstreetmap.org/#map=12/36.3932/25.4615',
    },
    itinerary: [
      {
        day: 1,
        location: 'Santorini (Oia)',
        activities: [
          {
            time: 'Morning',
            description:
              '🚁 Private helicopter transfer from Santorini Airport to a luxury villa in Oia with caldera views.',
          },
          {
            time: 'Afternoon',
            description:
              '🥂 Settle into your villa and enjoy a welcome lunch with local delicacies and sparkling wine overlooking the Aegean Sea.',
          },
          {
            time: 'Evening',
            description:
              '🌅 Witness the world-famous Oia sunset from your private balcony, followed by a private chef-prepared gourmet dinner.',
          },
        ],
      },
      {
        day: 2,
        location: 'Santorini',
        activities: [
          {
            time: 'Morning',
            description:
              "🛥️ Private yacht cruise to explore Santorini's volcanic islands, including Nea Kameni (volcano) and Palea Kameni (hot springs).",
          },
          {
            time: 'Afternoon',
            description:
              '🏊 Enjoy swimming and snorkeling in secluded coves with crystal-clear waters. Gourmet lunch served onboard.',
          },
          {
            time: 'Evening',
            description:
              '🍷 Wine tasting at a boutique winery, followed by a romantic dinner at a clifftop restaurant in Imerovigli.',
          },
        ],
      },
      {
        day: 3,
        location: 'Mykonos',
        activities: [
          {
            time: 'Morning',
            description:
              '✈️ Private helicopter transfer to Mykonos. Check into a luxury hotel with a private beach.',
          },
          {
            time: 'Afternoon',
            description:
              "🏖️ Relax on your private beach, enjoy swimming and sunbathing. Indulge in a couple's massage at the hotel spa.",
          },
          {
            time: 'Evening',
            description:
              '🍽️ Experience Mykonos nightlife with dinner at a world-class restaurant in Mykonos Town, followed by cocktails at a chic beach club.',
          },
        ],
      },
      {
        day: 4,
        location: 'Mykonos',
        activities: [
          {
            time: 'Morning',
            description:
              '🌊 Private boat trip to Delos, a UNESCO World Heritage Site, to explore ancient Greek ruins.',
          },
          {
            time: 'Afternoon',
            description:
              '🏄 Return to Mykonos and enjoy water sports activities such as windsurfing, jet skiing, or paddleboarding at a renowned beach like Elia or Paradise.',
          },
          {
            time: 'Evening',
            description:
              '🎶 Enjoy a private sunset cocktail cruise around the island, followed by a traditional Greek dinner with live music and dancing in a charming taverna.',
          },
        ],
      },
      {
        day: 5,
        location: 'Departure',
        activities: [
          {
            time: 'Morning',
            description:
              '🍳 Enjoy a leisurely breakfast at your hotel with stunning views of the Aegean Sea.',
          },
          {
            time: 'Afternoon',
            description:
              "🛍️ Last-minute souvenir shopping in Mykonos Town's boutiques and art galleries.",
          },
          {
            time: 'Evening',
            description:
              '✈️ Private transfer to Mykonos Airport for your departure.',
          },
        ],
      },
    ],
    imageUrls: [
      'https://images.unsplash.com/photo-1690269703843-2f73fffd7591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTE2MzB8MHwxfHNlYXJjaHwxfHxHcmVlY2UlMjBCZWFjaGVzJTIwfGVufDB8fHx8MTc0NzM5MzY5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1664475765746-fbbd8c65aaf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTE2MzB8MHwxfHNlYXJjaHwyfHxHcmVlY2UlMjBCZWFjaGVzJTIwfGVufDB8fHx8MTc0NzM5MzY5MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1471085507142-12355181f804?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTE2MzB8MHwxfHNlYXJjaHwzfHxHcmVlY2UlMjBCZWFjaGVzJTIwfGVufDB8fHx8MTc0NzM5MzY5MXww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    createdAt: '2025-04-10T06:26:04.013Z',
    updatedAt: '2025-04-10T06:26:04.013Z',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Emma Rodriguez',
    address: 'Barcelona, Spain',
    image:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
    rating: 5,
    review:
      "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that TripTeller provides.",
  },
  {
    id: 2,
    name: 'Liam Johnson',
    address: 'New York, USA',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    rating: 4,
    review:
      'TripTeller exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!',
  },
  {
    id: 3,
    name: 'Sophia Lee',
    address: 'Seoul, South Korea',
    image:
      'https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200',
    rating: 5,
    review:
      'Amazing service! I always find the best luxury accommodations through TripTeller. Their recommendations never disappoint!',
  },
];
