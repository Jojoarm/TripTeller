const SearchForm = () => {
  return (
    <form className="bg-white text-gray-500 rounded-lg px-6 py-4 my-8 flex flex-col md:flex-row max-md:items-start gap-4">
      <div>
        <div className="flex items-center gap-2">
          <img
            src="/assets/icons/location-mark.svg"
            alt="calender icon"
            className="h-4"
          />
          <label htmlFor="destinationInput">Destination</label>
        </div>
        <input
          id="destinationInput"
          type="text"
          className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
          placeholder="Search by Country or City"
          required
        />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <img
            src="/assets/icons/calendar.svg"
            alt="calender icon"
            className="h-4"
          />
          <label htmlFor="tripDate">Trip Date</label>
        </div>
        <input
          id="tripDate"
          type="date"
          className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
        />
      </div>

      <button className="flex items-center justify-center gap-1 rounded-xl shadow-2xl bg-slate-700 py-2 px-6 text-white my-auto cursor-pointer max-md:w-full max-md:py-1">
        <img
          src="/assets/icons/searchIcon.svg"
          alt="search icon"
          className="h-7"
        />
        <span>Search</span>
      </button>
    </form>
  );
};

export default SearchForm;
