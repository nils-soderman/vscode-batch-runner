import * as vscode from 'vscode';

import * as child_process from 'child_process';
import * as path from 'path';

import * as utils from './utils';


const TERMINAL_NAME = "Batch Runner Terminal";


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
        const cmdPath = utils.getCmdPath();
        return vscode.window.createTerminal(TERMINAL_NAME, cmdPath);
    }
}


/**
 * Run a batch file in the VSCode terminal
 * @param filepath Absolute filepath to the .bat file
 * @returns true if the batch file was executed
 */
function runBatchFileInTerminal(filepath: string, args: string[] = []) {
    const terminal = getBatchRunnerTerminal();
    if (!terminal) {
        return false;
    }

    const directory = path.dirname(filepath);

    // Start with an extra empty command `cd`, incase the previous exec stopped with a pause
    const command = `cd & cls & cd "${directory}" & "${filepath}" ${args.join(" ")}`;
    terminal.sendText(command, true);
    terminal.show();

    return true;
}


/**
 * Open a batch file in cmd
 * @param filepath Absolute filepath to the batch file
 * @param bAdmin Run the batch file with admin privileges
 */
function runBatchFileInCmd(filepath: string, args: string[] = [], bAdmin = false) {
    const cmdPath = utils.getCmdPath();
    if (!cmdPath) {
        return false;
    }

    const directory = path.dirname(filepath);

    // "Start" command arguments: Title, [/d WorkingDirectory], Command, Parameters    
    let command = `start "${filepath}" /d "${directory}" "${cmdPath}" /c ""${filepath}" ${args.join(" ")}"`;
    if (bAdmin) {
        // To launch the batch as admin, start a new cmd process as admin by using powershell Start-Process with the runAs argument

        // TODO: Arguments using quotes (e.g. "key=value") will lose the quotes when running as admin
        command = `powershell Start-Process "${cmdPath}" -verb runAs -ArgumentList /c, title, """${filepath}""", """&""", cd, /d, """${directory}""", """&""", """${filepath}""", """${args.join(" ")}"""`;
    }

    child_process.exec(command);

    return true;
}


/**
 * Main function to be called from the extension.ts
 * This will run the batch file taking into consideration the user's settings etc.
 * @param filepath The absolute filepath to the batch file
 * @param bAdmin Run the batch file with admin privileges 
 * @returns true if the batch file could be exectued, otherwise false
 */
export function runBatchFile(filepath: string, args: string[] = [], bAdmin = false) {
    // Check where we should run the batch file
    const config = utils.getExtensionConfig(filepath);
    let runBatchIn: string | undefined = config.get("runBatchIn");

    // TODO: Remove this in the future.
    const oldCmdPathConfig: string | undefined = utils.getExtensionConfig(undefined, true).get("runBatchIn");
    if (oldCmdPathConfig) {
        runBatchIn = oldCmdPathConfig;
    }

    // If we want to run the batch file as admin, but VS Code is not running as admin,
    // we need to spawn a new CMD window with admin privileges.
    const bForceNewCmd = bAdmin && !utils.isRunningAsAdmin();

    // TODO: Should do an explicit check in the future. 
    // In version 0.0.4 'External-cmd' was named 'cmd', therefore doing an "includes" check for now 
    // to avoid breaking it for people updating.
    // if (runBatchIn?.toLowerCase() === "External-cmd") {
    if (runBatchIn?.toLowerCase().includes("cmd") || bForceNewCmd) {
        return runBatchFileInCmd(filepath, args, bAdmin);
    }
    else {
        return runBatchFileInTerminal(filepath, args);
    }
}