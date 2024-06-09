const express = require('express');
const router = express.Router();
const controller = require('../controllers/index');
const quizzes = controller.quizzes;
const middleware = require('../middleware/index');

router.get('/all',  middleware.auth.isAuthenticated ,middleware.redisCache.getCache,quizzes.get_all)
router.get('/metrics',  middleware.auth.isAuthenticated, quizzes.getMetrics)
router.get('/get/:id',  middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:GetQuizzes'), quizzes.get)
router.post('/create',  middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:CreateQuizzes'),quizzes.create)
router.get('/count',  middleware.auth.isAuthenticated, quizzes.count)
router.post('/delete/:id', middleware.auth.isAuthenticated, middleware.auth.hasPermission('admin:RemoveQuizzes'),quizzes.remove)
router.get('/activity', middleware.auth.isAuthenticated, quizzes.getActivity)
router.get('/questions/:id', middleware.auth.isAuthenticated, quizzes.getQuestion)
router.get('/competition/submissions', middleware.auth.isAuthenticated, quizzes.getCompetitionSubmissions)
router.get('/competition/submissions/:id', middleware.auth.isAuthenticated, quizzes.getCompetitionSubmission)
router.post('/competition/:submissionId/grade', middleware.auth.isAuthenticated, quizzes.gradeSubmission)
router.post('/attempt/submit/:id', middleware.auth.isAuthenticated, quizzes.submit)

module.exports = router;
