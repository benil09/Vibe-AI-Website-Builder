import { todoItems } from "../lib/plan";

export interface AgentChatMessage {
    role: "user" | "assistant" | "system",
    content: string,
}

export interface AgentRunHooks {
    onProgress?: () => void;
    onTodos?: (todos: todoItems[], activity?: { agent: string, detail: string } | null) => Promise<void>;
    signal?: AbortSignal;
}

export interface PlannerInput extends AgentRunHooks {
    prompt: string,
    todo: todoItems[],
    thread: AgentChatMessage[]

}

export interface PlannerOutput {
    notes: string,
    todos: todoItems[],
    thread: AgentChatMessage[]
}

export interface DesignerInput {
    prompt: string,
    thread: AgentChatMessage[]
}

export interface DesignerOutput {
    design: string,
    thread: AgentChatMessage[]
}