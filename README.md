# MCP-Selenium Framework

## Overview

MCP-Selenium is a modular Node.js framework designed to provide a robust interface for browser automation using Selenium WebDriver. It is structured to support scalable, maintainable, and extensible automation solutions, with a focus on Model Context Protocol (MCP) integration.

## Features
- **Selenium WebDriver Integration**: Easily manage browser drivers and sessions.
- **Modular Architecture**: Organized into logical modules for clarity and extensibility.
- **MCP Server**: Exposes automation capabilities via a server interface.
- **Custom Locators**: Define and use custom element locators.

## Project Structure

```
project-root/
│   package.json
│   README.md
└───src/
    └───mcp/
    │     server.ts         # Main server entry point (MCP interface)
    └───selenium/
          driver.ts         # Selenium WebDriver wrapper/logic
          driverManager.ts  # Driver management utilities
          locator.ts        # Locator strategies and helpers
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)
- Chrome, Firefox, or Edge browser installed (for WebDriver)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd mcp-selenium
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running the MCP Server
Start the server with:
```sh
node ./src/mcp/server.ts
```

### Project Modules
- **src/mcp/server.ts**: Entry point for the MCP server. Handles incoming requests and coordinates Selenium actions.
- **src/selenium/driver.ts**: Contains logic for initializing and controlling Selenium WebDriver instances.
- **src/selenium/driverManager.ts**: Manages driver lifecycle, including creation, reuse, and cleanup.
- **src/selenium/locator.ts**: Provides utilities for defining and using element locators.

## Usage Example

Below is a basic example of how to use the framework programmatically:

```js
const { DriverManager } = require('./src/selenium/driverManager');
const { By } = require('selenium-webdriver');

(async () => {
  const driver = await DriverManager.getDriver('chrome');
  await driver.get('https://example.com');
  const element = await driver.findElement(By.css('h1'));
  console.log(await element.getText());
  await driver.quit();
})();
```

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please open an issue in the repository.
