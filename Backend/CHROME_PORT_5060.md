# Chrome ERR_UNSAFE_PORT Issue - Port 5060

Port 5060 is reserved by Chrome for SIP (Session Initiation Protocol), which causes `ERR_UNSAFE_PORT` errors.

## Solutions

### Option 1: Use Firefox or Edge
- Firefox and Edge don't block port 5060
- Simply use one of these browsers instead of Chrome

### Option 2: Launch Chrome with Flag (Recommended for Development)
Launch Chrome with the `--explicitly-allowed-ports` flag:

**Linux/Mac:**
```bash
google-chrome --explicitly-allowed-ports=5060
```

**Or on some systems:**
```bash
chromium-browser --explicitly-allowed-ports=5060
```

**Windows:**
```cmd
chrome.exe --explicitly-allowed-ports=5060
```

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --explicitly-allowed-ports=5060
```

### Option 3: Create a Chrome Shortcut (Permanent Fix)

1. Create a new desktop shortcut to Chrome
2. Right-click → Properties
3. Add `--explicitly-allowed-ports=5060` to the target/command
4. Save and use this shortcut for development

## Current Configuration

- **Backend Port:** 5060
- **Frontend Port:** 5055
- **CORS:** Enabled for http://localhost:5055

## Testing

After launching Chrome with the flag, the frontend should connect to the backend on port 5060 without errors.













