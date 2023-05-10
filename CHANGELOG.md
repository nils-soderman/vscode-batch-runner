# Change Log

## 1.1.0
(x-05-2023)

### Added:
- Command `batch-utils.execBatchFileArgs` that will first spawn a input box where you can enter the arguments to pass to the batch file.


## 1.0.1
(11-12-2022)

### Removed:
- Incorrect indications that this extension officially supports .BTM files


## 1.0.0
(23-10-2022)

### Fixed:
- Configs not read correctly from the folder settings


## 0.0.8
(17-09-2022)

- The Batch Runner terminal now uses **cmd.exe** based on the cmd path given in the config `batchrunner.cmdPath`

- Added the execute commands to the `editor/title/context` menu

- Renamed *"Run Batch File as Admin"* to *"Run Batch File as Administrator"*

## 0.0.7
(14-08-2022)

- Added command `batch-utils.execBatchFileAsAdmin` that will run the batch file with admin privileges.

- Fixed "Run Batch File" showing up in context menu even for non batch files

- Updated configuration scope of `batchrunner.runBatchIn` to be at "resource" level

- Updated configuration scope of `batchrunner.cmdPath` to be at "machine" level


## 0.0.6
(31-07-2022)

- Set working directory to be the directory that the batch file is located in

- Renamed command 'Run Batch File in Terminal' -> 'Run Batch File'
 

## 0.0.5
(26-07-2022)

- `"cmd"` option in `batchrunner.runBatchIn` has been renamed to: `"External-cmd"`

- Added configuration `batchrunner.cmdPath` which should point to where cmd.exe is located. Defaults to: _"C:\\windows\\System32\\cmd.exe"_

- Fixed "cmd" not being recognized as a powershell command


## 0.0.4
(12-04-2022)

- Added support for batch files with the filename extension `.cmd` and `.btm`

## 0.0.3
(31-03-2022)

- Fixed *"Run batch file in terminal"* icon showing up even for files that are not batch files.

- Added configuration `batchrunner.runBatchIn` with the option `"cmd"` that runs the batch file in a new cmd window instead of the vscode terminal.

## 0.0.2
(27-03-2022)

- Fixed bug where batch files with spaces in their path could not be executed

## 0.0.1
(21-03-2022)

- Initial release