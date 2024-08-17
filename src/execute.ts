import * as vscode from 'vscode';

import * as childProcess from 'child_process';
import * as path from 'path';

import * as utils from './utils';


const TERMINAL_NAME = "Batch Runner Terminal";


/**
 * Get the 'Batch Runner' terminal used by this extension
 * @param bEnsureExists If terminal doesn't exist, create it
 * @param bRefresh If terminal exists, dispose and create a new one
 * @returns The terminal if one could be found/created
 */
export async function getBatchRunnerTerminal(bEnsureExists = true, bRefresh = true): Promise<vscode.Terminal | undefined> {
    const createTerminal = async () => {
        const cmdPath = await utils.getCmdPath();
        if (!cmdPath) {
            return undefined;
        }

        return vscode.window.createTerminal(TERMINAL_NAME, cmdPath);
    };

    for (const terminal of vscode.window.terminals) {
        if (terminal.name === TERMINAL_NAME) {
            if (bRefresh) {
                terminal.dispose();
                return createTerminal();
            }

            return terminal;
        }
    }

    if (bEnsureExists) {
        return createTerminal();
    }
}


/**
 * Run a batch file in the VSCode terminal
 * @param file Absolute filepath to the .bat file
 * @returns true if the batch file was executed
 */
async function runBatchFileInTerminal(file: vscode.Uri, args: string[] = []): Promise<boolean> {
    const terminal = await getBatchRunnerTerminal();
    if (!terminal)
        return false;

    const filepath = file.fsPath;
    const workingDirectory = path.dirname(filepath);

    const command = `cls & cd /d "${workingDirectory}" & "${filepath}" ${args.join(" ")}`;
    terminal.sendText(command, true);
    terminal.show();

    return true;
}


/**
 * Open a batch file in cmd
 * @param file Absolute filepath to the batch file
 * @param bAdmin Run the batch file with admin privileges
 */
async function runBatchFileInCmd(file: vscode.Uri, args: string[] = [], bAdmin = false): Promise<boolean> {
    const cmdPath = await utils.getCmdPath();
    if (!cmdPath)
        return false;

    const filePath = file.fsPath;
    const workingDirectory = path.dirname(filePath);

    // "Start" command arguments: Title, [/d WorkingDirectory], Command, Parameters    
    let command = `start "${filePath}" /d "${workingDirectory}" "${cmdPath}" /c ""${filePath}" ${args.join(" ")}"`;
    if (bAdmin) {
        // To launch the batch as admin, start a new cmd process as admin by using powershell Start-Process with the runAs argument
        command = `powershell Start-Process "${cmdPath}" -verb runAs -ArgumentList /c, title, """${filePath}""", """&""", cd, /d, """${workingDirectory}""", """&""", """${filePath}"""`;
        if (args.length > 0) {
            // TODO: Arguments using quotes (e.g. "key=value") will lose the quotes when running as admin
            command += `, """${args.join(" ")}"""`;
        }

    }

    childProcess.exec(command);

    return true;
}


/**
 * Main function to be called from the extension.ts
 * This will run the batch file taking into consideration the user's settings etc.
 * @param filepath The absolute filepath to the batch file
 * @param bAdmin Run the batch file with admin privileges 
 * @returns true if the batch file could be exectued, otherwise false
 */
export async function runBatchFile(filepath: vscode.Uri, args: string[] = [], bAdmin = false): Promise<boolean> {
    const config = utils.getExtensionConfig(filepath);

    // Check if we should save the file before running it
    if (config.get<boolean>("saveFileBeforeRun")) {
        const activeDocument = vscode.window.activeTextEditor?.document;
        if (
            activeDocument &&
            activeDocument.isDirty &&
            utils.compareUri(filepath, activeDocument.uri)
        ) {
            if (!await activeDocument.save())
                return false;
        }
    }

    // If we want to run the batch file as admin, but VS Code is not running as admin,
    // we need to spawn a new CMD window with admin privileges.
    const bForceNewCmd = bAdmin && !utils.isRunningAsAdmin();
    const runBatchIn = config.get<string>("runBatchIn");

    if (bForceNewCmd || runBatchIn === "External-cmd")
        return runBatchFileInCmd(filepath, args, bAdmin);
    else
        return runBatchFileInTerminal(filepath, args);
}