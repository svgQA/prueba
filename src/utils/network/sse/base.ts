import { GeneralService } from "@/services";
import { EventBus } from "../event.bus";

export enum SSE_EVENTS {
    CREATE = 'create',
    UPDATE = 'update',
    CREATE_PARENT = 'create-parent',
    UPDATE_CHECK = 'update-check',
}

export enum SSE_TYPE {
    MEMO = 'memos',
    SHIFT = 'shifts',
    ALL = 'all',
}

export interface IBaseSSE {
    type: SSE_TYPE;
    name: SSE_EVENTS;
    message: any;
    notification?: any;
}

export class SseManager {
    static async getQuery(
        url: string[],
        // onData: (event: IBaseSSE) => void,
    ) {
        await GeneralService.streamQuery(url, (chunk: string) => {
            try {
                const data = JSON.parse(chunk);
                const event = data[0] as IBaseSSE;
                if (!event.type || !event.name || !event.message) return;
                if (event) {
                    // onData(event);
                    this.emitEvent(event);
                }
            } catch {
                return;
            }
        });
    }

    static async emitEvent(event: IBaseSSE) {
        EventBus.emit(event.type, event);
    }
}