const AdmZip = require('adm-zip');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

exports.cloneGithubRepo = async (repoUrl, targetDir) => {
  try {
    const urlObj = new URL(repoUrl);
    const parts = urlObj.pathname.split('/').filter(p => p);
    if (parts.length < 2) throw new Error("Invalid repo URL");
    const owner = parts[0];
    const repo = parts[1].replace('.git', '');

    const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball`;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const response = await axios({
      method: 'GET',
      url: zipUrl,
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'CodeLensAI-Analyzer'
      }
    });

    const zipFilePath = path.join(targetDir, 'repo.zip');
    fs.writeFileSync(zipFilePath, response.data);

    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(targetDir, true);

    // Clean up zip
    fs.rmSync(zipFilePath, { force: true });

  } catch (error) {
    throw new Error(`Failed to download repository: ${error.message}`);
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
