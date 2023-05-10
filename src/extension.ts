import * as vscode from 'vscode';

import * as execute from './execute';
import * as batchArgs from './arguments';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFile', (args) => {
			let filepath = getFilepath(args);

			if (filepath) {
				execute.runBatchFile(filepath, [], false);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFileArgs', async (args) => {
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
			let filepath = getFilepath(args);

			if (filepath) {
				execute.runBatchFile(filepath, [], true);
			}
		})
	);
}


export function deactivate() { }


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