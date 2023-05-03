import * as vscode from 'vscode';


interface ICachedArgs {
    [filepath: string]: {
        arg: string
    }
}

let cachedArgs: ICachedArgs = {};


export async function askForArguments(filepath?: string): Promise<string[]> {
    const cachedArg = filepath ? getCachedArgument(filepath) : "";

    const argString = await vscode.window.showInputBox({
        placeHolder: "Arguments...",
        prompt: "Arguments to pass to the batch file",
        value: cachedArg,
    });

    if (!argString) {
        return [];
    }

    if (filepath) {
        cacheArguments(filepath, argString);
    }

    return [argString];
}


function cacheArguments(filepath: string, arg: string) {
    cachedArgs[filepath] = {
        arg: arg,
    };
}


function getCachedArgument(filepath: string): string {
    if (cachedArgs[filepath]) {
        return cachedArgs[filepath].arg;
    }
    return "";
}