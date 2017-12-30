import lib from '../lib.jsx'
import Config from '../Config.jsx'
import Moment from 'moment'


const initialState = {

	taskListLoading: false,
	tasks: {},

	mode: 'initializing',
	task: {
		id: null
	},
	parents: [], // parents are ordered, first one is the closest one, last one is top level (root)
	subTasks: {} // subTasks is an associative array for easier search
}



export default {

	getInitialState() {
		return Object.assign({}, initialState)
	},

	create(context) {
		return function taskReducer(state = initialState, action) {

			let tasks = Object.assign({}, state.tasks)

			switch (action.type) {

				/**
				 * Send request for all tasks current user is allowed to access
				 */
				case 'fetchTaskList':
					// send request to server to start loading tasks
					fetchTaskList(context).then(function (allTasks) {
						// do some filtering, output to associative array
						let tasks = {}
						allTasks.forEach( function (taskData) {
							tasks[taskData.id] = mapResponseToTask(taskData)
						})
						context.store.dispatch({ type: 'updateTaskList', tasks })
					})
					return Object.assign({}, state, { taskListLoading: true })				


				/**
				 * Change task list content
				 */
				case 'updateTaskList':
					// populate task list after server returned the list of tasks
					return Object.assign({}, state, { tasks: action.tasks, taskListLoading: false })



				/**
				 * Create a new empty task with random id
				 * and show editor to enter basic task description
				 */
				case 'createTask': // no parameters required
					return Object.assign({}, state, {
						mode: 'create',
						task: createTask({ owner: context.store.getState().loginReducer.login.email }),
						parents: [],
						subTasks: {}
					})


				/**
				 * Create a new empty subtask with random id,
				 * map all related parent tasks
				 * and show editor to enter basic subtask description
				 */
				case 'createSubTask': // parameters: parentTask
					let newSubTask = createTask({ owner: context.store.getState().loginReducer.login.email, parentId: action.parentTask.id })
					return Object.assign({}, state, {
						mode: 'create',
						task: newSubTask,
						parents: getParentTasks(newSubTask, context),
						subTasks: {}
					})


				/**
				 * Show existing task
				 */
				case 'fetchTask': // parameters: taskId
					fetchTask(action.taskId, context).then(function (taskData) {
						let task = mapResponseToTask(taskData)
						let parents = getParentTasks(task, context)
						let subTasks = getSubTasks(task, context)
						context.store.dispatch({ type: 'viewTask', task, parents, subTasks })
					})
					return Object.assign({}, state, { mode: 'fetching' })
		 		

				/**
				 * Update status to display task data
				 * Switches to "read mode"
				 */
				case 'viewTask': // parameters: task, parents, subTasks
					return Object.assign({}, state, { mode: 'read', task: action.task, parents: action.parents || [], subTasks: action.subTasks || {} })


				/**
				 * Updates task data in store
				 */
				case 'updateTask':
					let data = {}
					if (action.task) data.task = action.task
					if (action.subTasks) data.subTasks = action.subTasks
					if (action.parents) data.parents = action.parents
					return Object.assign({}, state, data)


				/**
				 * Save newly created task to database,
				 * then dispatch "taskCreated" action
				 */
				case 'submitNewTask': // parameters: task
					submitTask(action.task, context).then( () => {
						context.store.dispatch({ type: 'taskCreated', task: action.task }),
						() => context.store.dispatch({ type: 'reportFailure', failedAction: 'submitNewTask', task })
					})
					// add the task to task list
					tasks[action.task.id] = Object.assign({}, action.task)
					return Object.assign({}, state, { mode: 'submitting', tasks })


				/**
				 * Save newly created subtask to database,
				 * update parent task (the field "subTasks" has changed)
				 * then dispatch "subTaskCreated" action
				 */
				case 'submitNewSubTask': // parameters: task, parentTask
					// tak care of parent task, don't trace the result...
					let parentTask = Object.assign({}, action.parentTask)
					parentTask.subTaskIds = lib.addUniqueItem(parentTask.subTaskIds, action.subTask.id)
					submitTask(parentTask, context)

					// ... now take care of the subtask
					submitTask(action.subTask, context).then( 
						() => context.store.dispatch({ type: 'subTaskCreated', subTask: action.subTask, parentTask }),
						() => context.store.dispatch({ type: 'reportFailure', failedAction: 'submitNewSubTask', subTask: action.subTask, parentTask })
					)
					
					// update task list
					tasks[action.subTask.id] = Object.assign({}, action.subTask)
					tasks[action.parentTask.id] = Object.assign({}, action.parentTask)
					return Object.assign({}, state, { mode: 'submitting', tasks })



				/**
				 * Submit regular task update
				 */
				case 'submitTask':
					submitTask(action.task, context).then( 
						() => context.store.dispatch({ type: 'taskSubmitted', task: action.task }),
						() => context.store.dispatch({ type: 'reportFailure', failedAction: 'submitTask' })
					)
					// update the task list
					tasks[action.task.id] = Object.assign({}, action.task)
					return Object.assign({}, state, { mode: 'submittingUpdate', tasks })


				case 'resolveTask':
					resolveTask(action.task.id, context).then(
							() => context.store.dispatch({ type: 'taskResolved', task: action.task }),
							() => context.store.dispatch({ type: 'reportFailure', failedAction: 'resolveTask' })
						)
					tasks[action.task.id] = Object.assign({}, action.task, { status: 'done' })
					return Object.assign({}, state, { mode: 'resolved', tasks });


				/**
				 * Mark task as deleted, remove it from the list
				 */
				case 'deleteTask':
					deleteTask(action.task.id, context).then( 
						() => context.store.dispatch({ type: 'taskDeleted', task: action.task }),
						() => context.store.dispatch({ type: 'reportFailure', failedAction: 'deleteTask' })
					)
					delete tasks[action.task.id]
					return Object.assign({}, state, { mode: 'deleting', tasks });



				case 'taskCreated': // parameters: task
					// todo: write message about it

					return Object.assign({}, state, { mode: 'read' })

				case 'subTaskCreated': // parameters: subTask, parentTask
					// todo: write message about it

					// workaroud: new subtask may not be submitted in the store, inject it manually
					let subTasks = getSubTasks(action.parentTask, context)
					subTasks[action.subTask.id] = Object.assign({}, action.subTask)
					// return to parent task
					return Object.assign({}, state, { mode: 'read', task: action.parentTask, parents: getParentTasks(action.parentTask, context), subTasks })


				case 'taskResolved': // parameters: task
					// todo: write message about it

					return Object.assign({}, state, { mode: 'read' })
				

				case 'taskDeleted': // parameters: task
					// todo: write message about it

					return Object.assign({}, state, { mode: 'read' })



				// case 'redirect':
				// 	if (action.position == 'task') {
				// 		// enforce update upon redirect
				// 		if (action.parameters && action.parameters.taskid) {
				// 			return fetchTaskAction(state, { taskId: action.parameters.taskid }, context)
				// 		} else {
				// 			return createTaskAction(state, action, context)
				// 		}
				// 	}
				// 	return state


				// case 'setTaskFormMode':
				// 	return Object.assign({}, state, { mode: action.newMode })


				case 'taskSubmitted':
					// todo: write message about it

					return Object.assign({}, state, { mode: 'read' });

				default:
					return state
			}
		}
	}
}









