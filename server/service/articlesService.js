const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data/article.json');

// 读取并解析 JSON 文件
const getArticlesData = () => {
  const jsonData = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(jsonData).RECORDS;
};

// 获取文章统计信息
const getArticleStats = () => {
  const articles = getArticlesData();
  const articleSum = articles.length;
  const privateArticleSum = articles.reduce((sum, article) => sum + (article.article_state === '2' ? 1 : 0), 0);
  const draftSum = articles.reduce((sum, article) => sum + (article.article_state === '3' ? 1 : 0), 0);
  return [{
    article_sum: articleSum,
    private_article_sum: privateArticleSum,
    draft_sum: draftSum
  }];
};

// 获取最早文章年份
const getOldestArticleYear = () => {
  const articles = getArticlesData();
  if (articles.length === 0) {
    return null;
  }
  // 排序并获取第一个
  articles.sort((a, b) => new Date(a.article_time) - new Date(b.article_time));
  return articles[0].article_time;
};

// 获取搜索结果
const getSearchResult = (year, month, categories, key) => {
  const articles = getArticlesData();
  let datePattern = year ? `${year}-` : '.*';
  if (month) {
    datePattern += month < 10 ? `0${month}` : month;
  }

  const filteredArticles = articles.filter(article => {
    const articleTimeMatches = new RegExp(datePattern).test(article.article_time);
    const categoriesMatches = new RegExp(categories).test(article.categories_id);
    const keyMatches = new RegExp(key).test(article.article_title);

    return articleTimeMatches && categoriesMatches && keyMatches;
  });

  return filteredArticles;
};

// 获取文章列表
const getArticleList = (params) => {
  let articles = getArticlesData();
  const currPage = params.currPage ? parseInt(params.currPage) : 1;
  const field = params.field || '';
  const key = params.key || '';
  const perPageArticle = parseInt(params.perPageArticle) || articles.length;
  const state = params.state ? parseInt(params.state) : null;
  const categoriesId = params.categoriesId ? parseInt(params.categoriesId) : null;
  const reduce = params.reduce ? parseInt(params.reduce) : 0;

  // 过滤
  if (categoriesId) {
    articles = articles.filter(article => article.categories_id === categoriesId.toString());
  }
  if (key) {
    const regex = new RegExp(key, 'i');
    articles = articles.filter(article => regex.test(article.article_title));
  }
  if (state !== null) {
    if( state === 2){
      articles = articles.filter(article => article.article_state === '0');
    } else if (state === 3) {
      articles = articles.filter(article => article.article_state === '1');
    }
  }

  // 缩减内容
  if (reduce) {
    articles = articles.map(article => {
      article.article_content = article.article_content.slice(0, reduce);
      return article;
    });
  }

  // 获取特定字段
  if (field) {
    const fields = field.split(',');
    articles = articles.map(article => {
      const filteredArticle = {};
      fields.forEach(f => {
        filteredArticle[f] = article[f];
      });
      return filteredArticle;
    });
  }

  // 分页
  const totalArticles = articles.length;
  const start = (currPage - 1) * perPageArticle;
  const paginatedArticles = articles.slice(start, start + perPageArticle);

  return paginatedArticles;
};


// 更新文章状态
const updateArticleState = (id, state) => {
  let articles = getArticlesData();
  const articleIndex = articles.findIndex(article => article.article_id === id);
  
  if (articleIndex !== -1) {
    articles[articleIndex].article_state = state;
    fs.writeFileSync(dataPath, JSON.stringify({ RECORDS: articles }, null, 2));
    return { success: true };
  }

  return { success: false, message: '文章不存在' };
};

// 删除文章
const deleteArticle = (id) => {
  let articles = getArticlesData();
  const articleIndex = articles.findIndex(article => article.article_id === id);

  if (articleIndex !== -1) {
    // 删除文章数据
    const deletedArticle = articles.splice(articleIndex, 1)[0];
    fs.writeFileSync(dataPath, JSON.stringify({ RECORDS: articles }, null, 2));
    // 删除文章的图片
    const imagesPath = path.join(__dirname, '../upload/', `${id}`);
    if (fs.existsSync(imagesPath)) {
      const files = fs.readdirSync(imagesPath);
      files.forEach(file => {
        const filePath = path.join(imagesPath, file);
        fs.unlinkSync(filePath);
      });
      fs.rmdirSync(imagesPath);
    }

    return { success: true, deletedArticle };
  }

  return { success: false, message: '文章不存在' };
};

// 添加文章
const addArticle = (article) => {
  let articles = getArticlesData();
  const nextId = articles.length > 0 ? parseInt(articles[articles.length - 1].article_id) + 1 : 1;
  const newArticle = {
    article_id: nextId.toString(),
    article_title: article.title,
    article_content: article.content,
    article_time: article.date,
    categories_id: article.categoriesId.toString(),
    tags: article.tags.join()
  };
  articles.push(newArticle);
  fs.writeFileSync(dataPath, JSON.stringify({ RECORDS: articles }, null, 2));
  return { success: true, insertId: nextId };
};

// 更新文章
const updateArticle = (article) => {
  let articles = getArticlesData();
  const articleIndex = articles.findIndex(a => a.article_id === article.id.toString());

  if (articleIndex !== -1) {
    articles[articleIndex].article_title = article.title;
    articles[articleIndex].article_content = article.content;
    articles[articleIndex].article_time = article.date;
    articles[articleIndex].categories_id = article.categoriesId.toString();
    articles[articleIndex].tags = article.tags.join();
    fs.writeFileSync(dataPath, JSON.stringify({ RECORDS: articles }, null, 2));
    return { success: true };
  }

  return { success: false, message: '文章不存在' };
};

// 根据文章ID获取文章
const getArticleById = (articleId) => {
  let articles = getArticlesData();
  const article = articles.find(article => article.article_id == articleId);
  // 以数组返回
  return article ? [article] : [];
}

module.exports = {
  getArticleStats,
  getOldestArticleYear,
  getSearchResult,
  getArticleList,
  updateArticleState,
  deleteArticle,
  updateArticle,
  addArticle,
  getArticleById
};
