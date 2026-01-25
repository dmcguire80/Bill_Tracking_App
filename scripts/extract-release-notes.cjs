const fs = require('fs');
const path = require('path');

// Usage: node extract-release-notes.cjs <version_tag>
// Example: node extract-release-notes.cjs v0.9.9

const versionTag = process.argv[2];

if (!versionTag) {
    console.error('Error: No version tag provided.');
    process.exit(1);
}

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

try {
    const content = fs.readFileSync(changelogPath, 'utf8');
    const lines = content.split('\n');

    let capture = false;
    const releaseNotes = [];

    for (const line of lines) {
        // Start capturing when we hit the requested version header
        if (line.startsWith(`## ${versionTag}`)) {
            capture = true;
            continue;
        }

        // Stop capturing when we hit the next version header
        if (capture && line.startsWith('## v')) {
            break;
        }

        if (capture) {
            releaseNotes.push(line);
        }
    }

    // Trim leading/trailing whitespace from the captured block
    const result = releaseNotes.join('\n').trim();

    if (!result) {
        console.warn(`Warning: No notes found for ${versionTag}. Defaulting to tag name.`);
        console.log(versionTag);
    } else {
        console.log(result);
    }

} catch (error) {
    console.error('Error reading CHANGELOG.md:', error);
    process.exit(1);
}
