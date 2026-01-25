const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');

try {
    const content = fs.readFileSync(changelogPath, 'utf8');
    const lines = content.split('\n');

    const releases = [];
    let currentRelease = null;
    const versionRegex = /^##\s+(v\d+\.\d+\.\d+.*)$/i;

    // Parse ALL releases from Changelog
    for (const line of lines) {
        const match = line.match(versionRegex);
        if (match) {
            if (currentRelease) {
                releases.push(currentRelease);
            }
            currentRelease = {
                title: match[1].trim(),
                tag: match[1].split(' ')[0], // "v0.8.4" from "v0.8.4 - Foo"
                bodyLines: []
            };
        } else if (currentRelease) {
            currentRelease.bodyLines.push(line);
        }
    }
    if (currentRelease) releases.push(currentRelease);

    console.log(`Found ${releases.length} releases in CHANGELOG.md`);

    // Update each release via gh CLI
    for (const release of releases) {
        const body = release.bodyLines.join('\n').trim();
        if (!body) continue;

        const notesFile = `NOTES_${release.tag}.md`;
        fs.writeFileSync(notesFile, body);

        console.log(`Updating ${release.tag}...`);
        try {
            // Check if release exists
            execSync(`gh release view ${release.tag}`, { stdio: 'ignore' });

            // Update it
            execSync(`gh release edit ${release.tag} --title "${release.title}" --notes-file ${notesFile}`);
            console.log(`✓ Updated ${release.tag}`);
        } catch (e) {
            console.log(`⚠ Release ${release.tag} not found on GitHub, skipping.`);
        }

        fs.unlinkSync(notesFile);
    }

} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
