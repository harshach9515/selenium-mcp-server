import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { createDriver } from "../selenium/driver.js";
import { getActiveDriver } from "../selenium/driverManager.js";
import { getLocator } from "../selenium/locator.js";


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
            await driver.findElement(locator);

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
            const element = await driver.findElement(locator);
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

const transport = new StdioServerTransport();
await server.connect(transport);
