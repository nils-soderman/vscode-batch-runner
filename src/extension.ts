import * as vscode from 'vscode';

import * as execute from './execute';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFile', (data) => {
			let filepath: string | undefined;

			if (data) {
				filepath = data["path"];
				if (filepath && filepath.startsWith("/")) {
					filepath = filepath.replace("/", "");
				}
			}
			else {
				filepath = vscode.window.activeTextEditor?.document.uri.fsPath;
			}

			if (filepath) {
				execute.runBatFile(filepath);
			}
		})
	);
}

export function deactivate() { }
