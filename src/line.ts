import type { TextMessage } from "@line/bot-sdk";
export type { TextMessage } from "@line/bot-sdk";

type TextMessages = {
  messages: TextMessage[];
};

class LineClient {
  constructor(
    private channelAccessToken: string,
    private channelSecret: string
  ) {}

  async broadcast(message: TextMessage): Promise<boolean> {
    const uuid = crypto.randomUUID();
    try {
      const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
        method: "post",
        headers: {
          "X-Line-Retry-Key": uuid,
          Authorization: `Bearer ${this.channelAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [message] }),
      });
      if (res.ok) {
        return true;
      }
      throw new Error(await res.text());
    } catch (ex) {
      console.error(ex);
      return false;
    }
  }
}

export default LineClient;
