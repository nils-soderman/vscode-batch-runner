import * as vscode from 'vscode';

import * as assert from 'assert';
import sinon from 'sinon';

import * as argsModule from '../arguments';


suite('Arguments', function () {

    let showInputBoxReturnValue = "";

    setup(async () => {
        const showInputBoxStub = sinon.stub(vscode.window, "showInputBox");
        showInputBoxStub.callsFake(async (options?: vscode.InputBoxOptions, token?: vscode.CancellationToken) => {
            if (options?.value)
                return options.value;

            return showInputBoxReturnValue;
        });
    });

    teardown(async () => {
        sinon.restore();
    });

    test('Ask for Arguments', async function () {
        const uriOne = vscode.Uri.file("/uri-one.txt");
        const uriTwo = vscode.Uri.file("/uri-two.txt");

        showInputBoxReturnValue = "First Value";
        assert.deepStrictEqual(await argsModule.askForArguments(uriOne), ["First Value"]);

        showInputBoxReturnValue = "Second Value";
        assert.deepStrictEqual(await argsModule.askForArguments(uriTwo), ["Second Value"]);

        // Because uriOne now as a default value cached, we expect to see the first value again.
        assert.deepStrictEqual(await argsModule.askForArguments(uriOne), ["First Value"]);
    });

});
