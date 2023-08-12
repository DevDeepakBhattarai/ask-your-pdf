import { Page } from "puppeteer";
import { sleep } from "../utils/sleep";
import { config } from "dotenv";
config();

export async function Login(page: Page) {
  try {
    await page.waitForSelector(
      "#__next > div > div > div > button:nth-child(1)",
      { timeout: 5000 }
    );
    await page.click("#__next > div > div > div > button:nth-child(1)");
  } catch (e) {}

  try {
    await page.waitForSelector(
      "#__next > div > div > div > div > button:nth-child(1)",
      { timeout: 5000 }
    );
    await page.click("#__next > div > div > div > div > button:nth-child(1)");
  } catch {}
  await sleep(2000);
  await page.waitForSelector("#username");
  await page.type("#username", process.env.EMAIL!);
  await sleep(2000);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();
  await sleep(2000);
  await page.waitForSelector("#password");
  await sleep(2000);
  await page.type("#password", process.env.PASSWORD!);
  await sleep(100);
  await page.click(
    "body > div > main > section > div > div > div > form > div.c22fea258 > button"
  );
}
