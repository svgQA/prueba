import { IRequestModelOutput } from '../utils/service';

export async function streamIAResponse(
  model: IRequestModelOutput,
  onData: (chunk: string) => void,
  onDone?: () => void,
  onError?: (err: any) => void
) {
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

      const content = lines[0] || '';

      if (content.startsWith('data: 0:')) {
        const output = content
          .replace('data: ', '')
          .trim()
          .replace(/^0:\s*/, '')
          .replace(/^"/, '')
          .replace(/"$/, '');
        onData(output);
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err);
  }
}
