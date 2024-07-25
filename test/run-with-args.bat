@echo off
setlocal enabledelayedexpansion
set /a count=0
mkdir out
(for %%a in (%*) do (
    echo !count!-%%a
    set /a count+=1
)) > out/run-with-args.txt