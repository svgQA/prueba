import { about_content } from '../utils/data/about';
import HomeAboutCenterImg from '@/assets/image/home-we-center.png';

export const HomeAbout = () => {
  return (
    <div className='flex flex-col items-center text-center bg-primary-opacity py-12'>
      <span className='text-2xl md:text-3xl font-bold px-4 text-blue-dark'>
        {about_content.title}
      </span>
      <span className='text-lg md:text-xl px-4 mt-2 text-gray-700'>
        {about_content.subtitle}
      </span>

      <div className='mt-7 flex items-center justify-center flex-col md:flex-row gap-0 px-4 gap-y-3'>
        <div
          // name='about'
          className='w-full md:w-[30%] flex flex-col md:flex-row items-center h-[50%] justify-center'
        >
          <div className='w-full bg-white rounded-md p-5 hover:border-gray-200 transition-all shadow-md'>
            <span className='text-[#707070] text-base md:text-[20px]'>
              {about_content.mainText}
            </span>
          </div>
        </div>

        <img src={HomeAboutCenterImg} alt='cellphone' className='w-80' />

        <div
          // name='mission'
          className='w-full md:w-[30%] flex flex-col items-center h-[66.67%] justify-center bg-we text-white p-5 rounded-e-md hover:bg-opacity-90 transition-all'
        >
          <span className='text-lg md:text-[20px] font-bold mt-2'>
            {about_content.missionTitle}
          </span>
          <span className='text-base md:text-[18px] text-center'>
            "{about_content.missionText}"
          </span>
          <span className='text-lg md:text-[20px] font-bold mt-4'>
            {about_content.valuesTitle}
          </span>
          <span className='text-base md:text-[18px] text-center mb-2'>
            {about_content.valuesText}
          </span>
        </div>
      </div>
    </div>
  );
};
