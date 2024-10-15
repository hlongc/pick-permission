// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

function getWebviewContent(
  panel: vscode.WebviewPanel,
  context: vscode.ExtensionContext
): string {
  const files = fs.readdirSync(path.resolve(__dirname, "../media/assets"));

  let cssUri: vscode.Uri | undefined = undefined;
  let scriptUri: vscode.Uri | undefined = undefined;

  // 获取静态资源的路径（如 CSS 和 JS）
  files.forEach((filePath) => {
    if (filePath.startsWith("index")) {
      if (filePath.endsWith(".js") && !scriptUri) {
        scriptUri = panel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(context.extensionPath, "media", "assets", filePath)
          )
        );
      }

      if (filePath.endsWith(".css") && !cssUri) {
        cssUri = panel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(context.extensionPath, "media", "assets", filePath)
          )
        );
      }
    }
  });

  // 设置内容安全策略（CSP）
  const nonce = getNonce();

  return `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<title>pick-permission</title>
						<link href="${cssUri}" rel="stylesheet" crossorigin />
					</head>
					<body>
						<div id="root"></div>
						<script type="module" crossorigin src="${scriptUri}" nonce="${nonce}"></script>
					</body>
					</html>`;
}

// 生成一个随机的 nonce 值，用于 CSP
function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "pick-permission" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "pick-permission.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("请选择权限点吧");
    }
  );

  const folderPick = vscode.commands.registerCommand("folder.pick", () => {
    vscode.window.showInformationMessage("注册了一个新命令");
  });

  const pick = vscode.commands.registerCommand("permission.pick", () => {
    const panel = vscode.window.createWebviewPanel(
      "htmlTab", // 内部标识
      "HTML 页面", // 页签标题
      vscode.ViewColumn.One, // 显示在第一个标签页中
      {
        enableScripts: true, // 允许运行脚本
        // 限制 Webview 可访问的本地资源
        localResourceRoots: [
          vscode.Uri.file(path.resolve(context.extensionPath, "media")),
        ],
      }
    );

    // HTML 内容
    panel.webview.html = getWebviewContent(panel, context);
    panel.webview.onDidReceiveMessage(
      (message) => {
        vscode.window.showInformationMessage(
          `收到来自webview的消息：${message.command}`
        );
        panel.webview.postMessage({ command: "插件进程收到消息" });
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(pick);
  context.subscriptions.push(disposable);
  context.subscriptions.push(folderPick);
}

// This method is called when your extension is deactivated
export function deactivate() {}
