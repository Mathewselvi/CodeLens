const fs = require('fs');
const path = require('path');

const EXTENSION_TO_LANG = {
  '.js': 'JavaScript',
  '.jsx': 'JavaScript',
  '.ts': 'TypeScript',
  '.tsx': 'TypeScript',
  '.py': 'Python',
  '.html': 'HTML',
  '.css': 'CSS',
  '.php': 'PHP',
  '.java': 'Java',
  '.cs': 'C#',
  '.go': 'Go',
  '.rb': 'Ruby',
  '.c': 'C',
  '.cpp': 'C++',
  '.h': 'C/C++',
  '.swift': 'Swift',
  '.kt': 'Kotlin',
  '.dart': 'Dart',
  '.rs': 'Rust',
  '.sh': 'Shell',
  '.json': 'JSON',
  '.xml': 'XML',
  '.yaml': 'YAML',
  '.yml': 'YAML',
  '.md': 'Markdown',
  '.sql': 'SQL',
  '.vue': 'Vue'
};

const DANGEROUS_PATTERNS = [
  /api[_-]?key/i,
  /secret/i,
  /password/i,
  /eval\(/,
  /exec\(/
];

const AI_PATTERNS = {
  // Common AI hallucination or strictly structured patterns
  JavaScript: [/for \(let i = 0; i < [^;]+; i\+\+\)/, /console\.log\("[^"]+"\)/, /function [a-zA-Z]+\([^)]*\) \{/, /const\s+[a-zA-Z]+\s*=\s*\([^)]*\)\s*=>\s*\{/],
  Python: [/def [a-zA-Z_]+\([^)]*\):/, /print\("[^"]+"\)/, /if __name__ == "__main__":/],
  HTML: [/<!DOCTYPE html>/, /<meta name="viewport"/, /<div class="container">/],
  CSS: [/:root \{/, /display: flex;/, /justify-content: center;/]
};

const BUG_DETAILS = {
  JavaScript: [
    { pattern: /debugger;/, desc: 'Leftover debugger statement', fix: 'Remove `debugger;` statement before deploying to production.' },
    { pattern: /console\.log/, desc: 'Leftover console.log debug statement', fix: 'Remove or replace `console.log` with a robust logging framework.' },
    { pattern: /==\s+(?!=)/, desc: 'Use of loose equality (==)', fix: 'Replace `==` with strict equality `===` to prevent unintended type coercion.' }
  ],
  Python: [
    { pattern: /except Exception:/, desc: 'Broad exception catch', fix: 'Catch specific exceptions instead of a broad `Exception` to avoid hiding bugs.' },
    { pattern: /import \*/, desc: 'Wildcard import', fix: 'Explicitly import only the modules/functions you need.' }
  ],
  HTML: [
    { pattern: /<img(?![^>]*alt=)/, desc: 'Missing alt attribute on img tag', fix: 'Add descriptive `alt="..."` attribute for accessibility.' },
    { pattern: /<a(?![^>]*href=)/, desc: 'Missing href attribute on anchor tag', fix: 'Add a valid `href="..."` attribute to make the link functional and accessible.' }
  ],
  CSS: [
    { pattern: /!important/, desc: 'Use of !important', fix: 'Avoid `!important` as it breaks natural CSS cascading. Refactor specificity instead.' }
  ]
};

// Generic read dir deeply
const readDirDeep = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Ignore common modules/build folders
      if (['node_modules', 'venv', 'env', 'dist', 'build', '.git'].includes(file)) continue;
      readDirDeep(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
};

exports.analyzeSourceCode = async (dirPath, explicitLanguages = null) => {
  const files = readDirDeep(dirPath);

  const languagesDetected = new Set();

  // If GitHub API gave us exact languages, seed the set with them!
  if (explicitLanguages && explicitLanguages.length > 0) {
    explicitLanguages.forEach(lang => languagesDetected.add(lang));
  }

  const fileContents = [];

  // 1. Language Detection & Read content
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const lang = EXTENSION_TO_LANG[ext];

    if (lang) {
      languagesDetected.add(lang);
      try {
        const content = fs.readFileSync(file, 'utf8');
        const size = fs.statSync(file).size;
        fileContents.push({ path: file, lang, content, size, ext });
      } catch (err) {
        // Skip unreadable files
      }
    }
  }

  const langsArray = Array.from(languagesDetected);

  // Initialize aggregates
  const ai_scores = Object.fromEntries(langsArray.map(l => [l, 0]));
  const bugs = Object.fromEntries(langsArray.map(l => [l, 0]));
  const fileCounts = Object.fromEntries(langsArray.map(l => [l, 0]));

  let security_issues = 0;
  let performance_issues = 0;
  let totalAiProbabilityScore = 0;
  const suggestions = new Set();
  const bug_list = [];

  // 2. Multi-stage code analysis
  for (const fileObj of fileContents) {
    const { lang, content, size } = fileObj;
    fileCounts[lang]++;

    // -- A: Performance Checks
    if (size > 500 * 1024) { // > 500KB
      performance_issues++;
      suggestions.add(`Optimize large files: ${path.basename(fileObj.path)} is over 500KB.`);
    }

    // -- B: Security Checks
    for (const pattern of DANGEROUS_PATTERNS) {
      const match = content.match(pattern);
      if (match) {
        security_issues++;
        suggestions.add(`Potential sensitive data or unsafe pattern exposed matching '${match[0]}' in ${path.basename(fileObj.path)}.`);
      }
    }

    // -- C: Bug Detection
    const bDetails = BUG_DETAILS[lang] || [];
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      for (const b of bDetails) {
        if (b.pattern.test(lines[i])) {
          bugs[lang]++;
          bug_list.push({
            file: path.relative(dirPath, fileObj.path),
            line: i + 1,
            description: b.desc,
            fix: b.fix,
            snippet: lines[i].trim().substring(0, 150)
          });
        }
      }
    }

    // -- D: AI Probability Check (Simulated for this prototype)
    const aiPatterns = AI_PATTERNS[lang] || [];
    let matchCount = 0;
    for (const pattern of aiPatterns) {
      if (pattern.test(content)) matchCount++;
    }

    // Highly simplistic heuristic: repetitive/template code often generated
    // More matches = higher chance of AI generation
    let prob = 10; // base logic prob
    if (content.split('\n').length > 50) prob += 15; // AI writes long files
    if (content.includes('//') && content.match(/\/\//g).length > 10) prob += 20; // Excessive comments
    if (matchCount > 0) prob += (15 * matchCount);

    // Add random variance typical of AI models
    prob += Math.floor(Math.random() * 20);

    if (prob > 95) prob = 95;

    ai_scores[lang] += prob;
  }

  // Aggregate results
  for (const lang of langsArray) {
    if (fileCounts[lang] > 0) {
      ai_scores[lang] = Math.round(ai_scores[lang] / fileCounts[lang]);
      totalAiProbabilityScore += ai_scores[lang];
    }
  }

  const overall_ai_score = langsArray.length > 0
    ? Math.round(totalAiProbabilityScore / langsArray.length)
    : 0;

  // Suggestion Engine Additions
  if (bugs['JavaScript'] > 0) suggestions.add('Improve variable naming and remove arbitrary console/debuggers.');
  if (bugs['HTML'] > 0) suggestions.add('Add missing accessibility attributes (like alt) to HTML elements.');
  if (performance_issues > 0) suggestions.add('Reduce code duplication and optimize large assets.');
  if (langsArray.length === 0) suggestions.add('No recognized source code found. Check the provided repository/URL.');

  return {
    languages_detected: langsArray,
    ai_scores,
    overall_ai_score,
    bugs,
    bug_details: bug_list,
    security_issues,
    performance_issues,
    suggestions: Array.from(suggestions)
  };
};
