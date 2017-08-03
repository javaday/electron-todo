import db from '../../services/database';

const state = {
	list: db.getTasks() || [],
	filteredList: [],
	query: ''
};

const mutations = {

	addTask(state, task) {
		state.list.push(task);
	},

	removeTask(state, task) {
		let index = state.list.indexOf(task);

		if (index > -1) {
			state.list.splice(index, 1);
		}
	},

	setTaskQuery(state, query) {

		state.query = query;

		filterTasks(state, state.query);
	}
};

const actions = {

	addTask({ commit, state }, task) {
		task = db.addTask(task);
		commit('addTask', task);
	},

	removeTask({ commit, state }, task) {
		db.deleteTask(task);
		commit('removeTask', task);
	},

	queryTasks({ commit, state }, query) {
		commit('setTaskQuery', query);
	}
};

const getters = {

	filteredTasks: (state) => {

		return state.list;
	}
};

function filterTasks(state, query) {

	let filtered = [];

	var query = query.toLowerCase();

	filtered = state.list.filter((item) => {
		return item.toLowerCase().includes(query);
	});

	state.filteredList = filtered;
}

export default {
	state,
	mutations,
	actions,
	getters
};