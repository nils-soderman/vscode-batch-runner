import * as vscode from 'vscode';

import * as execute from './execute';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.runCurrentFile', () => {
			const currentFilepath = vscode.window.activeTextEditor?.document.uri.fsPath;
			if (currentFilepath) {
				execute.runBatFile(currentFilepath);
			}
		})
	);
}

export function deactivate() { }
