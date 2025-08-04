import { useTranslation } from "react-i18next";
import { IOptionCheck, SelectCheckProps } from "./interface";

export const SelectCheck = ({
    input,
    options,
    label,
    loading = false
}: SelectCheckProps) => {
    const { t } = useTranslation();

    return (
        <>
            {label && (
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {t(label)}
                </label>
            )}
            <div className='flex gap-2'>
                {options.map((option: IOptionCheck) => (
                    <label key={option.value} className='relative flex-1 cursor-pointer'>
                        <input
                            {...input}
                            type='radio'
                            value={option.value}
                            checked={input.value === option.value}
                            className='sr-only'
                            disabled={loading}
                        />
                        <div className={`
                        flex items-center justify-center p-1.5 rounded-md border transition-all duration-200 min-h-[35px]
                        ${input.value === option.value
                                ? `border-${option.color || 'primary'} bg-${option.color || 'primary'}/10 shadow-sm scale-[1.02]`
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                            <div className='flex flex-col items-center gap-0.5'>
                                <span className={`vox-icon vx-icon-${option.icon} text-sm ${input.value === option.value
                                    ? `text-${option.color || 'primary'}`
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`} />
                                <span className={`text-xs font-medium leading-tight ${input.value === option.value
                                    ? `text-${option.color || 'primary'}`
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {option.label}
                                </span>
                            </div>
                        </div>
                    </label>
                ))}
            </div>
        </>
    );
};
