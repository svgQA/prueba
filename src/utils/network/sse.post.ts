import { IRequestModelOutput } from './utils/service';

export async function streamIAResponse(
  model: IRequestModelOutput,
  onData: (chunk: string) => void,
  onDone?: () => void,
  onError?: (err: any) => void
) {
  // console.log('streamIAResponse', model);
  const response = await fetch(model.url, {
    method: model.method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...model.header,
    },
    body: model.data,
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    onError?.('No stream body available');
    return;
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const content = line.replace('data: ', '').trim();
          onData(content);
        }
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err);
  }
}
