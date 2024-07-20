import * as vscode from 'vscode';


interface ICachedArgs {
    [filepath: string]: {
        arg: string
    }
}

let cachedArgs: ICachedArgs = {};


export async function askForArguments(filepath?: vscode.Uri): Promise<string[] | undefined> {
    const cachedArg = filepath ? getCachedArgument(filepath) : "";

    const argString = await vscode.window.showInputBox({
        placeHolder: "Arguments...",
        prompt: "Arguments to pass to the batch file",
        value: cachedArg,
    });

    if (argString === undefined) {
        return undefined;
    }

    if (!argString) {
        return [];
    }

    if (filepath) {
        cacheArguments(filepath, argString);
    }

    return [argString];
}


function cacheArguments(filepath: vscode.Uri, arg: string) {
    cachedArgs[filepath.fsPath] = { arg };
}


function getCachedArgument(filepath: vscode.Uri): string {
    if (cachedArgs[filepath.fsPath]) {
        return cachedArgs[filepath.fsPath].arg;
    }

    return "";
}