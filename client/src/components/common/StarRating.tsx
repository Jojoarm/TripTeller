const StarRating = ({ rating = 4 }) => {
  return (
    <>
      {Array(5)
        .fill('')
        .map((_, index) => (
          <img
            src={
              rating > index
                ? '/assets/icons/starIconFilled.svg'
                : '/assets/icons/starIconOutlined.svg'
            }
            alt="star-icon"
            className="w-4.5 h-4.5"
            key={index}
          />
        ))}
    </>
  );
};

export default StarRating;
