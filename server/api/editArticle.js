const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
var path = require('path');
const articlesService = require('../service/articlesService');


// 上传图片
router.post('/api/admin/edit/upload', (req, res, next) => {
	// 返回的地址
	let form = new multiparty.Form({ uploadDir: 'upload' });  
    form.parse(req, (err, fields, files) => {
		if(err) {
			console.log(err);
		} else {
			let filePath = files.file[0].path;
			db.query(sqlMap.blogImages.add, [filePath, -1]).then(rows => {
				res.json({
			    state: 1,
					data: {
						imgSrc: filePath,
						imgId: rows.insertId
					}
				});
			}).catch(err => {
				console.log(err);
			})
		}
	})
});

// 增加或更新文章
router.post('/api/admin/edit/add', (req, res) => {
	const params = req.body;
	const imageId = params.imageId;
	const article = params.article;
  
	// 更新已有文章
	if (article.id) {
	  try {
		const result = articlesService.updateArticle(article);
		if (result.success) {
		  if (imageId.length) {
			db.query(sqlMap.blogImages.update, [article.id, imageId]).catch(err => {
			  console.log(err);
			});
		  }
		  res.json({ state: 1 });
		} else {
		  res.status(404).json({ state: 0, message: result.message });
		}
	  } catch (err) {
		console.log(err);
		res.status(500).json({ state: 0, message: 'Internal Server Error' });
	  }
	  return;
	}
  
	// 发表新文章
	try {
	  const result = articlesService.addArticle(article);
	  if (result.success) {
		if (imageId.length) {
		  db.query(sqlMap.blogImages.update, [result.insertId, imageId]).catch(err => {
			console.log(err);
		  });
		}
		res.json({ state: 1, data: result.insertId });
	  } else {
		res.status(404).json({ state: 0, message: result.message });
	  }
	} catch (err) {
	  console.log(err);
	  res.status(500).json({ state: 0, message: 'Internal Server Error' });
	}
  });

module.exports = router;