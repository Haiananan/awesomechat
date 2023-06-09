export type ChatOptions = {
    /**
     * An array of chat context objects or a string representing the current conversation context.
     *
     * @example
     * // Using an array of ChatContext objects
     * const chatContext = [
     *   { role: 'user', content: 'Hi, can you recommend a good restaurant?' },
     *   { role: 'assistant', content: 'Sure, what type of cuisine are you in the mood for?' },
     *   { role: 'user', content: 'I am in the mood for Italian food.' }
     * ];
     *
     * // Using a string to represent the chat context
     * const chatContext = "Hi, can you recommend a good restaurant?"
     */
    chatContext: ChatContext[] | string;
    /**
     * Executed before the start of a conversation, it returns a boolean value.
     * If the value is true, the conversation continues. If the value is false,
     * the subsequent content is interrupted. It is commonly used in scenarios
     * such as conditional verification and authentication.
     *
     * @example
     * const chatOptions: ChatOptions = {
     *   beforeReplyStart: (tokens) => {
     *     const isAuthenticated = checkUserAuthentication();
     *     if (!isAuthenticated) {
     *       console.log('User is not authenticated. Ending conversation.');
     *       return isAuthenticated;
     *     }
     *     if (tokens >= 5470) {
     *       console.log('Too long. Ending conversation.');
     *       return false
     *     }
     *     return true
     *   }
     * };
     */
    beforeReplyStart?: (promptTokens: number) => boolean;
    /**
     * Function to be called when the model starts generating a response.
     *
     * @example
     * const chatOptions: ChatOptions = {
     *   onReplyStart: (id: string) => {
     *     console.log(`Starting to generate reply for conversation with ID: ${id}`);
     *   }
     * };
     */
    onReplyStart?: (id: string) => void;
    /**
     * Function to be called when the model is generating a response. The reply parameter
     * is the current completion generated by the model.
     *
     * @example
     * const chatOptions: ChatOptions = {
     *   onReplying: (word: string, reply: string, id: string) => {
     *     console.log(`Current reply for conversation with ID ${id}: ${reply}`);
     *   }
     * };
     */
    onReplying?: (word: string, reply: string, id: string) => void;
    /**
     * Function to be called when the model finishes generating a response. The completion
     * parameter is the final generated response.
     *
     * @example
     * const chatOptions: ChatOptions = {
     *   onReplyEnd: (completion: string, id: string) => {
     *     console.log(`Generated reply for conversation with ID ${id}: ${completion}`);
     *   }
     * };
     */
    onReplyEnd?: (completion: string, id: string, usage: ChatUsage) => void;
    /**
     * Function to be called when an error occurs. The error parameter is the error object.
     */
    onError?: (error: any) => void;
    /**
     *This callback function is executed when the chat is cancelled.
     *
     *It returns the chat ID and usage information.
     *@example
     *const handleCancel = (id: string, usage: ChatUsage) => {
     *  console.log('Chat with ID ${id} has been cancelled.')
     *  console.log('Chat usage information:', usage)
     *}
     *
     */
    onCancel?: (id: string, usage: ChatUsage) => void;
    /** Additional configuration options to be passed to the model. */
    chatConfig?: ChatConfig;
};
export type ChatUsage = {
    /**  The number of total tokens used*/
    totalTokens: number;
    /**  The number of requests made to the API */
    promptTokens: number;
    /**  The number of tokens generated by the model */
    completionTokens: number;
};
export type ChatConfig = {
    /**  What sampling temperature to use, between 0 and 2 */
    temperature?: number;
    /**  An alternative to sampling with temperature, where the model considers the results of the tokens with top_p probability mass */
    top_p?: number;
    /**  How many chat completion choices to generate for each input message */
    n?: number;
    /**  Up to 4 sequences where the API will stop generating further tokens */
    stop?: string | string[];
    /**  The maximum number of tokens to generate in the chat completion */
    max_tokens?: number;
    /**  Number between -2.0 and 2.0 */
    presence_penalty?: number;
    /**  Number between -2.0 and 2.0 */
    frequency_penalty?: number;
    /**  A json object that maps tokens to an associated bias value from -100 to 100 */
    logit_bias?: {
        [key: string]: number;
    };
    /**  A unique identifier representing your end-user */
    user?: string;
};
export type ChatContext = {
    role: "assistant" | "user" | "system";
    content: string;
};
declare class AwesomeChatBot {
    private API_URL;
    private token;
    private systemDescription?;
    private cancelTokenSource?;
    private onCancel?;
    private chatUsage?;
    private id?;
    private response;
    constructor(token: string, systemDescription?: string);
    private clear;
    private calculateUsage;
    cancel(): void;
    chat({ chatContext, beforeReplyStart, onReplyStart, onReplying, onReplyEnd, chatConfig, onError, onCancel, }: ChatOptions): Promise<void>;
}
export default AwesomeChatBot;
