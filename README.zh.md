
[English](README.md) | [中文](README.zh.md)

# AwesomeChat

![演示 gif](/demochat.gif)

## 测试key

```js
ac-495ff9f6-5980-416d-9121-ffa93ed83761
```

如果key还能用，觉得好用还想继续用的话，建议去[小铺](https://shop.haianhezi.com/?code=YT0yJmI9OQ%3D%3D)购买一个自己的key，一分钱一万。顺便记得点个Star，也让我方便统计大概多少个Star换一次测试用key。作为开发者，我希望能够有更多的人使用这个项目，这样才能够让它变得更好。如果有人滥用key，短期内我将不再提供免费测试用key。这是大家共享的测试用key，希望各位遵守原则，谢谢

## 目录

- [特色](#%E7%89%B9%E8%89%B2)
- [安装](#%E5%AE%89%E8%A3%85)
- [使用](#%E4%BD%BF%E7%94%A8)
  - [简单对话](#%E7%AE%80%E5%8D%95%E5%AF%B9%E8%AF%9D)
  - [上下文对话](#%E4%B8%8A%E4%B8%8B%E6%96%87%E5%AF%B9%E8%AF%9D)
  - [聊天中断](#%E8%81%8A%E5%A4%A9%E4%B8%AD%E6%96%AD)
- [API](#api)
  - [bot.chat({options})](#botchatoptions)
  - [bot.cancel()](#botcancel)
- [types](#types)
  - [ChatContext](#chatcontext)
  - [ChatConfig](#chatconfig)
  - [ChatUsage](#chatusage)

## 特色

🚀快速回复
🤖流式回复
😎对话记忆
👏聊天中断
😃快速部署

## 安装

```bash
npm install awesomechat
or
yarn add awesomechat
or
pnpm install awesomechat
```

## 使用

### 简单对话

```js
import AwesomeChatBot from "awesomechat";
const key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // replace with your key
const systemDescription = "You are a good robot";
const chatBot = new AwesomeChatBot(key,systemDescription);

chatBot.chat({
  chatContext: "hello?",
  onReplying(word, reply, id) {
    console.log("onReplying", reply);
  },
  onError(error) {
    console.log("onError", error);
  },
});
```

### 上下文对话

```js
import AwesomeChatBot from "awesomechat";
const key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // replace with your key
const systemDescription =
  "You're a robot with emotions, and you need to add an emoji to the front of each sentence to express your emotions";

const chatBot = new AwesomeChatBot(key, systemDescription);

chatBot.chat({
  chatContext: [
    { role: "user", content: "100" },
    { role: "user", content: "200" },
    { role: "user", content: "300" },
    {
      role: "user",
      content: "What is the maximum number in the dialog above",
    },
  ],

  onReplying(word, reply, id) {
    console.log("onReplying", reply);
  },
  onReplyEnd(completion, id, usage) {
    if (completion.includes("300")) {
      console.log("😄You are right!");
    }
  },
  onError(error) {
    console.log("onError", error);
  },
});
```

### 聊天中断

```js
import AwesomeChatBot from "awesomechat";
const key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // replace with your key
const chatBot = new AwesomeChatBot(key);

chatBot.chat({
  chatContext: "Write a 500-word essay about AI",
  onReplyStart() {
    console.log("🚀copy that!");
  },
  onReplying(word, reply) {
    console.log("onReplying", reply);
  },
  onCancel(id, usage) {
    console.log("onCancel", id, usage);
  },
});

setTimeout(() => {
  chatBot.cancel();
}, 6000);
```

## API

### bot.chat({options})

键 | 类型 | 描述
---|---|---
|chatContext | ChatContext[] / string |聊天上下文对象数组或表示当前对话上下文的字符串。
|beforeReplyStart |(promptTokens: number) => boolean;| 在对话开始前执行，返回一个布尔值。如果该值为 true，则对话继续进行；如果该值为 false，则会中断后续内容。通常在条件验证和身份验证等场景中使用。
|onReplyStart| (id: string) => void;| 当模型开始生成响应时调用的函数。
|onReplying| (word: string, reply: string, id: string) => void;| 当模型正在生成响应时调用的函数。word参数是当前生成的字符，reply 参数是模型当前生成内容的拼接结果
|onReplyEnd| (completion: string, id: string, usage: ChatUsage) => void;| 当模型生成响应完成时调用的函数。completion 参数是最终生成的响应。
|onError |(error: Error) => void;| 当出现错误时调用的回调函数。error 参数是错误对象。
|onCancel |(id: string, usage: ChatUsage) => void;| 当聊天被取消时执行的回调函数。返回聊天 ID 和使用信息。
|chatConfig |ChatConfig| 额外的配置选项，用于传递给模型。

### bot.cancel()

当聊天进行中时取消当前聊天

## types

### ChatContext

```js
type ChatContext = {
    role: "assistant" | "user" | "system";
    content: string;
};
```

### ChatConfig

```js
type ChatConfig = {
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
```

### ChatUsage

```js
type ChatUsage = {
    /**  The number of total tokens used*/
    totalTokens: number;
    /**  The number of requests made to the API */
    promptTokens: number;
    /**  The number of tokens generated by the model */
    completionTokens: number;
};
```
