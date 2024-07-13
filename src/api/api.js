import axios from 'axios';
import store from '../store';
import router from '@/router';
import Vue from 'vue';
const vm = new Vue();
let base = null;
if (process.env.NODE_ENV === 'development') {
	base = process.env.SERVER_ENV ? 'http://127.0.0.1:3000' : '/proxy';
}
// 保存重定向结果
let redirect = '';
// 超时消息框是否被占用标志
// let flag = false;
// 设置请求超时时间、请求地址
axios.defaults.timeout = 20000;
axios.defaults.baseURL = base;

// 请求拦截
axios.interceptors.request.use(
	response => {
		if (response.url.match(/\/api\/admin/)) {
			response.headers.authorization = 'Bearer ' + window.localStorage.token;
		}
		return response;
	},
	error => {
		return Promise.reject(error);
	}
);

// 响应拦截
axios.interceptors.response.use(undefined, error => {
	// 超时请求处理
	var originalRequest = error.config;
	if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {
		vm.$myMessage({
			text: '请求超时！',
			type: 'error'
		});
		originalRequest._retry = true;
		return Promise.reject(error);
	}

	if (error.response) {
		let text = '';
		// token过期处理
		if (error.response.status) {
			switch (error.response.status) {
				case 401:
					text = 'token过期';
					// 防止重复跳转问题
					if (router.currentRoute.name === 'login' || router.currentRoute.name === redirect) {
						break;
					}
					store.commit('removeToken');
					redirect = router.currentRoute.name;
					router.replace({
						name: 'login',
						query: { redirect: router.currentRoute.name }
					});
					break;
				case 500:
					text = '内部服务器错误';
					break;
				case 504:
					text = '邮箱发送失败';
					break;
				default:
					text = error.toString();
			}
			vm.$myMessage({
				text,
				type: 'error'
			});
		}
	}
	return Promise.reject(error);
});

export const getBaseUrl = () => {
	return base;
}

// 登陆验证和获取token
export const requestLogin = params => {
	return axios.post(`/api/login`, params).then(res => res.data);
};

// 登陆验证和获取token
export const requestRegister = params => {
	return axios.post(`/api/register`, params).then(res => res.data);
};


// 文章管理模块
export const getStatArticle = () => {
	return axios.get(`/api/admin/article_mgt/stat_article`).then(res => res.data);
};
export const getOldestYear = () => {
	return axios.get(`/api/admin/article_mgt/oldest_year`).then(res => res.data);
};
export const changeArticeState = params => {
	return axios.patch(`/api/admin/article_mgt/update_article_state`, params).then(res => res.data);
};
export const delArticle = params => {
	return axios.get(`/api/admin/article_mgt/del`, params).then(res => res.data);
};
export const getArticle = params => {
	return axios.get(`/api/share/get_article`, params).then(res => res.data);
};
export const requestSearchResult = params => {
	return axios.get(`/api/admin/article_mgt/search_result`, params).then(res => res.data);
};


// 专栏管理模块
export const updateCategories = params => {
	return axios.patch(`/api/admin/categories/update`, params).then(res => res.data);
};
export const delCategories = params => {
	return axios.delete(`/api/admin/categories/del`, params).then(res => res.data);
};
export const addCategories = params => {
	return axios.post(`/api/admin/categories/add`, params).then(res => res.data);
};



// 写文章模块
export const uploadFile = (params, config) => {
	return axios.post(`/api/admin/edit/upload`, params, config).then(res => res.data);
};
export const saveArticle = params => {
	return axios.post(`/api/admin/edit/add`, params).then(res => res.data);
};

// 前台
// 首页
export const getArticleSum = (params) => {
	return axios.get(`/api/front/get_article_sum`, params).then(res => res.data);
};
// 文章详情模块
export const getPreId = (params) => {
	return axios.get(`/api/front/get_pre_id`, params).then(res => res.data);
};
export const getNextId = (params) => {
	return axios.get(`/api/front/get_next_id`, params).then(res => res.data);
};


// 前后台系统,都会用到
export const getCategories = () => {
	return axios.get(`/api/share/categories`).then(res => res.data);
};
export const getPageArticle = params => {
	return axios.get(`/api/share/page_aritcle`, params).then(res => res.data);
};
export const getCommentList = (params) => {
	return axios.get(`/api/share/comment_list`, params).then(res => res.data);
};
export const sendReply = params => {
	return axios.post(`/api/share/save_reply`, params).then(res => res.data);
};


// 用户管理模块
export const getAllUsers = () => {
	return axios.get('/api/admin/users');
};

export const updateUser = (params) => {
	return axios.patch('/api/admin/user', params);
};

export const deleteUser = (params) => {
	return axios.delete('/api/admin/user?id='+params);
};

export const addUser = (params) => {
	return axios.post('/api/admin/user', params);
};