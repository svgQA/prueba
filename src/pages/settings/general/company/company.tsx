import { type FunctionComponent } from 'preact';
import { TargetedEvent } from 'preact/compat';
import { useEffect, useState, useRef } from 'preact/hooks';
import { Cards } from '@/components/compose/cards/cards';

export const CompanySettingPage: FunctionComponent = () => {
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cards, setCards] = useState<string[]>(['1234']);
  const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCard = () => {
    if (newCard.number && newCard.expiry && newCard.cvc) {
      setCards([...cards, newCard.number.slice(-4)]);
      setNewCard({ number: '', expiry: '', cvc: '' });
      setIsModalOpen(false);
    }
  };

  const handleImagenChange = (event: TargetedEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickSubir = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    document.title = 'Company Settings';
  }, []);

  return (
    <div className='container h-full overflow-y-auto'>
      <div className='container flex flex-row justify-between p-8'>
        <div className='container-input w-1/2  space-y-6 pr-4 '>
          <form className='space-y-4'>
            <div className='space-y-2'>
              <input
                id='nombre'
                type='text'
                placeholder='Ingrese el nombre'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>

            <div className='space-y-2'>
              <textarea
                id='descripcion'
                placeholder='Ingrese la descripción'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                rows={4}
              ></textarea>
            </div>

            <div className='space-y-2'>
              <input
                id='nit'
                type='text'
                placeholder='Ingrese el NIT'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
              />
            </div>
          </form>

          <div className='w-1/2 max-w-md overflow-hidden  rounded-lg shadow-md ml-auto'>
            <div className='relative aspect-video bg-gradient-to-br from-gray-300 to-gray-300 flex items-center justify-center'>
              {imagenPreview ? (
                <img
                  src={imagenPreview}
                  alt='Vista previa'
                  className='w-full h-full object-cover'
                />
              ) : (
                <svg
                  className='w-1/3 h-1/3 text-blue-300'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              )}
              <div className='absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center'>
                <button
                  onClick={handleClickSubir}
                  className='bg-white text-gray-800 font-bold py-2 px-4 rounded-full opacity-0 hover:opacity-100 transition-opacity'
                >
                  <svg
                    className='w-5 h-5 mr-2 inline-block'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                    />
                  </svg>
                  Subir Imagen
                </button>
              </div>
            </div>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={handleImagenChange}
              accept='image/*'
            />
          </div>
        </div>

        <div className='container-card w-1/2  space-y-6 pl-4'>
          <Cards
            id='ID'
            name='Company 1'
            color='bg-[#00BDD6]'
            colorText='#fff'
            qrIcon='qr'
            currencyIcon='currency'
            timeIcon='time'
            alarmIcon='alarm'
          />
          <Cards
            id='ID'
            name='Company 2'
            color='bg-[#D9D9D9]'
            colorText='#000'
            qrIcon='qr'
            currencyIcon='currency'
            timeIcon='time'
            alarmIcon='alarm'
          />
        </div>
      </div>

      <div className='border-b border-gray-300 mx-8 pb-2 '>
        <h2 className='text-sm font-bold'>FACTURACIÓN</h2>
      </div>

      <div className='container flex flex-row justify-between p-8'>
        <div className='container-card w-1/2  space-y-6 pr-4'>
          <Cards
            id='ID'
            name='FAC/001'
            color='bg-[#00BDD6]'
            colorText='#fff'
            qrIcon='qr'
            currencyIcon='currency'
            timeIcon='time'
            alarmIcon='alarm'
          />
          <div className='container-card-credit space-y-4  flex flex-row '>
            <div className='card-credit flex flex-row gap-4'>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className='bg-gray-200 w-64 p-4 rounded-lg shadow h-40'
                >
                  <div className='flex items-center space-x-4'>
                    <svg
                      className='h-8 w-8 text-gray-500 '
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                      />
                    </svg>
                    <div className='flex-1'>
                      <div className='bg-white h-6 w-full rounded flex items-center px-2 '>
                        <span className='text-gray-400'>•••• •••• •••• </span>
                      </div>
                    </div>
                    <div className='text-sm font-medium'>{card}</div>
                  </div>
                </div>
              ))}

              <div
                className='card-add w-64 h-[72px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-dashed border-2 border-gray-300 rounded-lg h-40 '
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  className='h-8 w-8 text-gray-400 mt'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              </div>
            </div>
            {isModalOpen && (
              <div className='modal-add fixed inset-0  flex items-center justify-center z-50'>
                <div className='bg-white p-6 rounded-lg w-100 shadow-2xl'>
                  <h2 className='text-xl font-bold mb-4'>Nueva tarjeta</h2>
                  <div className='space-y-4'>
                    <div>
                      <label
                        htmlFor='cardNumber'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Numero de tarjeta
                      </label>
                      <input
                        id='cardNumber'
                        type='text'
                        placeholder='1234 5678 9012 3456'
                        value={newCard.number}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            number: (e.target as HTMLInputElement).value,
                          })
                        }
                        className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <label
                          htmlFor='expiryDate'
                          className='block text-sm font-medium text-gray-700'
                        >
                          Fecha de expiración
                        </label>
                        <input
                          id='expiryDate'
                          type='text'
                          placeholder='MM/YY'
                          value={newCard.expiry}
                          onChange={(e) =>
                            setNewCard({
                              ...newCard,
                              expiry: (e.target as HTMLInputElement).value,
                            })
                          }
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='cvc'
                          className='block text-sm font-medium text-gray-700'
                        >
                          CVC
                        </label>
                        <input
                          id='cvc'
                          type='text'
                          placeholder='123'
                          value={newCard.cvc}
                          onChange={(e) =>
                            setNewCard({
                              ...newCard,
                              cvc: (e.target as HTMLInputElement).value,
                            })
                          }
                          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-6 flex justify-end space-x-3'>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCard}
                      className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='container-card w-1/2  space-y-6  pl-4'>
          <Cards
            id='ID'
            name='FAC/002'
            color='bg-[#D9D9D9]'
            colorText='#000'
            qrIcon='qr'
            currencyIcon='currency'
            timeIcon='time'
            alarmIcon='alarm'
          />
          <Cards
            id='ID'
            name='FAC/003'
            color='bg-[#D9D9D9]'
            colorText='#000'
            qrIcon='qr'
            currencyIcon='currency'
            timeIcon='time'
            alarmIcon='alarm'
          />
        </div>
      </div>
    </div>
  );
};
