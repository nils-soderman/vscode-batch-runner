import * as vscode from 'vscode';

import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';


const DATA_FOLDER_NAME = "VSCode-Batch-Runner";

const EXTENSION_CONFIG_NAME = "batchrunner";
const CMD_PATH_CONFIG_KEY = "cmdPath";


/**
 * @param filepath If provided it'll use the file's workspace folder as scope, otherwise it'll try to get the current active filepath.
 * @returns The workspace configuration for this extension _('batchrunner')_
 */
export function getExtensionConfig(filepath?: string) {
    // Try to get the active workspace folder first, to have it read Folder Settings
    let workspaceFolder;
    if (filepath) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filepath));
    }
    else if (vscode.window.activeTextEditor) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
    }

    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_NAME, workspaceFolder);
}

/**
 * Check if user is running VS Code as admin
 */
export function isRunningAsAdmin() {
    try {
        child_process.execFileSync("net", ["session"], { "stdio": "ignore" });
        return true;
    }
    catch (e) {
        return false;
    }
}

/**
 * Get the absolute path to 'cmd.exe'  
 * Returns undefined if the file could not be located
 */
export function getCmdPath() {
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
 * Get the absolute path to the extension's data folder ('%APPDATA%/VSCode-Batch-Runner')
 * @param bEnsureExists If true, the folder will be created if it doesn't exist
 */
export function getExtensionAppdataDirectory(bEnsureExists = true) {
    let configDir: string | undefined;
    if (process.platform === 'win32') {
        // Windows
        configDir = process.env.APPDATA;
    }
    else if (process.platform === 'darwin') {
        // Mac OS
        configDir = path.join(os.homedir(), 'Library');
    }
    else {
        // Linux
        configDir = path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'));
    }

    if (!configDir) {
        return;
    }

    configDir = path.join(configDir, DATA_FOLDER_NAME);

    // Create folder if it doesn't exists
    if (bEnsureExists && !fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }

    return configDir;
}