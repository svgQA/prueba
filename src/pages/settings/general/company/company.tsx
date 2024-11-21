import { type FunctionComponent } from 'preact';
// import { TargetedEvent } from 'preact/compat';
import { useEffect } from 'preact/hooks';
// import { CreditCard, InvoiceCard } from '@/components/compose';
// import { InvoiceCard2 } from '@/components/compose/cards/invoice2';

export const CompanySettingPage: FunctionComponent = () => {
  // const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  // const [cards, setCards] = useState<string[]>(['1234']);
  // const [newCard, setNewCard] = useState({ number: '', expiry: '', cvc: '' });
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleAddCard = () => {
  //   if (newCard.number && newCard.expiry && newCard.cvc) {
  //     setCards([...cards, newCard.number.slice(-4)]);
  //     setNewCard({ number: '', expiry: '', cvc: '' });
  //     setIsModalOpen(false);
  //   }
  // };

  // const handleImagenChange = (event: TargetedEvent<HTMLInputElement>) => {
  //   const file = event.currentTarget.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagenPreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleClickSubir = () => {
  //   fileInputRef.current?.click();
  // };

  useEffect(() => {
    document.title = 'Company Settings';
  }, []);

  return (
    <div>
      {/* <div className='container flex flex-row justify-between p-8'>
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
                <span className='vx-icon vx-user text-lg' />
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
          <InvoiceCard2
            id='factura-1'
            name='factura-1'
            color='bg-[#00BDD6]'
            total={20}
            currency='EUR'
          />
          <InvoiceCard2
            id='factura-2'
            name='factura-2'
            color='bg-[#D9D9D9]'
            total={100}
            currency='COP'
          />
        </div>
      </div>

      <div className='border-b border-gray-300 mx-8 pb-2 '>
        <h2 className='text-sm font-bold'>FACTURACIÓN</h2>
      </div>

      <div className='flex flex-row justify-between p-8'>
        <div className='w-1/2 pr-2'>
          <div className=''>
            <InvoiceCard
              id='fact-30'
              name='FAC/001'
              total={20}
              currency='EUR'
              active
            />
          </div>
          <div className='flex flex-row justify-between'>
            <div className='card-credit flex flex-row w-full justify-between'>
              {cards.map((card, index) => (
                <CreditCard
                  id={`credit-card-${index}`}
                  name={`credit-card-${index}`}
                  number={card}
                />
              ))}
              <CreditCard
                id='add-credit-card'
                name='add-credit-card'
                onClick={setIsModalOpen}
              />
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

        <div className='w-1/2  justify-evenly pl-4'>
          <InvoiceCard
            id='fact-1'
            name='FAC/002'
            color='bg-[#D9D9D9]'
            currency='COP'
            total={20}
          />
          <div className='mt-4'>
            <InvoiceCard
              id='fact-2'
              name='FAC/003'
              color='bg-[#D9D9D9]'
              currency='USD'
              total={50}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};
