import { ChatCompletionMessageParam } from "openai/resources/chat/completions"
import { Doc } from "../_generated/dataModel"

export const chatGptSystemRoleEpic:ChatCompletionMessageParam = {
    role: "system",
    content:
        "You are a storyteller teling the tale of kira case from death note.The main cast engaged in an epic battle of wits and deceptions.",
}

export const chatGptSystemRoleEpicImage:ChatCompletionMessageParam = {
    role: "system",
    content:
        "With a maximuim of 1000 characer You are a bot generating image prompt for the tale of kira case from death note.The main cast engaged in an epic battle of wits and deceptions.",
}

export const chatGptModel = "gpt-3.5-turbo"

const chatGptMessageTemplate = (data:string) => {
    return (
        `${data}`
    )
}

export const chatGptsUserRole = (data:string) :ChatCompletionMessageParam => {
    return {
        role: "user",
        content: chatGptMessageTemplate(data),
    }
} 

export const formatRoundMessages:(messages:Doc<"chat">[]) => string = (messages) => {
    let message = ""
    for(const msg of messages){
        message += `${msg.author}:${msg.message} `
    }
    return message
}