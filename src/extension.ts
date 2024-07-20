import * as vscode from 'vscode';

import * as execute from './execute';
import * as batchArgs from './arguments';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFile', (uri?: vscode.Uri) => {
			const filepath = uri || vscode.window.activeTextEditor?.document.uri;

			if (filepath) {
				execute.runBatchFile(filepath, [], false);
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFileArgs', async (uri?: vscode.Uri) => {
			const filepath = uri || vscode.window.activeTextEditor?.document.uri;

			if (filepath) {
				const argsToPass = await batchArgs.askForArguments(filepath);
				if (argsToPass !== undefined) {
					execute.runBatchFile(filepath, argsToPass, false);
				}
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFileAdmin', (uri?: vscode.Uri) => {
			const filepath = uri || vscode.window.activeTextEditor?.document.uri;

			if (filepath) {
				execute.runBatchFile(filepath, [], true);
			}
		})
	);
}


export function deactivate() { }