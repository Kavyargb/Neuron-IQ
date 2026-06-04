const { spawn } = require('child_process');

console.log("[Neuron-IQ Dev] Starting development services...");

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

// Spawn local HTTP server on port 8080
const server = spawn(npxCmd, ['http-server', 'public', '-p', '8080', '-c-1'], { stdio: 'inherit', shell: isWindows });

// Spawn markdown file watcher
const watcher = spawn('node', ['watch.js'], { stdio: 'inherit' });

// Graceful cleanup on terminate
const cleanup = () => {
    console.log("\n[Neuron-IQ Dev] Shutting down services...");
    server.kill();
    watcher.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
