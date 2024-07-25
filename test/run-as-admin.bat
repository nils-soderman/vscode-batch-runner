mkdir out

NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    ECHO admin> out/run-as-admin.txt
) ELSE (
    ECHO not admin> out/run-as-admin.txt
)