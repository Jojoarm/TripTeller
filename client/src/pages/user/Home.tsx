import FeaturedDestinations from '@/components/user/FeaturedDestinations';
import NewsLetter from '@/components/user/NewsLetter';
import PopularTrips from '@/components/user/PopularTrips';
import SearchForm from '@/components/user/SearchForm';
import Testimonials from '@/components/user/Testimonials';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero Section */}
      <div className="relative w-full h-screen bg-[url(/assets/images/background2.jpg)] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-sky-600/[0.4] z-0"></div>
        <div className="absolute z-10 flex flex-col items-start justify-center h-full gap-4 px-4 md:px-16 lg:px-24 xl:px-32 text-white">
          <p className="bg-slate-900/50 px-3.5 py-1 rounded-full mt-20">
            The Ultimate Trip Experience
          </p>
          <h1 className="font-playfair text-5xl md:text-[86px] md:leading-[86px] font-bold max-w-xl text-slate-50">
            Plan Your Trip With Ease
          </h1>
          <p className=" text-slate-100 font-light max-w-xl md:font-normal">
            Customize your travel itinerary in minutes - pick your destination,
            set your preferences and explore with confidence
          </p>

          <button
            onClick={() => navigate('/sign-in')}
            className="px-12 py-2 rounded-md bg-primary text-white cursor-pointer hover:bg-white hover:text-primary transition-all ease-in"
          >
            Get Started
          </button>
          <SearchForm />
        </div>
      </div>

      <FeaturedDestinations />
      <PopularTrips />
      <Testimonials />
      <NewsLetter />
    </div>
  );
};

export default Home;
