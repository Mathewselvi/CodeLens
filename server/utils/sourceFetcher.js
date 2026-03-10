const simpleGit = require('simple-git');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.cloneGithubRepo = async (repoUrl, targetDir) => {
  try {
    const git = simpleGit();
    await git.clone(repoUrl, targetDir);
    // Remove .git folder to avoid analyzing git internals
    const gitDir = path.join(targetDir, '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
    }
  } catch (error) {
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
};

exports.getGithubLanguages = async (repoUrl) => {
  try {
    const urlObj = new URL(repoUrl);
    const parts = urlObj.pathname.split('/').filter(p => p);
    if (parts.length >= 2) {
      const owner = parts[0];
      const repo = parts[1].replace('.git', '');
      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CodeLensAI-Analyzer'
        }
      });
      // response.data is an object like { "JavaScript": 15000, "HTML": 3500 }
      return Object.keys(response.data);
    }
  } catch (error) {
    console.warn(`Could not fetch exact languages from GitHub API for ${repoUrl}:`, error.message);
  }
  return null;
};
