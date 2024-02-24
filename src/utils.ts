import * as vscode from 'vscode';

import * as child_process from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const EXTENSION_CONFIG_NAME = "batch-runner";
const CMD_PATH_CONFIG_KEY = "cmdPath";


/**
 * @param filepath If provided it'll use the file's workspace folder as scope, otherwise it'll try to get the current active filepath.
 * @returns The workspace configuration for this extension _('batchrunner')_
 */
export function getExtensionConfig(filepath?: string) {
    // Try to get the active workspace folder first, to have it read Folder Settings
    let workspaceFolder: vscode.Uri | undefined;
    if (filepath) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filepath))?.uri;
    }
    else if (vscode.window.activeTextEditor) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri)?.uri;
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
 * Check if two paths are the same, ignoring case and normalizing the path
 */
export function isPathsSame(path1: string, path2: string) {
    return path.normalize(path1).toLowerCase() === path.normalize(path2).toLowerCase();
}