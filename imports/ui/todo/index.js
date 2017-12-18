import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './todo.html';

Template.Todo.onCreated(function() {
	let t = this;
	t.editing = new ReactiveVar(false);
});


Template.Todo.helpers({
	completedClass() {
		let t = Template.instance();
		if ( t.data.completed ) return 'completed';
		return ;
	},
	editingClass() {
		let t = Template.instance();
		if ( t.editing.get() ) return 'editing';
		return ;
	}
});

Template.Todo.events({
	'click .toggle' ( e, t ) {
		Meteor.call( 'todos.setCompleted', t.data._id, !t.data.completed );
	},
	'dblclick label' ( e, t ) {
		t.editing.set(true);
	},
	'click .destroy' ( e, t ) {
		Meteor.call( 'todos.remove', t.data._id );
	},
	'keypress/blur .edit'( e, t ) {

		if ( e.type === 'keypress' && e.which !== 13 ) return ;
		if ( !t.editing.get() ) return ;

		let val = e.target.value.trim();

		if ( !val ) {
			Meteor.call( 'todos.remove', t.data._id );
			return ;
		}

		Meteor.call( 'todos.update', t.data._id, val );
		t.editing.set(false);

	},
	'keydown .edit'( e, t ) {
		if ( e.which === 27 ) {
			t.editing.set(false);
			e.target.value = t.data.title;
		}
	}
});

