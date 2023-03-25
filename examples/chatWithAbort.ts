import AwesomeChatBot from "../";
const key = "ac-76c11b99-9990-4996-bf8b-ce2293801533"; // replace with your key
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
