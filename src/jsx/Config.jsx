export default {

	maxId: 9999999999999999, // may not be bigger than maxBigInt and maxLong (for compatibility with other systems if we integrated with them)

	apiBaseUrl: 'http://do.prokoho.cz/task-manager-api/v1',
	apiTaskListPath: '/tasks',
	apiDateTimeFormat: 'YYYY-MM-DD',
	
	taskListScreenPath: '/tasks/',
	taskFormScreenPath: '/taskForm/',
	taskDetailScreenPath: '/task/',
	taskDateFormat: 'D. M. YYYY',

	gApiKey: '752355908856-6ltij7jk35g0jn1l1fesnv6ung3rbtlo.apps.googleusercontent.com',

	messages: {
		loadingData: 'Načítám data...',
		resolved: 'Splněno',
		delete:'Smazat',
		back: 'Zpět',

		task: 'Úkol',
		tasks: 'Úkoly',
		loadingTaskList: 'Načítám úkoly...',
		emptyTaskList: 'Nemáte žádné úkoly',
		addTask: 'Přidat úkol',
		createTask: 'Vytvořit úkol',
		saveChanges: 'Uložit změny',

		priority: {
			critical: 'Kritická',
			high: 'Vysoká',
			normal: 'Normální',
			low: 'Nízká'
		}
	}
	
}