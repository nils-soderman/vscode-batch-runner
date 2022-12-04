import * as vscode from 'vscode';

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';


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


export function isBtmFile(filepath: string) {
    return filepath.toLowerCase().endsWith(".btm");
}


function openSettings(config: string) {
    vscode.commands.executeCommand('workbench.action.openSettings', config);
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
        vscode.window.showErrorMessage(`Cmd.exe could not be located at ${cmdPath}`, "Update path").then(clickedItem => {
            if (clickedItem === "Update path") {
                // Open user settings and search for the cmdPath setting
                openSettings(`${EXTENSION_CONFIG_NAME}.${CMD_PATH_CONFIG_KEY}`);
            }
        });

        return undefined;
    }

    return cmdPath;
}


export function getExecutablePath(filepath: string) {
    if (isBtmFile(filepath)) {
        const configKey = "btmExecutable";

        let btmExecutablePath: string | undefined = getExtensionConfig().get(configKey);
        if (btmExecutablePath && fs.existsSync(btmExecutablePath)) {
            return btmExecutablePath;
        }

        // Browse to TCC
        const message = btmExecutablePath ? `Executable could not be found: ${btmExecutablePath}` : "No program selected to execute .btm files"; 
        vscode.window.showErrorMessage(message, "Browse", "Open Settings").then(clickedItem => {
            if (clickedItem === "Browse") {
                vscode.window.showOpenDialog({
                    "canSelectMany": false,
                    "filters": {
                        "executable": ["exe"]
                    },
                    "title": "Select a executable to use for .BTM files",
                    "openLabel": "Select executable for .BTM files"
                }).then(value => {
                    if (value) {
                        const extConfig = getExtensionConfig();
                        extConfig.update(configKey, value[0].fsPath, vscode.ConfigurationTarget.Global);
                    }
                });
            }

            else if (clickedItem === "Open Settings") {
                openSettings(`${EXTENSION_CONFIG_NAME}.${configKey}`);
            }
        });

        return;
    }

    return getCmdPath();
}