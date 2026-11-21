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