import AwesomeChatBot from "awesomechat";
const token = "ac-51c34767-0ec3-43d6-b2f9-845655a89314";

const bot = new AwesomeChatBot(token);

bot.chat({
  chatContext: "写一个一百字的小作文",
  onReplying: (word, reply) => {
    console.log(reply);
  },
});