/**
 * Schedules fetching task list from the database.
 * Returns Promise
 */
function fetchTaskList(context) {
	const requestCfg = {
		url: Config.apiBaseUrl + Config.apiTaskListPath,
		login: context.store.getState().loginReducer.login
	}
	return lib.sendGetRequestToRestApi(requestCfg)
}


/**
 * Returns empty task object with random id
 */
function createTask(cfg) {
	const taskId = lib.createRandomId(Config.maxId)
	return {
		id: taskId,
		code: lib.convertIdToCode(parseInt(taskId, 10)),
		title: cfg.title || '',
		status: cfg.status || 'open',
		acceptanceCriteria: cfg.acceptanceCriteria || [],
		dueDate: cfg.dueDate || Moment().format(Config.apiDateTimeFormat),
		priority: cfg.priority || 1,
		owner: cfg.owner || '',
		parentId: cfg.parentId || null,
		subTaskIds: []
	}
}


/**
 * Schedules fetching task data from database.
 * Returns Promise
 */
function fetchTask(taskId, context) {
	const requestCfg = {
			url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/',
			login: context.store.getState().loginReducer.login
		}
	return lib.sendGetRequestToRestApi( requestCfg )
}


/**
 * Creates proper task object from database response
 */
function mapResponseToTask(taskData) {
	var subTaskIds
	try {
		subTaskIds = JSON.parse(taskData['subtasks'])
	} catch (ex) {
		subTaskIds = []
	}
	return {
		id: taskData['id'],
		code: lib.convertIdToCode(parseInt(taskData['id'], 10)),
		title: taskData['title'],
		acceptanceCriteria: parseAcceptanceCriteria(taskData['acceptance_criteria']),
		dueDate: taskData['due_date'],
		status: taskData['status'],
		priority: taskData['priority'],
		owner: taskData['owner'],
		parentId: taskData['parent_id'] || null,
		subTaskIds: subTaskIds
	}
}



