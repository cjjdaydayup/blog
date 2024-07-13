import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		token: null,
		loadOK: true,
		role: null
	},
	mutations: {
		saveToken(state, data) {
			state.token = data;
			window.localStorage.setItem('token', data);
		},
		removeToken(state) {
			state.token = null;
			window.localStorage.removeItem('token');
		},
		chgLoadOK(state) {
			if (state.loadOK) {
				state.loadOK = false;
			}
		},
		initLoadOK(state) {
			state.loadOK = true;
		},
		saveRole(state, data){
			state.role = data;
			window.localStorage.setItem('role', data);
		},
		removeRole(state){
			state.role = null;
			window.localStorage.removeItem('role');
		}
	}
});

export default store;