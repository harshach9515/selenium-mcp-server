import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { createDriver } from "../selenium/driver.js";
import { getActiveDriver } from "../selenium/driverManager.js";
import { getLocator } from "../selenium/locator.js";
import { Select } from 'selenium-webdriver/lib/select';
import { until } from "selenium-webdriver";


const startBrowserOutputSchema = z.object({
    success: z.boolean(),
    browser: z.string(),
    message: z.string(),
});

const server = new McpServer({
    name: "mcp-selenium-server",
    version: "1.0.0",
});

// Register the "open_browser" tool
server.registerTool(
    "open_browser",
    {
        title: "Open Browser",
        description: "Open a web browser session using Selenium WebDriver. ",
        inputSchema: z.object({
            browser: z.enum(["chrome", "firefox", "edge"]).default("chrome"),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            browser: z.enum(["chrome", "firefox", "edge"]),
            message: z.string(),
        }),
    },
    async ({ browser }) => {
        try {
            await createDriver(browser);

            return {
                // 👇 REQUIRED for MCP transport
                content: [
                    {
                        type: "text",
                        text: `Browser '${browser}' started successfully`
                    }
                ],
                structuredContent: {
                    // 👇 REQUIRED for outputSchema 
                    success: true,
                    browser,
                    message: `Browser '${browser}' started successfully`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to start browser: ${error.message}`
                    }
                ],

                success: false,
                browser,
                message: error.message,
            };
        }
    }
);

// Register the "navigate_to_url" tool
server.registerTool(
    "navigate_to_url",
    {
        title: "Navigate to URL",
        description: "Navigate the browser to a specified URL.",
        inputSchema: z.object({
            url: z.string().url(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            url: z.string().url(),
            message: z.string(),
        }),
    },
    async ({ url }) => {
        try {
            const driver = await getActiveDriver();
            await driver.get(url);

            return {
                content: [
                    {
                        type: "text",
                        text: `Navigated to URL: ${url}`
                    }
                ],
                structuredContent: {
                    success: true,
                    url,
                    message: `Navigated to URL: ${url}`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Failed to navigate to URL: ${error.message}`
                    }
                ],
                success: false,
                url,
                message: error.message,
            };
        }
    }
)

