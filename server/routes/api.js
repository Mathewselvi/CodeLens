const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    analyzeRepository,
    getReport,
    getHistory,
    deleteReport,
    clearHistory
} = require('../controllers/analyzerController');

// APIs based on spec
router.post('/analyze/repository', analyzeRepository);

router.get('/report/:id', getReport);
router.get('/history', getHistory);
router.delete('/report/:id', deleteReport);
router.delete('/history', clearHistory);

module.exports = router;
