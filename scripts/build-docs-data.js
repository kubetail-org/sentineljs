const fs = require('fs');
const path = require('path');

const examplesDir = path.join(__dirname, '../examples');
const outputDir = path.join(__dirname, '../pages');

// 1. CLEANUP: Delete existing pages to prevent "ghost" files
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir);

const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.html'));

let indexContent = '---\ntitle: Overview\ngroup: Examples\nweight: 0\n---\n# Examples\n\nHere are the live examples for SentinelJS.\n\n';

files.forEach(file => {
  const content = fs.readFileSync(path.join(examplesDir, file), 'utf8');
  
  // Convert "async-example.html" -> "Async Example"
  const title = file
    .replace(/-/g, ' ')
    .replace('.html', '')
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letters

  // 2. FRONTMATTER: Add metadata for TypeDoc
  // "group": Groups all these under "Examples" in the sidebar
  const frontmatter = `---
title: ${title}
group: Examples
---\n`;

  const mdContent = frontmatter + 
    `# ${title}\n\n` +
    `This example demonstrates ${title.toLowerCase()}.\n\n` +
    `## Source Code\n` +
    '```html\n' + content + '\n```\n';

  fs.writeFileSync(path.join(outputDir, `${file.replace('.html', '.md')}`), mdContent);
  
  indexContent += `* [${title}](${file.replace('.html', '.md')})\n`;
});

// Write the Index/Overview file
fs.writeFileSync(path.join(outputDir, 'Examples.md'), indexContent);

// Create .nojekyll for GitHub Pages
const docsDir = path.join(__dirname, '../docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir);
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

console.log(`Successfully generated ${files.length} doc pages.`);