# Deepseek-Chat

Deepseek-Chat is a Visual Studio Code extension that provides a simple AI chat interface within the IDE. This extension allows users to interact with the deepseek-r1:1.5b model using the Ollama API.

## Features

- Open a custom chat view within VS Code.
- Send queries to the deepseek-r1:1.5b model.
- Display responses from the model in real-time.

## Requirements

- Visual Studio Code version 1.96.0 or higher.
- Node.js and Yarn installed on your machine.

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd deepseek-chat
    ```
3. Install the dependencies:
    ```sh
    yarn install
    ```

## Usage

1. Open the project in Visual Studio Code.
2. Press `F5` to open a new window with your extension loaded.
3. Run the command `Deepseek Chat` from the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
4. Type your query in the input box and click the "Send" button to interact with the AI model.

## Development

### Compile the Extension

To compile the extension, run:
```sh
yarn run compile
```