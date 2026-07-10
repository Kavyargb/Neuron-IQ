# Understanding Development Tooling

This document outlines the architecture and execution flow of the local development environment for Neuron-IQ, specifically focusing on `dev.js` and `watch.js`.

These two scripts operate together to provide a seamless local development experience. They ensure that modifications to content are automatically rebuilt and served without manual intervention or caching conflicts.

---

## Architectural Overview

The development environment utilizes a multi-process architecture to decouple the HTTP serving layer from the filesystem monitoring layer. 

```mermaid
flowchart TD
    subgraph "Parent Process (Node.js)"
        A[dev.js]
    end

    subgraph "Child Processes"
        B[http-server via npx]
        C[node watch.js]
    end

    subgraph "Filesystem"
        D[content/*.md]
        E[public/]
    end

    subgraph "Build Engine"
        F[node build.js]
    end

    A -->|spawn| B
    A -->|spawn| C
    
    B -->|serves over HTTP| E
    C -->|fs.watch| D
    
    D -->|change event| C
    C -->|exec (debounced)| F
    F -->|compiles to| E
```

`dev.js` acts as the orchestrator, starting and managing the lifecycle of both the HTTP server and the file watcher. When modifications occur, `watch.js` intercepts them and executes the primary build pipeline.

---

## Process Orchestration: `dev.js`

The `dev.js` script handles cross-platform process management and graceful termination. 

### Cross-Platform Execution

The script utilizes the native `child_process` module to spawn background services. It explicitly handles differences between Unix and Windows execution environments.

```javascript
const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';
```

On Windows, `npx` must be executed as `npx.cmd`. Without this check, the `spawn` command would fail with an `ENOENT` error on Windows systems.

### Spawning the Child Processes

The orchestrator spawns two simultaneous processes:

```javascript
const server = spawn(npxCmd, ['http-server', 'public', '-p', '8080', '-c-1'], { stdio: 'inherit', shell: isWindows });

const watcher = spawn('node', ['watch.js'], { stdio: 'inherit' });
```

1. **HTTP Server**: Uses `npx http-server` to serve the `public/` directory on port 8080. The flag `-c-1` is critical here; it explicitly disables HTTP caching. Because Neuron-IQ relies heavily on Service Workers and caching in production, disabling cache during development ensures that developers see immediate updates after a rebuild.
2. **File Watcher**: Spawns a separate Node.js instance dedicated to monitoring the filesystem via `watch.js`. 

Both processes use `{ stdio: 'inherit' }`, which pipes their standard output and standard error streams directly to the primary console. This allows the developer to view logs from the server, watcher, and build engine in a single unified terminal window.

### Lifecycle Management

When a user terminates the development server (typically by pressing `Ctrl+C`), Node.js receives a termination signal. 

```javascript
const cleanup = () => {
    console.log("\n[Neuron-IQ Dev] Shutting down services...");
    server.kill();
    watcher.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
```

If the parent process exits without killing its children, the spawned `http-server` and `watch.js` processes would become orphaned background tasks. This leads to "zombie" processes that persistently occupy port `8080`, preventing the developer from starting the server again. 

By binding the `cleanup` function to the `SIGINT` (Interrupt) and `SIGTERM` (Terminate) events, the script guarantees that all child processes are safely terminated before the main thread exits.

---

## Filesystem Monitoring: `watch.js`

The `watch.js` script is a lightweight observer designed to trigger the static site generator whenever content changes.

### Recursive Watching

```javascript
const contentDir = path.join(__dirname, 'content');
fs.watch(contentDir, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.md')) return;
    // ...
});
```

The script monitors the `content/` directory recursively. It filters out any filesystem events that do not pertain to Markdown (`.md`) files. This ensures that modifying unrelated files (or the output directories themselves) does not trigger unnecessary compilation cycles.

### The Debounce Mechanism

The most critical architectural component of the watcher is the debounce logic.

```javascript
let debounceTimer;

// Inside the fs.watch callback:
clearTimeout(debounceTimer);
debounceTimer = setTimeout(() => {
    // Execution logic
}, 150);
```

**The Problem:** Modern text editors (such as VS Code, Sublime Text, or IntelliJ) rarely perform simple, atomic file saves. A single "save" action may trigger multiple filesystem events in rapid succession (e.g., creating a temporary lock file, writing data, deleting the lock file, and updating file metadata). 

If `watch.js` executed `build.js` on every single filesystem event, saving a file once could trigger the compilation pipeline three or four times simultaneously, leading to race conditions and CPU spikes.

**The Solution:** The script implements a 150-millisecond debounce. When an event is detected, it clears any pending timers and starts a new one. The build pipeline only executes after the filesystem has been completely silent for 150 milliseconds.

### Execution of the Build Pipeline

Once the debounce timer resolves, the watcher uses `child_process.exec` to run the main compiler.

```javascript
exec('node build.js', (err, stdout, stderr) => {
    if (err) {
        console.error(`[Watcher] Build Error:\n`, stderr || err.message);
    } else {
        console.log(stdout.trim());
    }
});
```

`exec` is used here instead of `spawn` because `build.js` is a short-lived script that returns a finite amount of terminal output. The callback captures standard output and standard error, allowing the watcher to format and display build completion messages or surface compilation errors cleanly to the developer's console.
