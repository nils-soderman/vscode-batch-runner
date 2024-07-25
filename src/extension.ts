import * as vscode from 'vscode';

import * as execute from './execute';
import * as batchArgs from './arguments';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFile', (uri?: vscode.Uri): Promise<boolean> => {
			const filepath = uri || vscode.window.activeTextEditor?.document.uri;
			if (!filepath)
				throw new Error('No file path provided');

			return execute.runBatchFile(filepath, [], false);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFileArgs', async (uri?: vscode.Uri): Promise<boolean> => {
			const filepath = uri || vscode.window.activeTextEditor?.document.uri;
			if (!filepath)
				throw new Error('No file path provided');

			const argsToPass = await batchArgs.askForArguments(filepath);
			if (argsToPass !== undefined) {
				return execute.runBatchFile(filepath, argsToPass, false);
			}

			return false;
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-runner.execBatchFileAdmin', (uri?: vscode.Uri): Promise<boolean> => {
			const filepath = uri || vscode.window.activeTextEditor?.document.uri;
			if (!filepath)
				throw new Error('No file path provided');

			return execute.runBatchFile(filepath, [], true);
		})
	);
}


export function deactivate() { }