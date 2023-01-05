export enum Area {
  Kansai = "06",
}
const BASE_URL = "https://looop-denki.com/api";
const TODAY_INDEX = 1;

export default class ElectricityCrawler {
  constructor(private url: string = BASE_URL) {}
  async fetchCurrentInfoByArea(
    area: Area,
    now: Date
  ): Promise<{ level: number; price: number }> {
    const minutesRangeIndex = Math.floor(
      (now.getHours() * 60 + now.getMinutes()) / 30
    );
    const queryString = new URLSearchParams({ select_area: area });
    const res = await fetch(`${this.url}/prices?${queryString}`, {
      method: "get",
      headers: {
        // needed to avoid 403
        // https://stackoverflow.com/a/16627277
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
      }
    });
    if (res.ok) {
      const json: any = await res.json();
      const { level: levels, price_data } = json[TODAY_INDEX];
      const level = levels[minutesRangeIndex];
      const price = price_data[minutesRangeIndex];
      return { level, price };
    }
    throw new Error(await res.text());
  }
}
