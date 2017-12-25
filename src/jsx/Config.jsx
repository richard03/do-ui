export default {

	maxId: 9999999999999999, // may not be bigger than maxBigInt and maxLong (for compatibility with other systems if we integrated with them)

	apiBaseUrl: 'http://do.prokoho.cz/task-manager-api/v1',
	// apiBaseUrl: 'http://doapi-2610.rostiapp.cz',
	apiTaskListPath: '/tasks',
	apiDateTimeFormat: 'YYYY-MM-DD',

	// taskListScreenPath: '/tasks/',
	// taskDetailScreenPath: '/task/',
	
	gApiKey: '752355908856-6ltij7jk35g0jn1l1fesnv6ung3rbtlo.apps.googleusercontent.com',

	messages: {
		// status messages
		loadingData: 'Načítám data...',
		loadingTaskList: 'Načítám úkoly...',
		emptyTaskList: 'Nemáte žádné úkoly',

		// buttons
		resolved: 'Splněno',
		accept: 'Přijmout',
		delete:'Smazat',
		back: 'Zpět',
		cancel: 'Zrušit',
		addNext: 'Přidat další',
		addTask: 'Přidat úkol',
		createTask: 'Vytvořit úkol',
		saveChanges: 'Uložit změny',
		switchToViewMode: 'Hotovo',
		switchToEditMode: 'Upravit',

		// titles
		task: 'Úkol',
		tasks: 'Úkoly',

		priority: {
			critical: 'Kritická',
			high: 'Vysoká',
			normal: 'Normální',
			low: 'Nízká'
		}
	},

	// components

	TextControl: {
		messages: {
			switchToEditMode: 'Uprav',
			acceptValue: 'OK',
			rejectValue: 'X'
		}
	},
	DateControl: {
		viewFormat: 'D. M. YYYY',

		messages: {
			switchToEditMode: 'Změň'
		}
	},
	SelectControl: {
		messages: {
			switchToEditMode: 'Změň',
		}
	},
	CriteriaListControl: {
		messages: {
			switchToEditMode: 'Uprav',
			acceptValue: 'OK',
			rejectValue: 'X'
		}
	}, 
	TextListInput: {
		messages: {
			add: 'Přidej',
			delete: 'X'
		}
	}

}
