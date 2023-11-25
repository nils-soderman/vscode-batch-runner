import * as vscode from 'vscode';

import * as execute from './execute';
import * as batchArgs from './arguments';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFile', (args) => {
			let filepath = getFilepath(args);

			if (filepath) {
				execute.runBatchFile(filepath, [], false);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFileArgs', async (args) => {
			let filepath = getFilepath(args);

			if (filepath) {
				const argsToPass = await batchArgs.askForArguments(filepath);
				if (argsToPass !== undefined) {
					execute.runBatchFile(filepath, argsToPass, false);
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFileAdmin', (args) => {
			let filepath = getFilepath(args);

			if (filepath) {
				execute.runBatchFile(filepath, [], true);
			}
		})
	);


	// Deprecated commands
	// TODO: Remove these in a future release

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFile', (args) => {
			showDeprecationMessage("execBatchFile");

			let filepath = getFilepath(args);

			if (filepath) {
				execute.runBatchFile(filepath, [], false);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFileArgs', async (args) => {
			showDeprecationMessage("execBatchFileArgs");

			let filepath = getFilepath(args);

			if (filepath) {
				const argsToPass = await batchArgs.askForArguments(filepath);
				if (argsToPass !== undefined) {
					execute.runBatchFile(filepath, argsToPass, false);
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFileAsAdmin', (args) => {
			showDeprecationMessage("execBatchFileAsAdmin", "execBatchFileAdmin");

			let filepath = getFilepath(args);

			if (filepath) {
				execute.runBatchFile(filepath, [], true);
			}
		})
	);
}


export function deactivate() { }


var gDeprecatedMessagesShown: string[] = [];
function showDeprecationMessage(command: string, newCommand?: string) {
	// Only show the message once per command/session
	if (gDeprecatedMessagesShown.includes(command)) {
		return;
	}
	gDeprecatedMessagesShown.push(command);

	if (!newCommand)
		newCommand = command;

	vscode.window.showWarningMessage(
		`The command 'batch-utils.${command}' is deprecated, please use 'batch-runner.${newCommand}' instead.`,
		"Open Shortcuts"
	).then((value) => {
		if (value === "Open Shortcuts") {
			vscode.commands.executeCommand("workbench.action.openGlobalKeybindings", newCommand);
		}
	});
};


function getFilepath(args: any) {
	if (args) {
		// Filepath provided by as an argument (when e.g. running it from the context menu)
		let filepath: string = args["path"];
		if (filepath && filepath.startsWith("/")) {
			filepath = filepath.replace("/", "");
		}
		return filepath;
	}

	// No filepath provided as an argument, get the currently active file instead (e.g. when using the Hotkey)
	return vscode.window.activeTextEditor?.document.uri.fsPath;
}