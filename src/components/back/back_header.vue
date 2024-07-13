<template>
	<div>
	  <header class="header-container clearfix">
		<div class="container">
		  <div class="logo">{{ sysName }}</div>
		  <div class="user">
			<span>Hi~</span>
			<div>
			  <div class="user-pic"></div>
			  <ul class="dropdown">
				<li @click="handleShowDialog">退出登陆</li>
			  </ul>
			</div>
		  </div>
		</div>
	  </header>
	  <Dialog :info="dialogInfo" @dialogResult="logout" ref="dialog"></Dialog>
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		sysName: '小型博客系统',
		dialogInfo: {
		  tip: '确认退出吗?',
		  flag: 1
		},
	  };
	},
	methods: {
	  handleShowDialog() {
		this.$refs.dialog.show = true;
	  },
	  logout() {
		this.$store.commit('removeToken');
		this.$router.go({ name: 'login' });
	  }
	}
  };
  </script>
  
  <style scoped>
  .header-container {
	background-color: #2c3e50;
	height: 60px; /* 确保与导航栏高度一致 */
	line-height: 60px;
	position: relative;
	padding: 0 20px;
	color: #ecf0f1;
	border-bottom: 2px solid #34495e;
  }
  
  .logo {
	font-size: 22px;
	font-weight: bold;
	float: left;
  }
  
  .user {
	float: right;
  }
  
  .user span {
	font-size: 14px;
	padding-right: 5px;
  }
  
  .user > div {
	display: inline-block;
	position: relative;
  }
  
  .user .user-pic {
	width: 50px;
	height: 50px;
	background-size: 46px 46px;
	border: 2px solid #fff;
	cursor: pointer;
  }
  
  .user:hover ul.dropdown {
	display: block;
  }
  
  ul.dropdown {
	font-size: 14px;
	line-height: 2.5;
	position: absolute;
	top: 60px;
	color: #606266;
	border: 1px solid #ebeef5;
	box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
	right: 0px;
	white-space: nowrap;
	background: #fff;
	display: none;
	z-index: 10;
  }
  
  ul.dropdown li {
	padding: 0 17px;
	cursor: pointer;
  }
  
  ul.dropdown li:hover {
	background-color: #ecf5ff;
	color: #66b1ff;
  }
  </style>
  