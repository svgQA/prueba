import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addQuestion, questions, removeQuestion } from './store';
import { Question } from './components';
import { useSignal } from '@preact/signals';

export const FormCreateSettingPage: FunctionComponent = () => {
  const selectedQuestionId = useSignal<string | null>(null);
  useEffect(() => {
    document.title = 'Forms Create Settings';
  }, []);

  const showElements = () => {
    console.log(questions.value);
  };

  const handleSelect = (id: string) => {
    if (id === selectedQuestionId.value) return;
    selectedQuestionId.value = selectedQuestionId.value === id ? null : id;
  };

  return (
    <section className='h-full'>
      <div className='flex flex-row relative'>
        <div className='w-8/12 flex flex-col items-center h-[80vh] overflow-y-scroll vox-scroll-design'>
          <div class='absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10'>
            <div
              class='bg-blue-500 px-2 py-1 cursor-pointer text-white w-15 h-15 rounded-md text-center'
              onClick={addQuestion}
            >
              <span className='vx-icon vx-users' />
              <h6 className='text-xs'>Question</h6>
            </div>
            <div
              class='bg-gray-300 px-2 py-1 cursor-pointer text-gray-700 w-15 h-15 rounded-md text-center'
              onClick={showElements}
            >
              <span className='vx-icon vx-gateway' />
              <h6 className='text-xs'>Section</h6>
            </div>
          </div>
          {/* START: Sesiones */}
          <DndProvider backend={HTML5Backend}>
            <table class='w-full text-left'>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Type of Response</th>
                </tr>
              </thead>
              <tbody>
                {questions.value.map((question, index) => (
                  <Question
                    key={question.id}
                    question={question}
                    index={index}
                    selected={selectedQuestionId.value === question.id}
                    onSelect={handleSelect}
                    onDelete={removeQuestion}
                  />
                ))}
              </tbody>
            </table>
          </DndProvider>
          {/* END: Sesiones */}
        </div>
      </div>
    </section>
  );
};
