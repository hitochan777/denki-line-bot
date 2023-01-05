import ElectricityCrawler, { Area } from "./electricity_crawler";
import LineClient, { TextMessage } from "./line";

export interface Env {
  VERBOSE: string,
  CHANNEL_ACCESS_TOKEN: string;
  CHANNEL_SECRET: string;
}

const JST_OFFSET_MILLISECONDS = 9 * 60 * 60 * 1000;

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const line = new LineClient(env.CHANNEL_ACCESS_TOKEN, env.CHANNEL_SECRET);
    const crawler = new ElectricityCrawler();
    const now = new Date(new Date().getTime() + JST_OFFSET_MILLISECONDS); // Add JST offset
    const currentInfo = await crawler.fetchCurrentInfoByArea(Area.Kansai, now);
    if (env.VERBOSE && env.VERBOSE.length > 0) {
        const message: TextMessage = {
          type: "text",
          text: `現在の単価: ${currentInfo.price}円/KWh`,
        };
        await line.broadcast(message);
    }
    if (currentInfo.level < 0) {
      const message: TextMessage = {
        type: "text",
        text: `今の時間はでんき日和です。現在の単価: ${currentInfo.price}円/KWh`,
      };
      await line.broadcast(message);
    } else if (currentInfo.level > 0) {
      const message: TextMessage = {
        type: "text",
        text: `今の時間はでんき警報が出ています。現在の単価: ${currentInfo.price}円/KWh`,
      };
      await line.broadcast(message);
    }
  },
};
