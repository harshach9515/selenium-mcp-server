import { WebDriver } from "selenium-webdriver";

let activeDriver: WebDriver | null = null;

export function setDriver(driver: WebDriver) {
  activeDriver = driver;
}

export function getActiveDriver(): WebDriver {
  if (!activeDriver) {
    throw new Error("No active browser session. Please open a browser first.");
  }
  return activeDriver;
}

export function clearDriver() {
  activeDriver = null;
}
