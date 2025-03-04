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
  const finalBgColor = inverse ? textColor : bgColor;
  const finalTextColor = inverse ? bgColor : textColor;

  return (
    <div
      className={`text-${finalBgColor} bg-${finalTextColor} shadow-lg ${border} w-96 rounded-xl relative min-h-[60vh]`}
    >
      <div>
        <div
          className={`text-${finalTextColor} bg-${finalBgColor} max-w-[40%] ml-auto rounded-tr-md rounded-bl-xl text-center py-2 font-semibold`}
        >
          {pricing}
        </div>
      </div>
      <div className={`p-6 text-center text-${finalBgColor}`}>
        <h2 className='text-[20px] font-bold'>{name}</h2>
        <p className='text-gray-400 text-xs mt-1 font-bold'>{subtitle}</p>
      </div>
      <div
        className={`bg-${finalBgColor} rounded-t-lg flex h-[45vh] mt-4 px-3 py-6`}
      >
        <ul className='space-y-4 text-[14px] border-b-l'>
          {options.map((option, index) => (
            <li
              key={index}
              className={`flex items-start text-${finalTextColor}`}
            >
              <span
                className={`!text-${finalBgColor} !text-[14px] bg-${finalTextColor} left-0 px-1 size vox-icon vx-icon-030 rounded-full`}
              />
              <span className='ml-2 text-left'>{option}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`bg-${finalBgColor} rounded-b-lg py-6 absolute w-full bottom-0`}
      >
        <button
          className={`bg-${finalTextColor} text-${finalBgColor} font-semibold rounded-full px-6 py-2 transition`}
        >
          {action}
        </button>
      </div>
    </div>
  );
};
