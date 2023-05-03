import * as vscode from 'vscode';

import * as utils from './utils';
import * as path from 'path';
import * as fs from 'fs';


const CACHED_ARGS_FILENAME = "cached_args.json";


interface ICachedArgs {
    [filepath: string]: {
        arg: string,
        time: number
    }
}


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
    let cachedData = getCacheArgData();
    cachedData[filepath] = {
        arg: arg,
        time: Date.now(),
    };

    fs.writeFileSync(getCacheArgFilepath(), JSON.stringify(cachedData));
}


function getCacheArgFilepath(): string {
    const appdataDir = utils.getExtensionAppdataDirectory(true);
    if (appdataDir) {
        return path.join(appdataDir, CACHED_ARGS_FILENAME);
    }
    return "";
}


function getCacheArgData(): ICachedArgs {
    const cacheFile = getCacheArgFilepath();
    if (fs.existsSync(cacheFile)) {
        const data = fs.readFileSync(cacheFile, "utf8");
        return JSON.parse(data);
    }
    return {};
}


function getCachedArgument(filepath: string): string {
    const cachedData = getCacheArgData();
    if (cachedData[filepath]) {
        return cachedData[filepath].arg;
    }
    return "";
}