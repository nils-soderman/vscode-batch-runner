import * as vscode from 'vscode';

import * as path from 'path';
import * as child_process from 'child_process';


const TERMINAL_NAME = "Batch Runner";


/**
 * @returns The workspace configuration for this extension _('batchrunner')_
 */
export function getExtensionConfig() {
    return vscode.workspace.getConfiguration("batchrunner");
}


/**
 * Get the 'Batch Runner' terminal used by this extension
 * @param bEnsureExists If terminal doesn't exist, create it
 * @returns The terminal if one could be found/created
 */
function getBatchRunnerTerminal(bEnsureExists = true) {
    for (const terminal of vscode.window.terminals) {
        if (terminal.name === TERMINAL_NAME) {
            return terminal;
        }
    }

    if (bEnsureExists) {
        return vscode.window.createTerminal(TERMINAL_NAME);
    }
}


/**
 * Run a batch file in the VSCode terminal
 * @param filepath Absolute filepath to the .bat file
 * @returns true if the batch file was executed
 */
function runBatchFileInTerminal(filepath: string) {
    const terminal = getBatchRunnerTerminal();
    if (!terminal) {
        return false;
    }

    terminal.sendText(`cmd /c "${filepath}"`, true);
    terminal.show();

    return true;
}

/**
 * Open a batch file in cmd
 * @param filepath Absolute filepath to the batch file
 */
function runBatchFileInCmd(filepath: string) {
    const command = `start cmd /c "${filepath}"`;
    child_process.exec(command);
}


/**
 * Main function to be called from the extension.ts
 * This will run the batch file taking into consideration the user's settings etc.
 * @param filepath The absolute filepath to the batch file
 * @returns true if the batch file could be exectued, otherwise false
 */
export function runBatchFile(filepath: string) {
    // Check where we should run the batch file
    const config = getExtensionConfig();
    const runBatchIn: string | undefined = config.get("runBatchIn");
    if (runBatchIn?.toLowerCase() === "cmd") {
        return runBatchFileInCmd(filepath);
    }
    else {
        return runBatchFileInTerminal(filepath);
    }
}