<template>
	<transition v-if="!$route.meta.noNeedAdmin" name="fade" mode="out-in">
	  <div class="wrapper">
		<BackHeader></BackHeader>
		<Sidebar></Sidebar>
		<main>
		  <div class="container">
			<transition name="fade" mode="out-in">
			  <div class="view-box">
				<router-view v-if="isRouterAlive" :key="$route.path + $route.query.t"></router-view>
			  </div>
			</transition>
		  </div>
		</main>
	  </div>
	</transition>
	<transition v-else name="fade" mode="out-in">
	  <router-view></router-view>
	</transition>
  </template>
  
  <script>
  import BackHeader from '@/components/back/back_header';
  import Sidebar from '@/components/back/sidebar';
  
  export default {
	components: { BackHeader, Sidebar },
	provide() {
	  return {
		reload: this.reload
	  };
	},
	data() {
	  return {
		isRouterAlive: true
	  };
	},
	methods: {
	  reload() {
		this.isRouterAlive = false;
		this.$nextTick(() => {
		  this.isRouterAlive = true;
		});
	  }
	}
  };
  </script>
  
  <style scoped>
  @import '../../assets/css/back.css';
  
  .wrapper {
	margin-bottom: 100px;
  }
  
  main {
	width: 100%;
	padding-top: 0px;
	padding-bottom: 30px;
  }
  
  .container {
	width: 100%;
	max-width: none;
	padding: 0px;
  }
  
  .view-box {
	background: #fff;
	width: 100%;
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .view-box h2 {
	margin-top: 0;
  }
  </style>
   