import * as vscode from 'vscode';
import * as ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {
  // Register the command to open the chat view
  let disposable = vscode.commands.registerCommand('deepseek-chat.startChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'customChatView', // View type
      'Deepseek Chat',    // Title
      vscode.ViewColumn.One, // Show in the first column
      {
		enableScripts: true, // Enable JavaScript execution in the webview
	  }                // Webview options
    );

    // Set the HTML content for the webview
    panel.webview.html = getWebviewContent();

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'sendQuery') {
        const query = message.query;
        const response = await callApi(query, panel); // Call your API here
      }
    });
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
  return /*inline-html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Deepseek Chat</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        #chat-container { height: 80vh; overflow-y: auto; border: 1px solid #ccc; padding: 10px; }
        #input-container { 
          position: fixed; 
          bottom: 0;
          width: 100%; 
          background: white; 
          padding: 10px; 
          box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); 
          display: flex;
          align-items: center;
          }
        #query-input { width: calc(100% - 80px); padding: 10px; }
        #send-button { padding: 10px 20px; }
      </style>
    </head>
    <body>
      <div id="chat-container"></div>
      <div id="input-container">
        <input type="text" id="query-input" placeholder="Type your query here..." />
        <button id="send-button">Send</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('send-button').addEventListener('click', () => {
          const query = document.getElementById('query-input').value;
          if (query.trim()) {
            vscode.postMessage({ command: 'sendQuery', query });
            document.getElementById('query-input').value = '';
          }
        });

        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message.command === 'displayResponse') {
            const chatContainer = document.getElementById('chat-container');

            // Get or create the last response div
            let lastResponseDiv = chatContainer.lastElementChild;
            if (!lastResponseDiv || !lastResponseDiv.classList.contains('response')) {
              lastResponseDiv = document.createElement('pre'); // Use <pre> for formatting
              lastResponseDiv.classList.add('response');
              chatContainer.appendChild(lastResponseDiv);
            }

            // Append the new chunk to the last response div
            lastResponseDiv.textContent += message.response;

            // Scroll to the bottom of the chat container
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
        });
      </script>
    </body>
    </html>
  `;
}

async function callApi(query: string, panel: vscode.WebviewPanel): Promise<void> {
  try {
    console.log("Calling Ollama API with query:", query);

    // Call the deepseek-r1:1.5b model using the ollama package
    const response = await ollama.default.chat({
      model: 'deepseek-r1:1.5b', // Specify the model name
      messages: [{ role: 'user', content: query }], // Input message
      stream: true
    });

    let fullResponse = '';

    // Handle the streamed response
    for await (const chunk of response) {
      const responseChunk = chunk.message?.content || '';
      fullResponse += responseChunk;

      // Send each chunk to the webview
      panel.webview.postMessage({ command: 'displayResponse', response: responseChunk });
    }
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    panel.webview.postMessage({ command: 'displayResponse', response: 'Error: Something went wrong with deepseek :(' });
  }
}