/**
 * Takes acceptance criteria as a serialized JSON string (likely fetched from database)
 * and parses it to a map of objects { passed, description }
 */
function parseAcceptanceCriteria(data) {
	let result = []
	try {
		result = JSON.parse(data).map(
			(item) => ({ // mapping takes care of poor data quality
				passed: item.passed || false,
				description: item.description || ''
			})
		)
	} catch (ex) {
		// JSON.parse failed, probably because "data" is not valid JSON.
		// TODO: report silently a problem with database
	}
	return result
}


/**
 * Schedules the submit of the task to the database
 * Returns Promise
 */
function submitTask(task, context) {

	const requestCfg = {
		url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + task.id + '/',
		login: context.store.getState().loginReducer.login
	}

	// send request and return Promise
	return lib.sendPostRequestToRestApi(requestCfg, {
		id: task.id,
		title: task.title,
		acceptance_criteria: JSON.stringify(task.acceptanceCriteria),
		due_date: task.dueDate,
		status: task.status,
		priority: task.priority,
		owner: task.owner, // context.store.getState().loginReducer.login.email
		parent_id: task.parentId,
		subtasks: JSON.stringify(task.subTaskIds)
	})
}



/**
 * Schedules assigning task as resolved in the database
 * Returns Promise
 */
function resolveTask(taskId, context) {
	const requestCfg = {
		url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/',
		login: context.store.getState().loginReducer.login
	}
	return lib.sendPostRequestToRestApi(requestCfg, { status: 'done' })
}


/**
 * Schedules deleting from the database
 * Returns Promise
 */
function deleteTask(taskId, context) {
	const requestCfg = {
		url: Config.apiBaseUrl + Config.apiTaskListPath + '/' + taskId + '/',
		login: context.store.getState().loginReducer.login
	}
	return lib.sendDeleteRequestToRestApi(requestCfg)
}


/**
 * Returns parent of given task
 */
function getParentTask(task, context) {
	if (task.parentId) {
		return Object.assign({}, context.store.getState().taskReducer.tasks[task.parentId])
	} else {
		return null
	}
}


/**
 * Assembles an array, containing parent tasks of a given task.
 * Parents are sorted by distance from the task, closest parent is at position [0]
 */
function getParentTasks(task, context) {
	let parents = []
	let currentTask = getParentTask(task, context)

	while (currentTask) {
		parents.push( Object.assign({}, currentTask) )
		currentTask = getParentTask(currentTask, context)
	}
	return parents
}


/**
 * Assembles an associative array (object),
 * containing all subtasks of a given task.
 * Uses id as a key
 */
function getSubTasks(task, context) {
	let subTasks = {}
	let taskList = context.store.getState().taskReducer.tasks

	try {
		task.subTaskIds.forEach( function (taskId) {
			if (taskList[taskId]) {
				subTasks[taskId] = Object.assign({}, taskList[taskId])
			}
		})
	} catch (ex) {
		// there was some nonsense in task.subTaskIds, most likely it was error in database.
		// TODO: report the problem silently
	}

	return subTasks
}
