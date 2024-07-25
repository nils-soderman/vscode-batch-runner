import * as vscode from 'vscode';

import * as assert from 'assert';
import sinon from 'sinon';

import * as vscodeMock from './vscode-mock';

import * as execute from '../execute';


suite('Execute', function () {
    this.timeout(20000);

    const workspaceDir = vscode.workspace.workspaceFolders?.[0].uri;
    if (!workspaceDir)
        throw new Error("No workspace folder found");

    const outputDir = vscode.Uri.joinPath(workspaceDir, "out");

    const extensionConfiguration = new vscodeMock.ConfigMock(
        {
            saveFileBeforeRun: true,
            runBatchIn: "Terminal",
            cmdPath: "C:\\windows\\System32\\cmd.exe",
        }
    );

    setup(async () => {
        vscodeMock.stubGetConfiguration({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "batch-runner": extensionConfiguration
        });
    });

    teardown(async () => {
        sinon.restore();

        const terminal = await execute.getBatchRunnerTerminal(false, false);
        terminal?.dispose();

        await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        await vscode.workspace.fs.delete(outputDir, { recursive: true });
    });

    async function assertOutput(filename: string, strictEqual: string) {
        const file = vscode.Uri.joinPath(outputDir, filename);

        for (let i = 0; i < 25; i++) {
            try {
                if (await vscode.workspace.fs.stat(file)) {
                    const data = await vscode.workspace.fs.readFile(file);
                    assert.strictEqual(data.toString().trim(), strictEqual);
                    return;
                }
            }
            catch (e) { }

            await new Promise(resolve => setTimeout(resolve, 150));
        }

        throw new Error("File not found: " + file.fsPath);
    }

    test('Run', async function () {
        const batchFile = vscode.Uri.joinPath(workspaceDir, "hello-world.bat");

        assert.ok(await execute.runBatchFile(batchFile));

        await assertOutput("hello-world.txt", "Hello World!");
    });

    test('Run With Arguments', async function () {
        const batchFile = vscode.Uri.joinPath(workspaceDir, "run-with-args.bat");

        const args = ["Hello", "World", "Args"];
        const expectedOutput = args.map((arg, i) => `${i}-${arg}`).join("\r\n");

        assert.ok(await execute.runBatchFile(batchFile, args));

        await assertOutput("run-with-args.txt", expectedOutput);
    });

    test('Run as Admin', async function () {
        // Increase timeout for admin prompt incase user has UAC enabled and need to accept prompt
        this.timeout(10 * 1000);

        const batchFile = vscode.Uri.joinPath(workspaceDir, "run-as-admin.bat");

        assert.ok(await execute.runBatchFile(batchFile, [], true));

        await assertOutput("run-as-admin.txt", "admin");
    });

    test('Save File Before Run', async function () {
        const output = "ok";

        const batchFile = vscode.Uri.joinPath(workspaceDir, "out", "save-file-before-run.bat");
        await vscode.workspace.fs.writeFile(batchFile, new Uint8Array());
        
        const editor = await vscode.window.showTextDocument(batchFile);
        editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), `echo ${output}> save-file-before-run.txt\r\n`);
        });

        extensionConfiguration.update("saveFileBeforeRun", false);
        assert.ok(await execute.runBatchFile(batchFile));
        await assert.rejects(assertOutput("save-file-before-run.txt", output));

        extensionConfiguration.update("saveFileBeforeRun", true);
        assert.ok(await execute.runBatchFile(batchFile));
        await assertOutput("save-file-before-run.txt", output);
    });

});
