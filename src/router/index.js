import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';

const Admin = resolve => require.ensure([], () => resolve(require('@/views/back/admin')), 'admin');
const EditArticle = resolve => require.ensure([], () => resolve(require('@/views/back/edit_article')), 'editArticle');
const ArticleMgt = resolve => require.ensure([], () => resolve(require('@/views/back/article_mgt')), 'articleMgt');
const CategoriesMgt = resolve => require.ensure([], () => resolve(require('@/views/back/categories_mgt')), 'categoriesMgt');
const BackHome = resolve => require.ensure([], () => resolve(require('@/views/back/back_home')), 'backHome');

const Login = resolve => require.ensure([], () => resolve(require('@/views/back/login')), 'login');
const UserManagement = resolve => require.ensure([], () => resolve(require('@/views/back/user_management')), 'userManagement');

const ArticleDetail = resolve => require.ensure([], () => resolve(require('@/views/back/article_detail')), 'articleDetail');
const NoPage = resolve => require.ensure([], () => resolve(require('@/views/404')), 'noPage');

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/admin',
      redirect: '/admin/back_home',
      component: Admin,
      children: [
        { path: 'back_home', name: 'back_home', component: BackHome, icon: 'home', meta: { requireAuth: true, title: '首页' } },
        { path: 'article_mgt', name: 'article_mgt', component: ArticleMgt, icon: 'instruction', meta: { requireAuth: true, title: '博客管理' } },
        { path: 'edit_article', name: 'edit_article', component: EditArticle, icon: 'edit', meta: { requireAuth: true, title: '创建博客', noNeedAdmin: true } },
        { path: 'user_management', name: 'user_management', component: UserManagement, icon: 'respond', meta: { requireAuth: true, title: '用户管理' } },
        { path: 'categories_mgt', name: 'categories_mgt', component: CategoriesMgt, icon: 'respond', meta: { requireAuth: true, title: '专栏管理' } },
        { path: 'article_detail/:id', name: 'article_detail', component: ArticleDetail, props: true, hidden: true }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requireAuth: true, title: '登录' }
    },
    {
      path: '/',
      redirect: '/login',
      component: Login
    },
    {
      path: '*',
      name: '404',
      component: NoPage,
      meta: {
        title: '404'
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  //统计代码
  if (_hmt) {
    if (to.path) {
      _hmt.push(['_trackPageview', '/#' + to.fullPath]);
    }
  }

  if (to.meta.title) {
    window.document.title = to.meta.title;
  }

  //初次登陆，从localStorage重新存储token
  if (!store.state.token && window.localStorage.token) {
    store.commit('saveToken', window.localStorage.token);
  }

  //根据路由是否有token和权限,决定跳转的界面
  if (store.state.token && to.name === 'login') {
    next({ name: 'article_mgt' });
  } else if (!store.state.token && to.meta.requireAuth) {
    if (to.name === 'login') {
      return next();
    }
    next({ name: 'login' });
  } else {
    next();
  }
});

router.afterEach((to, from, next) => {
  //跳转路由后，滚动回到顶端
  window.scrollTo(0, 0);
});

export default router;
