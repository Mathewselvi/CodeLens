const mongoose = require('mongoose');

const analysisReportSchema = new mongoose.Schema({
    repo_url: { type: String, required: true },
    languages_detected: [{ type: String }],
    ai_scores: { type: Map, of: Number }, // language -> probability %
    overall_ai_score: { type: Number },
    bugs: { type: Map, of: Number }, // language -> issue count
    bug_details: [{
        file: String,
        line: Number,
        description: String,
        fix: String,
        snippet: String
    }],
    security_issues: { type: Number },
    performance_issues: { type: Number },
    suggestions: [{ type: String }],
    created_at: { type: Date, default: Date.now }
}, { collection: 'analysis_reports' });

const AnalysisReport = mongoose.model('AnalysisReport', analysisReportSchema);

module.exports = AnalysisReport;
