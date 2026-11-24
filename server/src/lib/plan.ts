export type todoStatus = "pending" | "in_progress" | "completed";

export interface todoItems {
    content:string,
    status:todoStatus
}

export const PLAN_KIND = "plan"

export interface planActivity{
    agent:string,
    detail:string
}

export interface PlanMessage{
    todo:todoItems[],
    kind:typeof PLAN_KIND,
   activity?:planActivity
}

export const STATUSES:todoStatus[] = ["pending","in_progress","completed"]

// -> expects any input value and returns a normalized todoItems object or null if invalid
export function normalizeTodo(value: unknown): todoItems | null {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return null;
    }

    const {content , status} =value as {content?:unknown , status?:unknown};
    const rawContent = typeof content === "string" ?content.trim() : "";
    if (!rawContent) {
        return null;
    }
     
    const rawStatus = typeof status === "string" ? status.trim() : "";
    const normalizestatus: todoStatus = STATUSES.includes(rawStatus as todoStatus)
        ? (rawStatus as todoStatus)
        : "pending";

    return {
        content: rawContent,
        status:normalizestatus,
    };
}

// -> expects an unknown value and returns an array of valid normalized todoItems
export function parseTodo(value: unknown): todoItems[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map(normalizeTodo)
        .filter((item): item is todoItems =>Boolean(item));
}

// -> expects a list of todoItems and returns a formatted plan string for the agent
export function formatPlanForAgent(todos: todoItems[]): string {
    const lines = todos.map(
        (todo, index) => `${index + 1}. [${todo.status}] ${todo.content}`
    );

    return `Current plan:\n${lines.join("\n")}\n\nFollow this plan in order, update it with write_todos as you complete steps.`;
}

// -> expects JSON string content and returns an array of todoItems if valid plan message, otherwise null
export function parsePlanMessage(content: string): todoItems[] | null {
    try {
        const parsed = JSON.parse(content) as Partial<PlanMessage>;
        if (!parsed || parsed.kind !== PLAN_KIND) {
            return null;
        }

        const todos = parseTodo(parsed.todo);
        return todos.length > 0 ? todos : null;
    } catch {
        return null;
    }
}



