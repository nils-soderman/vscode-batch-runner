import * as vscode from 'vscode';

import * as path from 'path';
// import * as child_process from 'child_process';


const TERMINAL_NAME = "Batch Runner";


function isBatchFile(filepath: string) {
    return filepath.toLowerCase().endsWith(".bat");
}


function getTerminal(bEnsureExists = true)
{
    for (const terminal of vscode.window.terminals) {
        if (terminal.name === TERMINAL_NAME) {
            return terminal;
        }
    }

    if (bEnsureExists) {
        return vscode.window.createTerminal(TERMINAL_NAME);
    }
}

function runBatchFileInTerminal(filepath: string) {
    const terminal = getTerminal();
    if (!terminal) {
        return false;
    }
    terminal.sendText(`cmd /c "${filepath}"`, true);
    terminal.show();

}

export function runBatchFile(filepath: string) {
    if (!isBatchFile(filepath)) {
        const filename = path.basename(filepath);
        vscode.window.showErrorMessage(`Batch Runner: ${filename} was not recognized as a batch file.`);
        return false;
    }
    
    // const a = child_process.exec(`cmd /c start ${filepath}`);
    runBatchFileInTerminal(filepath);
    
    return true;
}