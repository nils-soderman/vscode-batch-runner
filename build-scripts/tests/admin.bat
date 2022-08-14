NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    ECHO You have administrator privileges! 
) ELSE (
    ECHO You do NOT have administrator privilages!
)

pause