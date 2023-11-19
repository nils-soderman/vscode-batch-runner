# Batch Runner

Quickly run batch *(.bat / .cmd)* files in the VS Code terminal:

<br>

![Batch runner demo](https://raw.githubusercontent.com/nils-soderman/vscode-batch-runner/main/media/demo/demo-exec.gif)

<br>

# Executing a batch file

### Shortcut
If the active document is a batch file, press <kbd>F5</kbd> to execute it.

### Context Menu
This extension adds the options to run the batch file when right clicking any batch file in the explorer.

![Context menu run batch file](https://raw.githubusercontent.com/nils-soderman/vscode-batch-runner/main/media/demo/demo-context-menu.png)

### Button
When a batch file is open in the editor, a small icon is added to the top right corner which can be used to execute the file.

![Run batch file button](https://raw.githubusercontent.com/nils-soderman/vscode-batch-runner/main/media/demo/demo-exec-button.png)

<br>

## Running batch file with arguments

VS Code can show a prompt where you can type in the arguments before executing the batch file.

Ways to run the batch file with arguments:  

* Command: *"Batch Runner: Run with Arguments"* (`batch-runner.execBatchFileArgs`)
* In the context menu when right clicking a batch file, select *"Run with Arguments"*
* By clicking the dropdown arrow next to the run button and selecting *"Run with Arguments"*  
    ![Run with arguments button](https://raw.githubusercontent.com/nils-soderman/vscode-batch-runner/main/media/demo/demo-exec-button-args.png)

<br>

## Running batch file as administrator

Ways to run the batch file with administrator privileges:

* Command: *"Batch Runner: Run as Administrator"* (`batch-runner.execBatchFileAsAdmin`)
* Holding down <kbd>Alt</kbd> when right clicking a file in the explorer will provide you with the option to run the batch file as administrator.
* By clicking the dropdown arrow next to the run button and selecting *"Run as Administrator"*

<br>

# Feedback, Bugs or Requests

If you have any questions, feature requests or run into any bugs, don't hesitate to get in contact with me:

[Report an issue](https://github.com/nils-soderman/vscode-batch-runner/issues "Report a bug on the GitHub repository")<br>
[Personal Website](https://nilssoderman.com)<br>