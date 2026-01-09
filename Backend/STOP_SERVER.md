# How to Stop the Backend Server

## Quick Stop Methods

### Method 1: Using Ctrl+C
When running the server in a terminal, press `Ctrl+C` to gracefully stop it.

### Method 2: Kill Port Script
```bash
npm run kill:port
```
This will kill all processes running on port 3001.

### Method 3: Manual Kill
```bash
# Find the process
lsof -ti:3001

# Kill it
kill -9 $(lsof -ti:3001)
```

## Graceful Shutdown

The backend now includes graceful shutdown handlers that:
- ✅ Close database connections properly
- ✅ Release port 3001 on exit
- ✅ Handle SIGTERM, SIGINT, and SIGHUP signals
- ✅ Clean up resources on process exit

## If Port 3001 is Still in Use

If you find port 3001 is still in use after stopping the server:

1. **Check what's using the port:**
   ```bash
   lsof -i:3001
   ```

2. **Kill the process:**
   ```bash
   npm run kill:port
   ```

3. **Force kill all Node processes (use with caution):**
   ```bash
   killall -9 node
   ```

## Starting the Server

### Recommended: Use the safe start script
```bash
npm run start:dev:safe
```

This script:
- Automatically kills any existing processes on port 3001
- Ensures proper cleanup when terminal closes
- Handles signals correctly

### Standard start (also cleans port automatically)
```bash
npm run start:dev
```

The `prestart:dev` hook will automatically kill any processes on port 3001 before starting.

## Notes

- The server now includes graceful shutdown handlers in `main.ts`
- When you close the terminal, the process should terminate automatically
- If you run the server in the background with `&`, remember to kill it manually
- The `kill:port` script can be run independently: `bash scripts/kill-port.sh 3001`
- **Note**: Port changed from 5060 to 3001 because Chrome blocks port 5060 (ERR_UNSAFE_PORT)

