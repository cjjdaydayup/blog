const express = require('express');
const router = express.Router();
const fs = require('fs');
const articlesService = require('../service/articlesService');

// 获取文章总数、私密文章数、草稿数
router.get('/api/admin/article_mgt/stat_article', (req, res) => {
	try {
		const stats = articlesService.getArticleStats();
		res.json({
			state: 1,
			data: stats
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
});

// 获取最早的文章年份
router.get('/api/admin/article_mgt/oldest_year', (req, res) => {
	try {
		const oldestYear = articlesService.getOldestArticleYear();
		if (oldestYear) {
			res.json({
				state: 1,
				data: [{ article_time: oldestYear }]
			});
		} else {
			res.json({
				state: 1,
				data: []
			});
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
});

// 获取搜索结果
router.get('/api/admin/article_mgt/search_result', (req, res) => {
	const year = req.query.year || '';
	const month = req.query.month || '';
	const categories = req.query.categories || '.*';
	const key = req.query.key || '.*';

	try {
		const searchResult = articlesService.getSearchResult(year, month, categories, key);
		res.json({
			state: 1,
			data: searchResult
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
});

// 删除文章
router.get('/api/admin/article_mgt/del', (req, res) => {
	const id = req.query.id;
	try {
		const result = articlesService.deleteArticle(id);

		if (result.success) {
			res.json({ state: 1 });
		} else {
			res.status(404).json({ state: 0, message: result.message });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
});

module.exports = router;