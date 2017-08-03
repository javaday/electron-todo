const remote = window.require('electron').remote;

let singleton = null;

class Database {

	constructor() {
		this.db = remote.getGlobal('db');
		this.todos = this.db.getCollection('todos');
	}

	static get instance() {
		if (singleton) {
			return singleton;
		}
		else {
			singleton = new Database();
			return singleton;
		}
	}

	getTasks() {

		console.log('tasks: ', this.todos.data);

		let tasks = this.todos.data;

		return tasks;
	}

	addTask(task) {

		let newTask = this.todos.insert(task);
		this.db.saveDatabase();

		return newTask;
	}

	deleteTask(task) {
		
		this.todos.remove(task);
		this.db.saveDatabase();
	}
}

export default Database.instance;