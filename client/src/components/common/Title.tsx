type TitleProps = {
  title: string;
  subtitle: string;
  align?: string;
};

const Title = ({ title, subtitle, align }: TitleProps) => {
  return (
    <div
      className={`flex flex-col justify-center items-center text-center ${
        align === 'left' && 'items-start text-left'
      }`}
    >
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
