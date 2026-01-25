const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
const version = process.argv[2]; // e.g., 'v0.8.4'

if (!version) {
    console.error('Please provide a version tag (e.g., v0.8.4)');
    process.exit(1);
}

try {
    const content = fs.readFileSync(changelogPath, 'utf8');
    const lines = content.split('\n');

    let capture = false;
    let title = '';
    let bodyLines = [];

    // Regex to match version headers, e.g., "## v0.8.4 - Performance Patch"
    // We match "## " followed by the version tag
    const versionRegex = /^##\s+(v\d+\.\d+\.\d+.*)$/i;

    for (const line of lines) {
        const match = line.match(versionRegex);

        if (match) {
            // If we were capturing and hit the next version, stop.
            if (capture) {
                break;
            }

            // Check if this is the version we want
            const fullTitle = match[1].trim();

            // Check if it starts with our requested version
            // We use startsWith because the tag might be "v0.8.4" but title is "v0.8.4 - Foo"
            // Also ensure it matches the full version part to avoid v0.8 matching v0.8.4
            // A simple "startsWith" is usually safe if tags are distinct enough, 
            // but let's be cleaner: check if 'fullTitle' starts with version + space or is exactly version.
            if (fullTitle === version || fullTitle.startsWith(version + ' ') || fullTitle.startsWith(version + '-')) {
                capture = true;
                title = fullTitle;
                continue; // Skip the header line itself for the body
            }
        } else if (capture) {
            bodyLines.push(line);
        }
    }

    if (!title) {
        console.error(`Could not find entry for version ${version} in CHANGELOG.md`);
        process.exit(1);
    }

    // Trim leading/trailing whitespace from body
    const body = bodyLines.join('\n').trim();

    fs.writeFileSync('RELEASE_TITLE', title);
    fs.writeFileSync('RELEASE_BODY.md', body);

    console.log(`Extracted title: ${title}`);

} catch (err) {
    console.error('Error processing changelog:', err);
    process.exit(1);
}
