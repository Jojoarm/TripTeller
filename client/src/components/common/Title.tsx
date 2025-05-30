type TitleProps = {
  title: string;
  subtitle: string;
};

const Title = ({ title, subtitle }: TitleProps) => {
  return (
    <div className="flex flex-col text-center items-center gap-1">
      <h1 className="font-semibold font-playfair text-4xl md-text-[40px]">
        {title}
      </h1>
      <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
        {subtitle}
      </p>
    </div>
  );
};

export default Title;
