export interface FrequentQuestion {
    id: number;
    question: string;
}

export type Chats = {
    [key: string]: {
        new: number;
        messages: ChatMessage[];
    };
};
