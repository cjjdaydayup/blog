
const login = require('./login');
const editArticle = require('./editArticle');
const catMgt = require('./catMgt');
const articleMgt = require('./articleMgt');

//  公共api
const share = require('./share');

module.exports = (app) => {
	app.use(login);
	app.use(editArticle);
	app.use(catMgt);
	app.use(articleMgt);
	app.use(share);
}