const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tokenInfo = require('../token/token');
const sha1 = require('sha1');
const userService = require('../service/userService');

// 创建token
const createToken = (id) => {
	return jwt.sign(
		{ id },
		tokenInfo.secret,
		{ expiresIn: tokenInfo.expiresIn });
};

// 登陆验证
router.post('/api/login', (req, res, next) => {
	let username = req.body.username;
	let password = sha1(req.body.password + 'czl_blog');

	const isLogin = userService.validateUser(username, password);
	if (isLogin != null) {
		// 返回token
		const token = createToken(isLogin.user_id);
		res.json({
			state: 1,
			data: token
		});
	} else {
		res.json({
			state: 0,
			message: "登陆失败，用户名或密码错误！"
		});
	}
});


// 注册用户
router.post('/api/register', (req, res, next) => {
	const newUser = req.body;
	newUser.user_password = sha1(newUser.user_password + 'czl_blog');
	newUser.user_email = ''
	newUser.user_sign = ''
	newUser.user_description = ''
	newUser.sign = "czl_blog"
	const result = userService.registerUser(newUser);
	if (result) {
		res.json({
			state: 1,
			data: "注册成功"
		});
	} else {
		res.json({
			state: 0,
			message: "注册失败"
		});
	}
});


// 获取用户
router.get('/api/admin/user', (req, res) => {
	const userId = req.query.id;
	const user = userService.getUserById(userId);
	if (user) {
		res.json({
			state: 1,
			data: user
		});
	} else {
		res.status(404).json({
			state: 0,
			message: 'User not found'
		});
	}
});

// 获取所有用户
router.get('/api/admin/users', (req, res) => {
	const users = userService.getAllUsers();
	res.json({
		state: 1,
		data: users
	});
});

// 修改用户
router.patch('/api/admin/user', (req, res) => {
	const userId = req.body.user_id;
	const newUserInfo = req.body;

	const user = userService.getUserById(userId);
	if (user) {
		// 判断密码是否一致
		let newPassword = newUserInfo.user_password;
		if(newPassword != user.user_password){
			newUserInfo.user_password = sha1(newPassword + 'czl_blog');
		}
		const success = userService.updateUserById(userId, newUserInfo);
		if (success) {
			res.json({
				state: 1,
				message: 'User updated successfully'
			});
		} else {
			res.status(404).json({
				state: 0,
				message: 'User not found'
			});
		}
	} else {
		res.status(404).json({
			state: 0,
			message: 'User not found'
		});
	}


});

// 删除用户
router.delete('/api/admin/user', (req, res) => {
	const userId = req.query.id;

	const success = userService.deleteUserById(userId);
	if (success) {
		res.json({
			state: 1,
			message: 'User deleted successfully'
		});
	} else {
		res.status(404).json({
			state: 0,
			message: 'User not found'
		});
	}
});

router.post('/api/admin/user', (req, res, next) => {
	const newUser = req.body;
	newUser.user_password = sha1(newUser.user_password + 'czl_blog');
	newUser.sign = "czl_blog"
	const result = userService.registerUser(newUser);
	if (result) {
		res.json({
			state: 1,
			data: "新增成功"
		});
	} else {
		res.json({
			state: 0,
			message: "新增失败"
		});
	}
});

module.exports = router;