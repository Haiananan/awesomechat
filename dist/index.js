import axios from "axios";
import { encode } from "gpt-3-encoder";
class AwesomeChatBot {
    API_URL;
    token;
    systemDescription;
    cancelTokenSource;
    onCancel;
    chatUsage = {
        totalTokens: 0,
        promptTokens: 0,
        completionTokens: 0,
    };
    id;
    response = "";
    constructor(token, systemDescription) {
        this.token = token;
        systemDescription && (this.systemDescription = systemDescription);
        this.API_URL = token.startsWith("ac-")
            ? `http://api.awesomechat.cn/v1/chat/completions`
            : "https://api.openai.com/v1/chat/completions";
    }
    clear() {
        this.cancelTokenSource = undefined;
        this.onCancel = undefined;
        this.response = "";
        this.chatUsage = {
            totalTokens: 0,
            promptTokens: 0,
            completionTokens: 0,
        };
        this.id = undefined;
    }
    calculateUsage(prompt, reply) {
        const promptTokens = encode(prompt).length;
        const completionTokens = encode(reply).length;
        const usage = {
            totalTokens: promptTokens + completionTokens,
            promptTokens,
            completionTokens,
        };
        return usage;
    }
    cancel() {
        if (!this.id)
            return;
        this.cancelTokenSource.cancel("Canceling the chat request");
        this.onCancel?.(this.id, this.chatUsage);
    }
    async chat({ chatContext, beforeReplyStart, onReplyStart, onReplying, onReplyEnd, chatConfig, onError, onCancel, }) {
        try {
            if (!chatContext) {
                throw new Error("chatContext is required");
            }
            const messages = [
                ...(this.systemDescription
                    ? [{ role: "system", content: this.systemDescription }]
                    : []),
                ...(typeof chatContext === "string"
                    ? [{ role: "user", content: chatContext }]
                    : chatContext),
            ];
            const tokensToSend = messages.reduce((acc, item) => {
                return acc + encode(item.content).length;
            }, 0);
            const next = beforeReplyStart?.(tokensToSend);
            if (next === false)
                return;
            this.clear();
            this.cancelTokenSource = axios.CancelToken.source();
            this.onCancel = onCancel;
            const request = {
                model: "gpt-3.5-turbo",
                messages,
                stream: true,
                ...chatConfig,
            };
            const promptString = messages.map((item) => item.content).join(" ");
            const { data } = await axios.post(this.API_URL, request, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
                responseType: "stream",
                cancelToken: this.cancelTokenSource.token,
            });
            data.on("data", (chunk) => {
                try {
                    if (!chunk.toString().includes("data"))
                        throw new Error(chunk);
                    const node = chunk.toString().replaceAll("data: ", "");
                    let nodeArr = node
                        .split("\n")
                        .filter((item) => item !== "" && item !== "[DONE]");
                    if (!Array.isArray(nodeArr))
                        nodeArr = [node];
                    nodeArr.forEach((item) => {
                        if (!this.id) {
                            this.id = JSON.parse(item).id;
                            onReplyStart?.(this.id);
                        }
                        const word = JSON.parse(item).choices[0].delta.content || "";
                        if (word) {
                            this.response += word;
                        }
                        onReplying?.(word, this.response, this.id);
                        this.chatUsage = this.calculateUsage(promptString, this.response);
                    });
                }
                catch (error) { }
            });
            data.on("end", () => {
                const usage = this.calculateUsage(promptString, this.response);
                this.chatUsage = usage;
                this.id && onReplyEnd?.(this.response, this.id, this.chatUsage);
            });
            data.on("error", (error) => {
                onError?.(error);
            });
        }
        catch (error) {
            onError?.(error);
        }
    }
}
export default AwesomeChatBot;
