# Change Log

## [1.2.0] - UNRELEASED

### Added
- Setting `batch-runner.saveFileBeforeRun` which will save any edits to the current batch file before executing it. Defaults to `false` ([#14](https://github.com/nils-soderman/vscode-batch-runner/issues/14))

## [1.1.2] - 2023-07-23

### Changed
- Use esbuild to bundle & minify the compiled code

## [1.1.1] - 2023-07-01

### Changed
- Always restart the Batch Runner Terminal between each run. ([#11](https://github.com/nils-soderman/vscode-batch-runner/issues/11))

## [1.1.0] - 2023-06-10

### Added
- Command `batch-utils.execBatchFileArgs` that will first spawn a input box where you can enter the arguments to pass to the batch file.

### Changed

- Renamed configs `batchrunner.cmdPath` & `batchrunner.runBatchIn` -> `batch-runner.cmdPath` & `batch-runner.runBatchIn` and deprecated the old configuration names.

## [1.0.1] - 2022-12-11

### Removed
- Incorrect indications that this extension officially supports .BTM files

## [1.0.0] - 2022-10-23

### Fixed
- Configs not read correctly from the folder settings

## [0.0.8] - 2022-09-17
- The Batch Runner terminal now uses **cmd.exe** based on the cmd path given in the config `batchrunner.cmdPath`
- Added the execute commands to the `editor/title/context` menu
- Renamed *"Run Batch File as Admin"* to *"Run Batch File as Administrator"*

## [0.0.7] - 2022-08-14
- Added command `batch-utils.execBatchFileAsAdmin` that will run the batch file with admin privileges.
- Fixed "Run Batch File" showing up in context menu even for non batch files
- Updated configuration scope of `batchrunner.runBatchIn` to be at "resource" level
- Updated configuration scope of `batchrunner.cmdPath` to be at "machine" level

## [0.0.6] - 2022-07-31
- Set working directory to be the directory that the batch file is located in
- Renamed command 'Run Batch File in Terminal' -> 'Run Batch File'

## [0.0.5] - 2022-07-26
- `"cmd"` option in `batchrunner.runBatchIn` has been renamed to: `"External-cmd"`
- Added configuration `batchrunner.cmdPath` which should point to where cmd.exe is located. Defaults to: _"C:\\windows\\System32\\cmd.exe"_
- Fixed "cmd" not being recognized as a powershell command

## [0.0.4] - 2022-04-12
- Added support for batch files with the filename extension `.cmd` and `.btm`

## [0.0.3] - 2022-03-31
- Fixed *"Run batch file in terminal"* icon showing up even for files that are not batch files.
- Added configuration `batchrunner.runBatchIn` with the option `"cmd"` that runs the batch file in a new cmd window instead of the vscode terminal.

## [0.0.2] - 2022-03-27
- Fixed bug where batch files with spaces in their path could not be executed

## [0.0.1] - 2022-03-21
- Initial release