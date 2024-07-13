const express = require('express');
const router = express.Router();
const categoriesService = require('../service/categoriesService');
const articlesService = require('../service/articlesService');

// 获取目录
router.get('/api/share/categories', (req, res) => {
	try {
		const categories = categoriesService.getCategoriesData();
		res.json({
			state: 1,
			data: categories
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
});

// 获取总的文章数或当前页的文章数
router.get('/api/share/page_aritcle', (req, res) => {
	const params = req.query;
	try {
		const articles = articlesService.getArticleList(params);
		res.json({
			state: 1,
			data: articles
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
});


// 获取文章
router.get('/api/share/get_article', (req, res) => {
	const articleId = req.query.id;
	const article = articlesService.getArticleById(articleId);
  
	if (article) {
	  res.json({
		state: 1,
		data: article
	  });
	} else {
	  res.status(404).json({
		state: 0,
		message: '文章不存在'
	  });
	}
  });

module.exports = router;
