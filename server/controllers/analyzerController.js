const AnalysisReport = require('../models/Report');
const { analyzeSourceCode } = require('../utils/coreAnalyzer');
const { cloneGithubRepo, getGithubLanguages } = require('../utils/sourceFetcher');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

// Ensure tmp directory exists using OS tmp dir for serverless compatibility
const TMP_DIR = path.join(os.tmpdir(), 'codelens-tmp');
if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
}

exports.analyzeRepository = async (req, res, next) => {
    const { repoUrl } = req.body;

    if (!repoUrl || !repoUrl.includes('github.com')) {
        return res.status(400).json({ error: 'Valid GitHub repository URL is required' });
    }

    const workDir = path.join(TMP_DIR, uuidv4());

    try {
        // 1. Fetch Source Code
        await cloneGithubRepo(repoUrl, workDir);
        const exactGithubLanguages = await getGithubLanguages(repoUrl);

        // 2. Run Comprehensive Analysis
        const analysisResults = await analyzeSourceCode(workDir, exactGithubLanguages);

        // 3. Save Report
        const report = new AnalysisReport({
            repo_url: repoUrl,
            ...analysisResults
        });

        await report.save();

        // Cleanup
        fs.rmSync(workDir, { recursive: true, force: true });

        // 4. Return Output
        res.json({ message: 'Analysis successful', reportId: report._id });

    } catch (error) {
        if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true, force: true });
        next(error);
    }
};

exports.getReport = async (req, res, next) => {
    try {
        const report = await AnalysisReport.findById(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json(report);
    } catch (error) {
        next(error);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const history = await AnalysisReport.find().sort({ created_at: -1 }).limit(50);
        res.json(history);
    } catch (error) {
        next(error);
    }
};

exports.deleteReport = async (req, res, next) => {
    try {
        const report = await AnalysisReport.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json({ message: 'Report deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.clearHistory = async (req, res, next) => {
    try {
        await AnalysisReport.deleteMany({});
        res.json({ message: 'History cleared successfully' });
    } catch (error) {
        next(error);
    }
};
