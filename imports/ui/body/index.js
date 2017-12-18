import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Todos } from '/imports/api/todos.js';

import '../todo';

import './body.html';

Template.body.onCreated(function() {
	let t = this;
	t.subscribe('todos');
	t.all = Todos.find({});
	t.completed = Todos.find({ completed: true });
	t.incomplete = Todos.find({ completed: false });
});

Template.body.onRendered(function() {
	let t = this;
	let filterRoute = FlowRouter.current().path;
	t.$('.filters li a')
		.filter(`[href="${filterRoute}"]`)
		.addClass('selected');
});

Template.body.helpers({
	todos() {
		let todos;
		let t = Template.instance();
		let filter = FlowRouter.getRouteName();
		switch ( filter ) {
			case 'active':
				todos = t.incomplete;
				break;
			case 'completed':
				todos = t.completed;
				break;
			default:
				todos = t.all;
		}
		return todos;
	},
	incompleteCount() {
		return Template.instance().incomplete.count();
	},
	completeCount() {
		return Template.instance().completed.count();
	},
	items() {
		let incompleteCount = Template.instance().incomplete.count();
		if ( incompleteCount === 1 ) return 'item';
		return 'items';
	}
});

Template.body.events({
	'change .toggle-all'( e ) {
		Meteor.call('todos.markAll', e.target.checked);
	},
	'keypress .new-todo'( e ) {
		if ( e.target.value && e.which === 13 ) {	//	on pressing enter key
			Meteor.call('todos.insert', e.target.value.trim());
			e.target.value = '';
		}
	},
	'click .clear-completed'() {
		Meteor.call('todos.clearCompleted');
	},
	'click .filters li a'( e, t ) {
		t.$('.filters a.selected').removeClass('selected');
		$(e.target).addClass('selected');
	}
});
