import { todoItems } from "../lib/plan";

export interface workflowAgentMessage{
    role: "user" | "Assistant" | "system",
    content:string

}

export interface workflowPipelineState{
    todo:todoItems[],
    thread:workflowAgentMessage[],
    files:Record<string,string>
    design:string,
    builderNotes:string,
    review:string
    summary:string
    planMessageId:string
} 

export function emptyPipelineState(thread:workflowAgentMessage[]): workflowPipelineState{
    return {
        todo:[],
        thread,
        files:{},
        design:"",
        builderNotes:"",
        review:"",
        summary:"",
        planMessageId:""
    }
}