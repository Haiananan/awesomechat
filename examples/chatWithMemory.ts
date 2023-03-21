import AwesomeChatBot from "../";
const key = "ac-76c11b99-9990-4996-bf8b-ce22938015dc"; // replace with your key
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
