/**
 * linker.js — Aho-Corasick-based internal link inference for the Neuron-IQ build.
 *
 * Replaces the O(n²) regex-per-pair approach with a single-pass automaton:
 *   1. Build a trie from all node names + aliases (lowercased).
 *   2. Compute failure links (BFS).
 *   3. For each node, scan its searchContent through the automaton once.
 *   4. Filter matches for word-boundary compliance.
 *
 * Complexity: O(N × avg_content_length + total_pattern_length)
 *   instead of O(N² × avg_content_length).
 */

// ─── Aho-Corasick Automaton ─────────────────────────────────────────────────

class AhoCorasick {
    constructor() {
        /** @type {AhoNode[]} */
        this.nodes = [this._createNode()]; // nodes[0] = root
    }

    /**
     * @returns {{ children: Map<string, number>, fail: number, outputs: string[] }}
     */
    _createNode() {
        return {
            children: new Map(),
            fail: 0,
            outputs: [],  // node names that end at this state
        };
    }

    /**
     * Inserts a pattern (lowercased) into the trie, associated with a node name.
     * @param {string} pattern  Lowercased search term.
     * @param {string} nodeName Original (case-preserved) node name this pattern maps to.
     */
    addPattern(pattern, nodeName) {
        let current = 0;
        for (const ch of pattern) {
            const node = this.nodes[current];
            if (!node.children.has(ch)) {
                node.children.set(ch, this.nodes.length);
                this.nodes.push(this._createNode());
            }
            current = node.children.get(ch);
        }
        this.nodes[current].outputs.push(nodeName);
    }

    /**
     * Builds failure links using BFS from the root's direct children.
     * Must be called after all patterns are added and before searching.
     */
    build() {
        const queue = [];
        const root = this.nodes[0];

        // Depth-1 children: their failure links all point to root (0).
        for (const [ch, childIdx] of root.children) {
            this.nodes[childIdx].fail = 0;
            queue.push(childIdx);
        }

        // BFS to compute failure links for deeper nodes.
        while (queue.length > 0) {
            const currIdx = queue.shift();
            const currNode = this.nodes[currIdx];

            for (const [ch, childIdx] of currNode.children) {
                queue.push(childIdx);

                // Walk up failure chain to find the longest proper suffix
                // that is also a prefix of some pattern.
                let failIdx = currNode.fail;
                while (failIdx !== 0 && !this.nodes[failIdx].children.has(ch)) {
                    failIdx = this.nodes[failIdx].fail;
                }

                this.nodes[childIdx].fail = this.nodes[failIdx].children.has(ch)
                    ? this.nodes[failIdx].children.get(ch)
                    : 0;

                // Merge outputs from the failure node (suffix links).
                const failNode = this.nodes[this.nodes[childIdx].fail];
                if (failNode.outputs.length > 0) {
                    this.nodes[childIdx].outputs = [
                        ...this.nodes[childIdx].outputs,
                        ...failNode.outputs,
                    ];
                }
            }
        }
    }

    /**
     * Searches `text` (lowercased) for all pattern matches.
     * Returns a Set of original node names found as whole-word matches.
     *
     * @param {string} text       The text to search (will be lowercased internally).
     * @param {string} originalText  The original (un-lowercased) text for boundary checks.
     * @returns {Set<string>}     Set of matched node names.
     */
    search(text) {
        const lowerText = text.toLowerCase();
        const matched = new Set();
        let state = 0;

        for (let i = 0; i < lowerText.length; i++) {
            const ch = lowerText[i];

            // Traverse failure links until we find a matching transition or hit root.
            while (state !== 0 && !this.nodes[state].children.has(ch)) {
                state = this.nodes[state].fail;
            }

            if (this.nodes[state].children.has(ch)) {
                state = this.nodes[state].children.get(ch);
            }
            // else state stays 0 (root)

            // Check outputs at this state (including suffix-linked outputs).
            const outputs = this.nodes[state].outputs;
            if (outputs.length > 0) {
                for (const nodeName of outputs) {
                    // Word-boundary check:
                    // The match ends at position i. The pattern length = nodeName.length
                    // (since we inserted lowercased nodeName).
                    // We need to find the actual pattern length to check boundaries.
                    const patternLen = nodeName.length;
                    const matchStart = i - patternLen + 1;
                    const matchEnd = i;

                    // Check character before match start
                    if (matchStart > 0 && isWordChar(lowerText[matchStart - 1])) {
                        continue; // Not a word boundary — skip
                    }
                    // Check character after match end
                    if (matchEnd < lowerText.length - 1 && isWordChar(lowerText[matchEnd + 1])) {
                        continue; // Not a word boundary — skip
                    }

                    matched.add(nodeName);
                }
            }
        }

        return matched;
    }
}

/**
 * Returns true if the character is a "word" character (alphanumeric or underscore).
 * Used for word-boundary filtering of Aho-Corasick matches.
 * @param {string} ch
 * @returns {boolean}
 */
function isWordChar(ch) {
    return /\w/.test(ch);
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Infers internal links for all nodes using Aho-Corasick.
 *
 * Builds a single automaton from all node names + aliases, then scans
 * each node's searchContent once. Populates `node.internalLinks` in-place.
 *
 * @param {object[]} nodesList  Array of node data objects.
 * @returns {number}            Total number of links inferred.
 */
function inferLinks(nodesList) {
    const ac = new AhoCorasick();

    // Build patterns: each node name and alias maps back to the node name.
    for (const node of nodesList) {
        ac.addPattern(node.name.toLowerCase(), node.name);
        if (node.aliases) {
            for (const alias of node.aliases) {
                ac.addPattern(alias.toLowerCase(), node.name);
            }
        }
    }

    ac.build();

    let totalLinks = 0;

    for (const sourceNode of nodesList) {
        const matches = ac.search(sourceNode.searchContent);
        // Remove self-references
        matches.delete(sourceNode.name);
        sourceNode.internalLinks = Array.from(matches);
        totalLinks += sourceNode.internalLinks.length;
    }

    return totalLinks;
}

// ─── Exports ────────────────────────────────────────────────────────────────

module.exports = { inferLinks };
