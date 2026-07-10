const { spawn } = require('child_process');

console.log("[Neuron-IQ Dev] Starting development services...");

const isWindows = process.platform === 'win32';
const npxCmd = isWindows ? 'npx.cmd' : 'npx';

const server = spawn(npxCmd, ['http-server', 'public', '-p', '8080', '-c-1'], { stdio: 'inherit', shell: isWindows });

const watcher = spawn('node', ['watch.js'], { stdio: 'inherit' });

const cleanup = () => {
    console.log("\n[Neuron-IQ Dev] Shutting down services...");
    server.kill();
    watcher.kill();
    process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
