import * as vscode from 'vscode';

const TERMINAL_NAME = "Batch Runner";

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

export function runBatFile(filepath: string) {
    const terminal = getTerminal();
    if (!terminal) {
        return;
    }

    terminal.sendText(filepath, true);
    terminal.show();
}