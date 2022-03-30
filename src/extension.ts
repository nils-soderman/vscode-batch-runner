import * as vscode from 'vscode';

import * as execute from './execute';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('batch-utils.execBatchFile', (data) => {
			let filepath: string | undefined;

			if (data) {
				// Filepath provided by as an argument (when e.g. running it from the context menu)
				filepath = data["path"];
				if (filepath && filepath.startsWith("/")) {
					filepath = filepath.replace("/", "");
				}
			}
			else {
				// No filepath provided as an argument, get the currently active file instead (e.g. when using the Hotkey)
				filepath = vscode.window.activeTextEditor?.document.uri.fsPath;
			}

			if (filepath) {
				execute.runBatchFile(filepath);
			}
		})
	);
}

export function deactivate() { }
