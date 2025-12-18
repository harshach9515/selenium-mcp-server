import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { setDriver } from "./driverManager.js";

export type BrowserType = "chrome" | "firefox" | "edge";

export async function createDriver(browser: BrowserType): Promise<WebDriver> {
    let driver: WebDriver;
    try {
        switch (browser) {
            case "chrome": {
                const options = new chrome.Options();
                options.addArguments("--start-maximized");

                driver = await new Builder()
                    .forBrowser("chrome")
                    .setChromeOptions(options)
                    .build();
                break;
            }

            case "firefox":
                driver = await new Builder().forBrowser("firefox").build();
                break;

            case "edge":
                driver = await new Builder().forBrowser("MicrosoftEdge").build();
                break;

            default:
                throw new Error(`Unsupported browser: ${browser}`);
        }

        setDriver(driver); // 👈 store globally
        return driver;
    } catch (error) {
        console.error("Error creating WebDriver:", error);
        throw error;
    }
}


