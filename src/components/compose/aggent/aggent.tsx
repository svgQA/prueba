import { signal, useSignal } from '@preact/signals';

import { Button } from '@/components/common/button/button';
import { Messages } from './message';
import { useEffect, useState } from 'preact/hooks';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { useUserStore } from '@/store/slices';
import { tenant_header } from '@/env.config';
// import { EventSource } from 'eventsource';

export const showAIAssistant = signal(false);

interface IAggentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts: [];
}

interface ITool {
  name: string;
  description: string;
}

export const AIAssistant = () => {
  const isOpen = showAIAssistant.value;
  const input = useSignal<string | undefined>('');
  const [error, setError] = useState<string | null>(null);
  const isLoading = useSignal<boolean>(false);
  const [messages, setMessages] = useState<IAggentMessage[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [transport, setTransport] = useState<SSEClientTransport | null>(null);
  const [_, setTools] = useState<ITool[]>([]);

  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    input.value = target.value;
  };

  // 1. No se esta conectando al iniciar
  // 2. Cuando carga la pagina se conecta
  // 3. al realizar la conexiòn se ejecuta 4 veces
  // 4. Pierde la conexion muy rapido si algo cambia
  // 5. Agregar un boton para cargar el server
  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!client) {
      // setupClient();
      setError('Client is not initialized');
      return;
    }

    isLoading.value = true;
    setError(null);

    const inputValue = input.value;
    if (!inputValue) return;
    const newMessage: IAggentMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      parts: [],
    };
    setMessages((prev) => [...prev, newMessage]);
    input.value = '';
    try {
      const response = await client.callTool({
        name: 'hello-world',
        arguments: {
          name: inputValue,
        },
      });
      // @ts-ignore
      if (response.content?.[0]?.text) {
        // @ts-ignore
        const searchResult = String(response.content[0].text);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: searchResult,
            parts: [],
          },
        ]);
      } else {
        throw new Error('No search results found');
      }
    } catch (error) {
      setError('Error sending message');
    } finally {
      isLoading.value = false;
    }
  };

  const { getToken, getSelected } = useUserStore();

  useEffect(() => {
    const setupClient = async () => {
      if (client) return;

      const newClient = new Client(
        { name: 'Brave Search Client', version: '1.0.0' },
        { capabilities: { tools: {} } }
      );

      const tenant = getSelected();
      if (!tenant?.tenant_id) {
        throw new Error('ERROR: not include header');
      }

      const headers = {
        // Accept: 'text/event-stream',
        Authorization: getToken(),
        [tenant_header]: tenant.tenant_id,
      };
      const newTransport = new SSEClientTransport(
        new URL('http://localhost:3005/sse'),
        {
          requestInit: {
            headers,
          },
          eventSourceInit: {
            async fetch(input: Request | URL | string, init?: RequestInit) {
              const headers = new Headers(init?.headers || {});
              headers.set('Authorization', getToken());
              headers.set(tenant_header, tenant.tenant_id);
              return fetch(input, { ...init, headers });
            },
          },
        }
      );

      try {
        await newClient.connect(newTransport);
        setClient(newClient);
        setTransport(newTransport);

        // Get tools from server capabilities
        const capabilities = await newClient.listTools();
        const availableTools = capabilities.tools.map((tool) => ({
          name: tool.name,
          description: tool.description || 'No description available',
        }));
        setTools(availableTools);
      } catch (err) {
        setError(`Failed to connect to MCP server: ${(err as Error).message}`);
        console.error('Connection error:', err);
      }
    };
    setupClient();
    return () => {
      transport?.close();
    };
  }, []);

  const errorMessage = error ? (
    <div className='p-3 text-red-500 text-sm'>Error: {error}</div>
  ) : null;

  return (
    <div className='relative z-20'>
      <button
        onClick={() => (showAIAssistant.value = !showAIAssistant.value)}
        className='flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:opacity-90 transition-opacity'
      >
        <div className='w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center text-xs font-medium'>
          AI
        </div>
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-2 w-[700px] h-[600px] bg-gray-900 rounded-lg shadow-xl border border-orange-500/20 flex flex-col'>
          <div className='flex items-center justify-between p-3 border-b border-orange-500/20'>
            <h3 className='font-semibold text-white'>AI Assistant</h3>
            <button
              onClick={() => (showAIAssistant.value = !showAIAssistant.value)}
              className='text-gray-400 hover:text-white transition-colors'
            >
              <span className='vox-icon vox-icon-123' />
            </button>
          </div>

          <Messages messages={messages} />
          {errorMessage}
          {isLoading.value && (
            <div className='p-3 text-gray-400 text-sm'>AI is thinking...</div>
          )}

          <div className='p-3 border-t border-orange-500/20'>
            <form onSubmit={handleSubmit}>
              <div className='relative flex flex-row justify-between items-center'>
                <textarea
                  value={input.value}
                  onChange={handleInputChange}
                  placeholder='Type your message...'
                  className='w-full rounded-lg border border-orange-500/20 bg-gray-800/50 pl-3 pr-10 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent resize-none overflow-hidden'
                  rows={1}
                  style={{ minHeight: '36px', maxHeight: '120px' }}
                  onInput={(e) => {
                    const target = e.target as any;
                    target.style.height = 'auto';
                    target.style.height =
                      Math.min(target.scrollHeight, 120) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading.value}
                />
                <Button
                  name='Submit'
                  disabled={!input.value?.trim() || isLoading.value}
                  rounded
                  type='submit'
                  icon='155'
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
