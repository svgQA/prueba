interface IDropzoneProps {
  description: string;
  icon?: string;
}

export const CardDropzone = ({ description, icon }: IDropzoneProps) => {
  return (
    <div className='border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer border-b-light-dark dark:border-b-dark-light flex flex-row justify-between items-center'>
      <span className={`vox-icon vx-icon-${icon}`} />
      <p className='text-t-light dark:text-t-dark mx-3'>{description}</p>
      <input type='file' name='logo' accept='image/*' className='hidden' />
    </div>
  );
};
