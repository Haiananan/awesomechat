import AwesomeChatBot from "../";
const key = "ac-76c11b99-9990-4996-bf8b-ce2293801522"; // replace with your key
const systemDescription = "You are a good robot";
const chatBot = new AwesomeChatBot(key,systemDescription);

chatBot.chat({
  chatContext: `hello`,
  onReplying(word, reply, id) {
    console.log("onReplying", reply);
  },
  onError(error) {
    console.log("onError", error.message);
  },
});