<template>
	<div class="article-manage view" v-if="loadOK">
		<div class="user-title clearfix">
			<h3>文章管理</h3>
		</div>
		<div class="article-search-box" v-if="!currTag">
			<span>筛选: </span>
			<Droplist v-for="item in dropItems" :init-info="item" :key="item.name" @selectData="getSelectData"
				:ref="item.ref"></Droplist>
			<div class="search-class">
				<SearchBox @searchData="getSearchData"></SearchBox>
			</div>
		</div>
		<BackArticleList v-for="item in articleList" :info="item" :key="item.article_id" @chgState="chgState"
			@del="removeArticle"></BackArticleList>
		<div class="page">
			<PageNav :info="pageInfo" @page="handleChangePage" ref="page"></PageNav>
		</div>
	</div>
	<div class="loadClass" v-else>{{ tipMsg }}</div>
</template>

<script>
import { getStatArticle, getCategories, changeArticeState, delArticle, getPageArticle, requestSearchResult } from '@/api/api';
import Droplist from '@/components/back/droplist';
import SearchBox from '@/components/search_box';
import BackArticleList from '@/components/back/back_article_list';
import PageNav from '@/components/page_nav';
import { mapState, mapMutations } from 'vuex';

export default {
	components: { Droplist, SearchBox, BackArticleList, PageNav },
	inject: ['reload'],
	data() {
		return {
			tags: [],
			currTag: 0,
			currPage: 1,
			statArticle: [],
			tipMsg: '',
			dropItems: [
				{
					name: '专栏',
					width: '80',
					ref: 'categories',
					data: ['不限']
				}
			],
			searchConditions: {
				year: '',
				month: '',
				categories: '',
				key: ''

			},
			articleList: [],
			pageInfo: {
				articleSum: 0,
				// 一页的文章数
				pageArticle: 6
			},
			categories: []
		};
	},
	computed: {
		...mapState(['loadOK'])
	},
	mounted() {
		this.initLoadOK();
		this.getTag();
		this.getCategoriesList();
	},
	methods: {
		...mapMutations(['chgLoadOK', 'initLoadOK']),
		// 获取标题数据
		getTag() {
			getStatArticle().then(res => {
				if (res.state && res.data.length) {
					this.statArticle = res.data;
					let tmp = [];
					tmp[0] = `全部(${this.statArticle[0]['article_sum']})`;
					this.tags = tmp;
					// 获取当前标签下的文章
					this.getTagArticle();
				} else {
					this.chgLoadOK();
					this.tipMsg = '初始化数据失败';
				}
			}).catch(err => {
				console.log(err);
			});
		},
		// 获取该标题文章
		getTagArticle() {
			let state = this.currTag + 1;
			// 全部时，传给服务器的state为0
			if (!this.currTag) {
				state = this.currTag;
			}
			let params = {
				state: state,
				currPage: this.currPage,
				perPageArticle: this.pageInfo.pageArticle
			};
			this.pageInfo.articleSum = this.tags[this.currTag].match(/\d+/)[0] - 0;
			getPageArticle({ 'params': params }).then(res => {
				if (res.state && res.data.length) {
					this.articleList = res.data;
				} else {
					this.chgLoadOK();
					this.tipMsg = '还没有写文章';
				}
			}).catch(err => {
				console.log(err);
			});
		},
		// 点击改变标题
		handleChangeTag(index) {
			this.currTag = index;
			this.currPage = 1;
			this.resetPage();
			this.getTagArticle();
		},

		// 设置专栏
		getCategoriesList() {
			getCategories().then(res => {
				this.categories = res.data;
				let categoriesList = [];
				categoriesList[0] = '不限';
				for (let i = 0; i < this.categories.length; i++) {
					categoriesList[i + 1] = this.categories[i]['categories_name'];
				}
				this.dropItems[0].data = categoriesList;

				if (res.data.length) {
					this.dropItems[0].width = 200;
				} else {
					this.dropItems[0].width = 80;
				}
			}).catch(err => {
				console.log(err);
			});
		},
		getSelectData(name, value) {

			if (value === '不限') {
				this.searchConditions.categories = '';
				return;
			}
			this.categories.forEach((item, index, array) => {
				if (item.categories_name === value) {
					this.searchConditions.categories = item.categories_id;
				}
			});
		},
		// 获取搜索框数据以及向服务器请求查询结果
		getSearchData(value) {
			this.searchConditions.key = value;
			// 向服务器请求结果
			requestSearchResult({ 'params': this.searchConditions }).then(res => {
				this.articleList = res.data;
				this.pageInfo.articleSum = 0;
			}).catch(err => {
				console.log(err);
			});
		},
		// 文章状态改变
		chgState(id, oldState) {
			let newState = 0;
			if (oldState === 1) {
				newState = 2;
			} else {
				newState = 1;
			}
			changeArticeState({ id, 'state': newState }).then(() => {
				this.reload();
			}).catch(err => {
				console.log(err);
			});
		},
		// 删除文章
		removeArticle(id) {
			delArticle({ params: { id } }).then(() => {
				this.reload();
			}).catch(err => {
				console.log(err);
			});
		},
		// 改变分页数
		handleChangePage(index) {
			this.currPage = index;
			this.getTagArticle();
		},
		// 更换标题时，重置分页为1
		resetPage() {
			this.$refs.page.currPage = 1;
		}
	}
};
</script>

<style scoped>
.article-manage .article-search-box {
	padding: 20px 0;
	border-bottom: 1px solid #ddd;
}

.article-search-box .select-btn,
input,
button:last-child {
	display: inline-block;
	margin-left: 10px;
}

.search-class {
	display: inline-block;
	margin-top: 0px;
}

.page {
	text-align: center;
	margin-top: 20px;
}
</style>
