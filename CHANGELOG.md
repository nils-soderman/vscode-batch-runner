# Change Log

## v0.0.5
(26-07-2022)

- `"cmd"` option in `batchrunner.runBatchIn` has been renamed to: `"External-cmd"`

- Added configuration `batchrunner.cmdPath` which should point to where cmd.exe is located. Defaults to: _"C:\\windows\\System32\\cmd.exe"_

- Fixed "cmd" not being recognized as a powershell command


## v0.0.4
(12-04-2022)

- Added support for batch files with the filename extension `.cmd` and `.btm`

## v0.0.3
(31-03-2022)

- Fixed *"Run batch file in terminal"* icon showing up even for files that are not batch files.

- Added configuration `batchrunner.runBatchIn` with the option `"cmd"` that runs the batch file in a new cmd window instead of the vscode terminal.

## v0.0.2
(27-03-2022)

- Fixed bug where batch files with spaces in their path could not be executed

## v0.0.1
(21-03-2022)

- Initial release