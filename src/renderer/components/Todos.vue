<template>
	<div id="wrapper">
		<img id="logo" src="~@/assets/logo.png" alt="electron-vue">
		<main>
			<div>
				<div>
					<span class="title">Welcome to your task list!</span>
				</div>
				<div>
					<ul>
						<li v-for="task in tasks">
							{{ task.description }} <a href="#" v-on:click="completeTask(task, $event)">Done</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="doc">
				<button v-on:click="addTask">Add Task</button>
			</div>
		</main>
	</div>
</template>

<script>
	import { ipcRenderer } from 'electron';
	import { mapGetters } from 'vuex';

	export default {
		name: 'todos',
		computed: {
			...mapGetters({
				tasks: 'filteredTasks'
			})
		},
		methods: {
			addTask() {
				this.$router.push('new');
			},
			completeTask(task, event) {

				this.$store.dispatch('removeTask', task);
			}
		},
		mounted: function () {

			let router = this.$router;

			ipcRenderer.on('Menu', (event, message) => {
				if (message === 'NewTask') {
					router.push('new');
				}
			});
		}
	}

</script>

<style>
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	body {
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 18px;
		font-weight: bold;
	}

	a {
		font-weight: normal;
	}

	#wrapper {
		background: radial-gradient( ellipse at top left,
		rgba(255, 255, 255, 1) 40%,
		rgba(229, 229, 229, .9) 100%);
		height: 100vh;
		padding: 60px 80px;
		width: 100vw;
	}

	#logo {
		height: auto;
		margin-bottom: 20px;
		width: 420px;
	}

	main {
		display: flex;
		justify-content: space-between;
	}

	main>div {
		flex-basis: 50%;
	}

	.left-side {
		display: flex;
		flex-direction: column;
	}

	.welcome {
		color: #555;
		font-size: 23px;
		margin-bottom: 10px;
	}

	.title {
		color: #2c3e50;
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 10px;
		text-decoration: underline;
	}

	.title.alt {
		font-size: 18px;
		margin-bottom: 10px;
	}

	.doc p {
		color: black;
		margin-bottom: 10px;
	}

	.doc button {
		font-size: .8em;
		cursor: pointer;
		outline: none;
		padding: 0.75em 2em;
		border-radius: 2em;
		display: inline-block;
		color: #fff;
		background-color: #4fc08d;
		transition: all 0.15s ease;
		box-sizing: border-box;
		border: 1px solid #4fc08d;
	}

	.doc button.alt {
		color: #42b983;
		background-color: transparent;
	}
</style>