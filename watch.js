const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const contentDir = path.join(__dirname, 'content');

console.log(`[Watcher] Monitoring content directory for markdown modifications: ${contentDir}`);

let debounceTimer;
fs.watch(contentDir, { recursive: true }, (eventType, filename) => {
    if (!filename || !filename.endsWith('.md')) return;
    
    // Debounce to prevent rapid double-triggering during file saves
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        console.log(`[Watcher] File change detected: ${filename}. Initiating build...`);
        exec('node build.js', (err, stdout, stderr) => {
            if (err) {
                console.error(`[Watcher] Build Error:\n`, stderr || err.message);
            } else {
                console.log(stdout.trim());
            }
        });
    }, 150);
});
