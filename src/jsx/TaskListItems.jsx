import React from 'react'

import lib from './lib.jsx'
import ui from './ui/Elements.jsx'
import Config from './Config.jsx'



export default function TaskListItems(props) {
		
	let taskList = lib.convertToArray(props.tasks)

	if (taskList.length > 0) {
		// list not empty
		return (
			<ul className="do--list do--margin-medium--top">
				{taskList.map(function (taskData) {
			
					let warning = '';
					if ( taskData.status && Config.messages.status[taskData.status] && Config.messages.status[taskData.status].warning) {
						warning = Config.messages.status[taskData.status].warning
					}

					return (
						<li className={getTaskListItemClass(taskData)} key={taskData.id} data-task-id={taskData.id} onClick={createEditTaskHandler(props.editTaskRedirect, { taskId: taskData.id })}>
							
							{taskData.title}

							<ui.Show if={warning !== ''}>
								<ui.Icon type="warning" className="do--float__right" title={warning} />
							</ui.Show>

							<div className="do--text--lite do--text--small">{lib.convertIdToCode(parseInt(taskData.id, 10))}</div>
						</li>
					)
				})}
			</ul>
		)
	} else {
		// list is empty
		return (
			<div className="do--info do--margin-medium--top">
				{Config.messages.emptyTaskList}
			</div>
		)
	}
}

function createEditTaskHandler(redirectFn, params) {
	return function(evt) {
		// return fn(evt, params)
		return redirectFn('task', { taskid: params.taskId })
	}
}


function getTaskListItemClass(taskData) {
	let buffer = []
	buffer.push("do--list__item")
	buffer.push("do--list__link")
	buffer.push("do--float")
	switch("" + taskData.priority) {
		case "0": buffer.push("do--list__item--low-priority"); break;
		case "1": buffer.push("do--list__item--normal-priority"); break;
		case "2": buffer.push("do--list__item--high-priority"); break;
		case "3": buffer.push("do--list__item--critical-priority"); break;
	}
	return buffer.join(" ")
}
