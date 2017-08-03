import { app, ipcMain, Menu, BrowserWindow } from 'electron';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\');
}

let mainWindow;
let db;

setupConfig(setupApp);

function setupConfig(done) {

	const loki = require('lokijs');
	const dbPath = app.getPath('userData') + '/todo.json';

	db = new loki(dbPath, {
		autosave: true,
		serializationMethod: 'pretty'
	});

	db.loadDatabase({}, () => {

		let settings = db.getCollection('settings');
		let todos = db.getCollection('todos');

		if (todos === null) {
			todos = db.addCollection('todos', {
				autoupdate: true
			});
		}

		if (settings === null) {
			settings = db.addCollection('settings', {
				autoupdate: true,
				unique: ['key']
			});

			settings.insert({
				key: 'window',
				x: 100,
				y: 100,
				height: 800,
				width: 1000,
				maximized: false
			});
		}

		global.db = db;

		done();
	});
}

function setupApp() {

	app.on('window-all-closed', () => {
		app.quit();
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow();
		}
	});

	if (app.isReady()) {
		createWindow();
	}
	else {
		app.on('ready', createWindow);
	}
}

function createWindow() {

	const winURL = process.env.NODE_ENV === 'development'
		? `http://localhost:9080`
		: `file://${__dirname}/index.html`

	let settings = db.getCollection('settings');
	let windowSettings = settings.by('key', 'window');

	mainWindow = new BrowserWindow({
		x: windowSettings.x,
		y: windowSettings.y,
		width: windowSettings.width,
		height: windowSettings.height
	});

	if (windowSettings.maximized) {
		mainWindow.maximize();
	}

	mainWindow.loadURL(winURL);

	mainWindow.on('close', () => {

		let bounds = mainWindow.getBounds();
		let maximized = mainWindow.isMaximized();

		windowSettings.x = bounds.x;
		windowSettings.y = bounds.y;
		windowSettings.height = bounds.height;
		windowSettings.width = bounds.width;
		windowSettings.maximized = maximized;

		settings.update(windowSettings);

		db.saveDatabase();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	createMenus();
}

function createMenus() {

	var template = [
		{
			label: 'Edit',
			submenu: [
				{
					label: 'Cut',
					role: 'cut'
				},
				{
					label: 'Copy',
					role: 'copy'
				},
				{
					label: 'Paste',
					role: 'paste'
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Developer Tools',
					type: 'checkbox',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click: () => mainWindow.webContents.toggleDevTools()
				},
				{
					label: 'Reload',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+R' : 'Ctrl+Shift+R',
					click: () => mainWindow.webContents.reload()
				}
			]
		},
		{
			label: 'Tasks',
			submenu: [
				{
					label: 'New Task',
					accelerator: 'CmdOrCtrl+N',
					click: () => mainWindow.webContents.send('Menu', 'NewTask') // dispatch to window
				}
			]
		}
	];

	if (process.platform === 'darwin') {
		// Add app menu (OS X)
		template.unshift({
			label: 'ToDos',
			submenu: [
				{
					label: 'Hide',
					accelerator: 'Command+H',
					role: 'hide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'Command+Q',
					click: () => app.quit()
				}
			]
		});
	}

	let menu = Menu.buildFromTemplate(template);

	Menu.setApplicationMenu(menu);
}
