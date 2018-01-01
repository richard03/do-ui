import React from 'react'

import lib from './lib.jsx'
import ui from './ui/Elements.jsx'
import Config from './Config.jsx'



export default function TaskListItems(props) {
		
	var taskList = []

	lib.forEach(props.tasks, function (task) {
		// conditions that exclude task from the list
		if (task.status == 'deleted') return
		if (props.exclude && props.exclude.status && props.exclude.status.includes(task.status)) return

		// add task to the list 
		taskList.push(task)
	})
	

	if (taskList.length > 0) {
		// list not empty
		return (
			<ul className="do--list do--margin-medium--top">
				{taskList.map(function (task) {
			
					return (
						<li className={getTaskListItemClass(task)} key={task.id} data-task-id={task.id} onClick={props.taskDetailHandler.bind(null, task.id)}>
							
							{task.title}

							{renderIcon(task)}
							{renderNumberOfSubtasks(task)}

							<div className="do--text--lite do--text--small">{lib.convertIdToCode(parseInt(task.id, 10))}</div>
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


function getTaskListItemClass(task) {
	let buffer = []
	buffer.push("do--list__item do--list__link do--float")
	if (task.status == 'done') {
		buffer.push("do--list__item--supressed")
	} else {
		switch("" + task.priority) {
			case "0": buffer.push("do--list__item--low-priority"); break
			case "1": buffer.push("do--list__item--normal-priority"); break
			case "2": buffer.push("do--list__item--high-priority"); break
			case "3": buffer.push("do--list__item--critical-priority"); break
		}
	}
	return buffer.join(" ")
}



function renderIcon(task) {
	if (task.status == 'done') {
		return (
			<ui.Icon type="checked" className="do--float__right" />
		)
	}
	if ( task.status && Config.messages.status[task.status] && Config.messages.status[task.status].warning) {
		return (
			<ui.Icon type="warning" className="do--float__right" title={Config.messages.status[task.status].warning} />
		)
	}
}


function renderNumberOfSubtasks(task) {
	if (task.subTaskIds && task.subTaskIds.length > 0) {
		return (
			<span className="do--counter do--float__right">{task.subTaskIds.length}</span>
		)
	}
}
