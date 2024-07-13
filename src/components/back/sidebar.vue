<template>
	<div class="navbar">
	  <router-link to="/admin/back_home">首页</router-link>
	  <router-link to="/admin/article_mgt">博客管理</router-link>
	  <router-link to="/admin/edit_article">创建博客</router-link>
	  <router-link to="/admin/categories_mgt">专栏管理</router-link>
	  <router-link v-if="isAdmin" to="/admin/user_management">用户管理</router-link>
	</div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
	name: 'Sidebar',
	computed: {
	  ...mapState(['saveRole']),
	  isAdmin() {
		return this.saveRole === 'admin';
	  }
	}
  };
  </script>
  
  <style scoped>
  .navbar {
	background-color: #2c3e50;
	height: 60px; /* 确保与BackHeader高度一致 */
	display: flex;
	justify-content: flex-start; /* 左对齐 */
	align-items: center;
	padding: 0 20px; /* 内边距，确保与BackHeader对齐 */
	border-bottom: 2px solid #34495e;
	width: 100%; /* 设置宽度为100%，占据整个页面宽度 */
	box-sizing: border-box; /* 包含内边距和边框在内 */
  }
  
  .navbar a {
	color: #ecf0f1;
	text-decoration: none;
	padding: 0 15px; /* 上下对齐 */
	height: 100%; /* 使链接占满父容器高度 */
	display: flex;
	align-items: center;
	transition: background-color 0.3s;
  }
  
  .navbar a:hover {
	background-color: #34495e;
	border-radius: 4px;
  }
  </style>
  
  
   
  