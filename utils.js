/**
 * utils.js — Shared utilities for the Neuron-IQ build pipeline.
 *
 * Contains: Logger, slugify, cleanMarkdown, getAllFiles,
 *           truncateDescription, escapeHtmlAttr, parseCliArgs.
 */

const fs = require('fs');
const path = require('path');

// ─── Logger ─────────────────────────────────────────────────────────────────

const COLORS = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
};

class Logger {
    constructor(quiet = false) {
        this.quiet = quiet;
        this.warnings = [];
        this.errors = [];
        this.startTime = Date.now();
    }

    info(msg) {
        if (!this.quiet) {
            console.log(`${COLORS.cyan}[INFO]${COLORS.reset}  ${msg}`);
        }
    }

    warn(msg) {
        this.warnings.push(msg);
        console.warn(`${COLORS.yellow}[WARN]${COLORS.reset}  ${msg}`);
    }

    error(msg) {
        this.errors.push(msg);
        console.error(`${COLORS.red}[ERROR]${COLORS.reset} ${msg}`);
    }

    fatal(msg) {
        console.error(`${COLORS.red}[FATAL]${COLORS.reset} ${msg}`);
        process.exit(1);
    }

    summary(stats) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log('');
        console.log(`${COLORS.magenta}${'─'.repeat(60)}${COLORS.reset}`);
        console.log(`${COLORS.green}[BUILD COMPLETE]${COLORS.reset} in ${elapsed}s`);
        console.log(`  Files scanned:     ${stats.filesScanned}`);
        console.log(`  Files skipped:     ${stats.filesSkipped}`);
        console.log(`  Pages generated:   ${stats.pagesGenerated}`);
        console.log(`  Links inferred:    ${stats.linksInferred}`);
        console.log(`  PDFs copied:       ${stats.pdfsCopied}`);

        if (this.warnings.length > 0) {
            console.log('');
            console.log(`${COLORS.yellow}[WARNINGS: ${this.warnings.length}]${COLORS.reset}`);
            this.warnings.forEach((w, i) => {
                console.log(`  ${COLORS.dim}${i + 1}.${COLORS.reset} ${w}`);
            });
        }

        if (this.errors.length > 0) {
            console.log('');
            console.log(`${COLORS.red}[ERRORS: ${this.errors.length}]${COLORS.reset}`);
            this.errors.forEach((e, i) => {
                console.log(`  ${COLORS.dim}${i + 1}.${COLORS.reset} ${e}`);
            });
        }

        console.log(`${COLORS.magenta}${'─'.repeat(60)}${COLORS.reset}`);
    }

    get hasWarnings() {
        return this.warnings.length > 0;
    }

    get hasErrors() {
        return this.errors.length > 0;
    }
}

// ─── String Utilities ───────────────────────────────────────────────────────

/**
 * Converts a human-readable title into a URL-safe slug.
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

/**
 * Strips Markdown/HTML/KaTeX syntax from raw Markdown text,
 * returning plain searchable text.
 * @param {string} text
 * @returns {string}
 */
function cleanMarkdown(text) {
    return (
        text
            ?.replace(/<[^>]+>/g, '')           // HTML tags
            .replace(/\$\$/g, '')               // $$ math fences
            .replace(/\$/g, '')                 // $ inline math
            .replace(/\*\*|__/g, '')            // bold markers
            .replace(/\*|_/g, '')               // italic markers
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // link syntax → text
            .replace(/\n/g, ' ')                // newlines → spaces
            .replace(/\s\s+/g, ' ')             // collapse whitespace
            .trim() || ''
    );
}

/**
 * Truncates text at the last word boundary at or before `maxLen` characters,
 * appending an ellipsis. Avoids cutting mid-word or mid-HTML-entity.
 * @param {string} text
 * @param {number} maxLen
 * @returns {string}
 */
function truncateDescription(text, maxLen = 155) {
    if (!text || text.length <= maxLen) return text || '';
    // Find the last space at or before maxLen
    const truncated = text.substring(0, maxLen);
    const lastSpace = truncated.lastIndexOf(' ');
    const cutPoint = lastSpace > 0 ? lastSpace : maxLen;
    return truncated.substring(0, cutPoint) + '…';
}

/**
 * Escapes characters that are unsafe inside HTML attribute values.
 * @param {string} str
 * @returns {string}
 */
function escapeHtmlAttr(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ─── Filesystem Utilities ───────────────────────────────────────────────────

/**
 * Recursively collects all files under `dirPath`.
 * @param {string} dirPath
 * @param {string[]} [arrayOfFiles]
 * @returns {string[]}
 */
function getAllFiles(dirPath, arrayOfFiles) {
    arrayOfFiles = arrayOfFiles || [];
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    }
    return arrayOfFiles;
}

/**
 * Recursively copies all files matching `ext` from `srcDir` into `destDir`,
 * preserving subdirectory structure.
 * @param {string} srcDir
 * @param {string} destDir
 * @param {string} ext  File extension to match (e.g., '.pdf')
 * @param {Logger} log
 * @returns {number} Number of files copied
 */
function copyFilesRecursive(srcDir, destDir, ext, log) {
    let count = 0;
    if (!fs.existsSync(srcDir)) return count;

    fs.mkdirSync(destDir, { recursive: true });
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            count += copyFilesRecursive(srcPath, destPath, ext, log);
        } else if (entry.name.endsWith(ext)) {
            try {
                fs.copyFileSync(srcPath, destPath);
                count++;
            } catch (err) {
                log.error(`Failed to copy ${srcPath}: ${err.message}`);
            }
        }
    }
    return count;
}

// ─── CLI Parsing ────────────────────────────────────────────────────────────

/**
 * Parses process.argv into a flags object.
 * @returns {{ strict: boolean, quiet: boolean, help: boolean }}
 */
function parseCliArgs() {
    const args = process.argv.slice(2);
    return {
        strict: args.includes('--strict'),
        quiet: args.includes('--quiet'),
        help: args.includes('--help') || args.includes('-h'),
    };
}

const HELP_TEXT = `
Neuron-IQ Build Pipeline
========================
Usage: node build.js [options]

Options:
  --strict   Treat warnings as errors (exit 1 on any warning). Use in CI.
  --quiet    Suppress info-level output; only show warnings and errors.
  --help     Show this help message and exit.
`;

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = {
    Logger,
    slugify,
    cleanMarkdown,
    truncateDescription,
    escapeHtmlAttr,
    getAllFiles,
    copyFilesRecursive,
    parseCliArgs,
    HELP_TEXT,
};