// Register the "find_element" tool
server.registerTool(
    "find_element",
    {
        title: "Find Element",
        description: "Find an element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value }) => {
        try {
            const driver = await getActiveDriver();

            const locator = getLocator(by, value);
            await driver.wait(until.elementLocated(locator), 10000);
            return {
                content: [
                    { type: "text", text: `Element found using ${by}: ${value}` }
                ],
                structuredContent: {
                    success: true,
                    message: `Element found using ${by}: ${value}`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to find element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "click_element" tool
server.registerTool(
    "click_element",
    {
        title: "Click Element",
        description: "Click an element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            await element.click();
            return {
                content: [
                    { type: "text", text: `Element clicked using ${by}: ${value}` }
                ],
                structuredContent: {
                    success: true,
                    message: `Element clicked using ${by}: ${value}`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to click element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "send_keys" tool
server.registerTool(
    "send_keys",
    {
        title: "Send Keys to Element",
        description: "Send keys to an element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
            keys: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value, keys }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            await element.sendKeys(keys);
            return {
                content: [
                    { type: "text", text: `Sent keys to element using ${by}: ${value}` }
                ],
                structuredContent: {
                    success: true,
                    message: `Sent keys to element using ${by}: ${value}`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to send keys to element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "close_browser" tool
server.registerTool(
    "close_browser",
    {
        title: "Close Browser",
        description: "Close the current web browser session.",
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async () => {
        try {
            const driver = await getActiveDriver();
            await driver.quit();
            return {
                content: [
                    { type: "text", text: "Browser closed successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "Browser closed successfully."
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to close browser: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message
                }
            };
        }
    }
);

// Register the "verify_page_title" tool
server.registerTool(
    "verify_page_title",
    {
        title: "Verify Page Title",
        description: "Verify the title of the current page.",
        inputSchema: z.object({
            expectedTitle: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            actualTitle: z.string(),
            message: z.string(),
        }),
    },
    async ({ expectedTitle }) => {
        try {
            const driver = await getActiveDriver();
            const actualTitle = await driver.getTitle();
            const success = actualTitle === expectedTitle;

            return {
                content: [
                    { type: "text", text: `Page title is '${actualTitle}'. Expected was '${expectedTitle}'.` }
                ],
                structuredContent: {
                    success,
                    actualTitle,
                    message: success ? "Page title matches expected title." : "Page title does not match expected title.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to verify page title: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    actualTitle: "",
                    message: error.message,
                },
            };
        }
    }

);

// Register the "select_dropdown_option" tool
server.registerTool(
    "select_dropdown_option",
    {
        title: "Select Dropdown Option",
        description: "Select an option from a dropdown element using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
            optionText: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value, optionText }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            const select = new Select(element);
            await select.selectByVisibleText(optionText);
            return {
                content: [
                    { type: "text", text: `Selected option '${optionText}' from dropdown using ${by}: ${value}` }
                ],
                structuredContent: {
                    success: true,
                    message: `Selected option '${optionText}' from dropdown using ${by}: ${value}`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to select dropdown option: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "take_screenshot" tool
server.registerTool(
    "take_screenshot",
    {
        title: "Take Screenshot",
        description: "Take a screenshot of the current page.",
        outputSchema: z.object({
            success: z.boolean(),
            screenshot: z.string().optional(),
            message: z.string(),
        }),
    },
    async () => {
        try {
            const driver = await getActiveDriver();
            const screenshot = await driver.takeScreenshot();
            return {
                content: [
                    { type: "text", text: "Screenshot taken successfully." }
                ],
                structuredContent: {
                    success: true,
                    screenshot,
                    message: "Screenshot taken successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to take screenshot: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "get_element_text" tool
server.registerTool(
    "get_element_text",
    {
        title: "Get Element Text",
        description: "Get the text of an element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            text: z.string().optional(),
            message: z.string(),
        }),
    },
    async ({ by, value }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            const text = await element.getText();
            return {
                content: [
                    { type: "text", text: `Element text: ${text}` }
                ],
                structuredContent: {
                    success: true,
                    text,
                    message: `Element text: ${text}`,
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to get element text: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    text: "",
                    message: error.message,
                }
            };
        }
    }
);

// Register the "verify_element_text" tool
server.registerTool(
    "verify_element_text",
    {
        title: "Verify Element Text",
        description: "Verify the text of an element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
            expectedText: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            actualText: z.string().optional(),
            message: z.string(),
        }),
    },
    async ({ by, value, expectedText }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            const actualText = await element.getText();
            const success = actualText === expectedText;
            return {
                content: [
                    { type: "text", text: success ? "Element text matches expected text." : "Element text does not match expected text." }
                ],
                structuredContent: {
                    success,
                    actualText,
                    message: success ? "Element text matches expected text." : "Element text does not match expected text.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to verify element text: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    actualText: "",
                    message: error.message,
                }
            };
        }
    }
);

// Register the "mouse_hover" tool
server.registerTool(
    "mouse_hover",
    {
        title: "Mouse Hover",
        description: "Hover the mouse over an element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            const actions = driver.actions({ bridge: true });
            await actions.move({ origin: element }).perform();
            return {
                content: [
                    { type: "text", text: "Mouse hovered over element successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "Mouse hovered over element successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to hover mouse over element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "drag_and_drop" tool
server.registerTool(
    "drag_and_drop",
    {
        title: "Drag and Drop",
        description: "Drag an element from a source to a target on the current page using specified locator strategies.",
        inputSchema: z.object({
            sourceBy: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            sourceValue: z.string(),
            targetBy: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            targetValue: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ sourceBy, sourceValue, targetBy, targetValue }) => {
        try {
            const driver = await getActiveDriver();
            const sourceLocator = getLocator(sourceBy, sourceValue);
            const targetLocator = getLocator(targetBy, targetValue);
            const sourceElement = await driver.wait(until.elementLocated(sourceLocator), 10000);
            const targetElement = await driver.wait(until.elementLocated(targetLocator), 10000);
            const actions = driver.actions({ bridge: true });
            await actions.dragAndDrop(sourceElement, targetElement).perform();
            return {
                content: [
                    { type: "text", text: "Element dragged and dropped successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "Element dragged and dropped successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to drag and drop element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "press_key" tool
server.registerTool(
    "press_key",
    {
        title: "Press Key",
        description: "Press a key on the keyboard.",
        inputSchema: z.object({
            key: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ key }) => {
        try {
            const driver = await getActiveDriver();
            const actions = driver.actions({ bridge: true });
            await actions.keyDown(key).keyUp(key).perform();
            return {
                content: [
                    { type: "text", text: "Key pressed successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "Key pressed successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to press key: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "double_click" tool
server.registerTool(
    "double_click",
    {
        title: "Double Click Element",
        description: "Perform a double-click on an element using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            const actions = driver.actions({ bridge: true });
            await actions.doubleClick(element).perform();
            return {
                content: [
                    { type: "text", text: "Element double-clicked successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "Element double-clicked successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to double-click element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "upload_file" tool
server.registerTool(
    "upload_file",
    {
        title: "Upload File",
        description: "Upload a file to an input element on the current page using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
            filePath: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value, filePath }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            await element.sendKeys(filePath);
            return {
                content: [
                    { type: "text", text: "File uploaded successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "File uploaded successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to upload file: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Register the "right_click" tool
server.registerTool(
    "right_click",
    {
        title: "Right Click Element",
        description: "Perform a right-click (context click) on an element using a specified locator strategy.",
        inputSchema: z.object({
            by: z.enum(["id", "css", "xpath", "name", "tag", "class"]),
            value: z.string(),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        }),
    },
    async ({ by, value }) => {
        try {
            const driver = await getActiveDriver();
            const locator = getLocator(by, value);
            const element = await driver.wait(until.elementLocated(locator), 10000);
            const actions = driver.actions({ bridge: true });
            await actions.contextClick(element).perform();
            return {
                content: [
                    { type: "text", text: "Element right-clicked successfully." }
                ],
                structuredContent: {
                    success: true,
                    message: "Element right-clicked successfully.",
                }
            };
        } catch (error: any) {
            return {
                content: [
                    { type: "text", text: `Failed to right-click element: ${error.message}` }
                ],
                structuredContent: {
                    success: false,
                    message: error.message,
                }
            };
        }
    }
);

// Cleanup function to close the browser on exit
async function cleanupOnExit() {
    try {
        const driver = await getActiveDriver();
        await driver.quit();
        console.log("Browser closed successfully on exit.");
    } catch (error) {
        console.error("No active browser to close on exit.");
    }
}

process.on("exit", cleanupOnExit);
process.on("SIGINT", cleanupOnExit);
process.on("SIGTERM", cleanupOnExit);

const transport = new StdioServerTransport();
await server.connect(transport);
