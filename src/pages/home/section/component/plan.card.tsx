export interface IPlanCard {
  pricing: string;
  slogan?: string;
  bgColor?: string;
  textColor?: string;
  name: string;
  action: string;
  border?: string;
  subtitle: string;
  options: string[];
  inverse?: boolean;
}

export const PlandCard = ({
  pricing,
  bgColor,
  textColor = 'white',
  name,
  border = 'border border-gray-200',
  action,
  subtitle,
  options,
  inverse,
}: IPlanCard) => {
  const primaryColor = inverse ? textColor : bgColor;
  const secondaryColor = inverse ? bgColor : textColor;

  return (
    <div
      className={`text-${primaryColor} bg-${secondaryColor} shadow-lg ${border} w-full sm:w-[350px] md:w-[400px] rounded-xl relative min-h-[500px] transition-all duration-300 hover:shadow-xl`}
    >
      <div>
        <div
          className={`text-${secondaryColor} bg-${primaryColor} max-w-[40%] ml-auto rounded-tr-md rounded-bl-xl text-center py-2 font-semibold text-sm sm:text-base`}
        >
          {pricing}
        </div>
      </div>
      <div className={`p-4 sm:p-6 text-center text-${primaryColor}`}>
        <h2 className='text-lg sm:text-xl md:text-2xl font-bold'>{name}</h2>
        <p className='text-gray-400 text-xs sm:text-sm mt-1 font-bold'>
          {subtitle}
        </p>
      </div>
      <div
        className={`bg-${primaryColor} rounded-lg flex h-[450px] sm:h-[550px] mt-4 px-3 py-6`}
      >
        <ul className='space-y-3 sm:space-y-4 text-sm sm:text-base w-full'>
          {options.map((option, index) => (
            <li
              key={index}
              className={`flex items-start text-${secondaryColor} px-2`}
            >
              <span
                className={`text-${primaryColor} bg-${secondaryColor} !text-sm sm:!text-base left-0 px-1 size vx-icon vx-icon-030 rounded-full flex-shrink-0`}
              />
              <span className='ml-2 text-left flex-1'>{option}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='rounded-b-lg py-4 sm:py-6 absolute w-full bottom-0'>
        <button
          className={`bg-${secondaryColor} text-${primaryColor} font-semibold rounded-full px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 hover:opacity-90 w-[90%] max-w-[300px]`}
        >
          {action}
        </button>
      </div>
    </div>
  );
};
