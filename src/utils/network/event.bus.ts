type Event = { id: string; [key: string]: any };
type Listener = (event: Event) => void;
const listeners = new Set<Listener>();

export const EventBus = {
  emit(event: Event) {
    for (const listener of listeners) {
      listener(event);
    }
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
