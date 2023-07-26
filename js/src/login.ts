import { Page } from "puppeteer";
import { sleep } from "../utils/sleep";
import { config } from "dotenv";
config();

export async function Login(page: Page) {
  await page.waitForSelector("#__next > div > div > div > button:nth-child(1)");

  await page.click("#__next > div > div > div > button:nth-child(1)");
  await page.waitForNavigation();
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
    "body > div > main > section > div > div > div > form > div.c5cafd14f > button"
  );
}
