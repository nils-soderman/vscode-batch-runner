import * as vscode from 'vscode';

import * as utils from './utils';

export async function getArguments(): Promise<string[]> {
    return await askForArguments();
}

async function askForArguments(): Promise<string[]> {
    const argString = await vscode.window.showInputBox({
        placeHolder: "Arguments...",
        prompt: "Arguments to pass to the batch file",
        value: "",
    });

    if (!argString) {
        return [];
    }

    cacheArguments("", argString);

    return [argString];
}


function cacheArguments(filepath: string, arg: string) {
    const dataEntry = {
        filepath: filepath,
        arg: arg,
        time: Date.now(),
    };
}


function getCacheArgFilepath(filepath: string): string {
    return "";
}