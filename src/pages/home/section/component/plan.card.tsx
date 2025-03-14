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
      className={`text-${primaryColor} bg-${secondaryColor} shadow-lg ${border} w-96 rounded-xl relative min-h-[70vh]`}
    >
      <div>
        <div
          className={`text-${secondaryColor} bg-${primaryColor} max-w-[40%] ml-auto rounded-tr-md rounded-bl-xl text-center py-2 font-semibold`}
        >
          {pricing}
        </div>
      </div>
      <div className={`p-6 text-center text-${primaryColor}`}>
        <h2 className='text-[20px] font-bold'>{name}</h2>
        <p className='text-gray-400 text-xs mt-1 font-bold'>{subtitle}</p>
      </div>
      <div
        className={`bg-${primaryColor} rounded-lg flex h-[60vh] mt-4 px-3 py-6`}
      >
        <ul className='space-y-4 text-[14px]'>
          {options.map((option, index) => (
            <li
              key={index}
              className={`flex items-start text-${secondaryColor}`}
            >
              <span
                className={`text-${primaryColor} bg-${secondaryColor} !text-[14px] left-0 px-1 size vx-icon vx-icon-030 rounded-full`}
              />
              <span className='ml-2 text-left'>{option}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='rounded-b-lg py-6 absolute w-full bottom-1'>
        <button
          className={`bg-${secondaryColor} text-${primaryColor} font-semibold rounded-full px-6 py-2 transition border-none`}
        >
          {action}
        </button>
      </div>
    </div>
  );
};
