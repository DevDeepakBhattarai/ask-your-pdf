import { Page } from "puppeteer";
import { sleep } from "../utils/sleep";

export async function askGPT(page: Page, prompt: string) {
  await page.type("textarea", prompt);
  await sleep(100);
  await page.waitForSelector(
    "#__next > div > div > div > main > div > form > div > div > button"
  );

  await page.click(
    "#__next > div > div > div > main > div > form > div > div > button"
  );

  const finalAnswer = await new Promise<string>((resolve) => {
    page.on("console", (value) => {
      resolve(value.text());
    });
  });

  return finalAnswer!;
}
