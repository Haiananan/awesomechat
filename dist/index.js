var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import { encode } from "gpt-3-encoder";
class AwesomeChatBot {
    constructor(token, systemDescription) {
        this.chatUsage = {
            totalTokens: 0,
            promptTokens: 0,
            completionTokens: 0,
        };
        this.response = "";
        this.token = token;
        systemDescription && (this.systemDescription = systemDescription);
        this.API_URL = token.startsWith("ac-")
            ? `https://api.awesomechat.cn/v1/chat/completions`
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
        var _a;
        if (!this.id)
            return;
        this.cancelTokenSource.cancel("Canceling the chat request");
        (_a = this.onCancel) === null || _a === void 0 ? void 0 : _a.call(this, this.id, this.chatUsage);
    }
    chat({ chatContext, beforeReplyStart, onReplyStart, onReplying, onReplyEnd, chatConfig, onError, onCancel, }) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const next = beforeReplyStart === null || beforeReplyStart === void 0 ? void 0 : beforeReplyStart(tokensToSend);
                if (next === false)
                    return;
                this.clear();
                this.cancelTokenSource = axios.CancelToken.source();
                this.onCancel = onCancel;
                const request = Object.assign({ model: "gpt-3.5-turbo", messages, stream: true }, chatConfig);
                const promptString = messages.map((item) => item.content).join(" ");
                const { data } = yield axios.post(this.API_URL, request, {
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
                                onReplyStart === null || onReplyStart === void 0 ? void 0 : onReplyStart(this.id);
                            }
                            const word = JSON.parse(item).choices[0].delta.content || "";
                            if (word) {
                                this.response += word;
                            }
                            onReplying === null || onReplying === void 0 ? void 0 : onReplying(word, this.response, this.id);
                            this.chatUsage = this.calculateUsage(promptString, this.response);
                        });
                    }
                    catch (error) { }
                });
                data.on("end", () => {
                    const usage = this.calculateUsage(promptString, this.response);
                    this.chatUsage = usage;
                    this.id && (onReplyEnd === null || onReplyEnd === void 0 ? void 0 : onReplyEnd(this.response, this.id, this.chatUsage));
                });
                data.on("error", (error) => {
                    onError === null || onError === void 0 ? void 0 : onError(error);
                });
            }
            catch (error) {
                onError === null || onError === void 0 ? void 0 : onError(error);
            }
        });
    }
}
export default AwesomeChatBot;
