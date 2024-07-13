const express = require('express');
const router = express.Router();
const categoriesService = require('../service/categoriesService');

// 更新目录名称
router.patch('/api/admin/categories/update', (req, res) => {
  let { id, name } = req.body;
  console.log(id, name);
  const result = categoriesService.updateCategory(id, name);
  if (result.success) {
    res.json({ state: 1 });
  } else {
    res.status(400).json({ state: 0, message: result.message });
  }
});

// 删除目录,将对应文章的归属目录置为空
router.delete('/api/admin/categories/del', (req, res) => {
  let { id } = req.query;
  const result = categoriesService.deleteCategory(id);
  if (result.success) {
    res.json({ state: 1 });
  } else {
    res.status(400).json({ state: 0, message: result.message });
  }
});

// 增加目录
router.post('/api/admin/categories/add', (req, res) => {
  let { name } = req.body;
  const result = categoriesService.addCategory(name);
  if (result.success) {
    res.json({ state: 1, data: result.newCategory });
  } else {
    res.status(400).json({ state: 0, message: result.message });
  }
});

module.exports = router;
