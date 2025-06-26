export interface ChatMessage {
    sender: string;
    reciever: string;
    message: string;
    incoming: boolean;
    status: string,
    createdAt: number | string;
}
export interface MessageDoc {
    id: string;
    sending: ChatMessage[];
    failed: ChatMessage[];
    createdAt: string;
    updatedAt: string;
    firstMessage?: ChatMessage;
}

