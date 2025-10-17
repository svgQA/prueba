import { IRequestModelOutput } from '../utils/service';

export async function streamGetResponse(
  model: IRequestModelOutput,
  onData: (chunk: string) => void,
  onDone?: () => void,
  onError?: (err: any) => void
) {
  const urlObj = new URL(model.url);
  const sseUrl = new URL('/events/stream', urlObj.origin);
  const tenant = model.header['voxline-tenant'];

  if (tenant) {
    sseUrl.searchParams.set('tenant', tenant);
  }

  const response = await fetch(sseUrl.toString(), {
    method: model.method, // SSE ONLY GET
    headers: {
      Accept: 'text/event-stream',
      'Cache-Control': 'no-cache',
      Authorization: model.header.Authorization,
    },
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
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const content = line.replace('data: ', '').trim();

          if (content === '[DONE]') {
            onDone?.();
            return;
          }

          if (content && content !== '') {
            try {
              const parsedData = JSON.parse(content);
              if (parsedData.data) {
                onData(parsedData.data);
              } else {
                onData(content);
              }
            } catch {
              const output = content
                .replace(/^0:\s*/, '')
                .replace(/^"/, '')
                .replace(/"$/, '');
              onData(output);
            }
          }
        }
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err);
  }
}
