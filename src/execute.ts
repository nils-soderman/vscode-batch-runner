import * as vscode from 'vscode';

import * as child_process from 'child_process';
import * as fs from 'fs';


const TERMINAL_NAME = "Batch Runner";
const EXTENSION_CONFIG_NAME = "batchrunner";
const CMD_PATH_CONFIG_KEY = "cmdPath";


/**
 * @returns The workspace configuration for this extension _('batchrunner')_
 */
export function getExtensionConfig() {
    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_NAME);
}


/**
 * Get the absolute path to 'cmd.exe'  
 * Returns undefined if the file could not be located
 */
function getCmdPath() {
    let cmdPath: string | undefined = getExtensionConfig().get(CMD_PATH_CONFIG_KEY);
    if (!cmdPath) {
        // Fallback to this default path
        cmdPath = "C:\\windows\\System32\\cmd.exe";
    }

    // Make sure the path points towards an existing file, otherwise show an error message
    if (!fs.existsSync(cmdPath)) {
        const browseButtonText = "Update path";
        vscode.window.showErrorMessage(`Cmd.exe could not be located at ${cmdPath}`, browseButtonText).then(clickedItem => {
            if (clickedItem === browseButtonText) {
                // Open user settings and search for the cmdPath setting
                const searchPath = `${EXTENSION_CONFIG_NAME}.${CMD_PATH_CONFIG_KEY}`;
                vscode.commands.executeCommand('workbench.action.openSettings', searchPath);
            }
        });

        return undefined;
    }

    return cmdPath;
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

    const cmdPath = getCmdPath();
    if (!cmdPath) {
        return false;
    }

    terminal.sendText(`${cmdPath} /c "${filepath}"`, true);
    terminal.show();

    return true;
}


/**
 * Open a batch file in cmd
 * @param filepath Absolute filepath to the batch file
 */
function runBatchFileInCmd(filepath: string) {
    const cmdPath = getCmdPath();
    if (!cmdPath) {
        return false;
    }

    const command = `start ${cmdPath} /c "${filepath}"`;
    child_process.exec(command);

    return true;
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
    
    // TODO: Should do an explicit check in the future. 
    // In version 0.0.4 'External-cmd' was named 'cmd', therefore doing an "includes" check for now 
    // to avoid breaking it for people updating.
    // if (runBatchIn?.toLowerCase() === "External-cmd") {
    if (runBatchIn?.toLowerCase().includes("cmd")) {
        return runBatchFileInCmd(filepath);
    }
    else {
        return runBatchFileInTerminal(filepath);
    }
}