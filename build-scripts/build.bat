cd "%~dp0../"
rmdir /S /Q "./out/"

@REM Make sure the out builds directory exists
set OutDir="./builds/"
if not exist %OutDir% (
    mkdir %OutDir%
)

vsce package --out %OutDir%