import { Message } from "@/model/user";

export interface ApiResponse {
    success: boolean;
    msg:string,
    isAcceptingMessages?: boolean // optional
    messages?: Array<Message> // optional
}

