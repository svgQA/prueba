import { type FunctionComponent } from 'preact';
import { ResponderBuilder } from './components/responder';
import { getResponse } from './store/response';

export const FormResponseSettingPage: FunctionComponent = () => {
  return (
    <section className='pt-5'>
      {getResponse.value && <ResponderBuilder format={getResponse.value} />}
    </section>
  );
};
