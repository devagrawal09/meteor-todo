import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Todos = new Mongo.Collection('todos');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('todos', function() {
		return Todos.find();
	});
}

Meteor.methods({
	'todos.insert'(title) {
		check(title, String);

		Todos.insert({ title, completed: false });
	},
	'todos.remove'(todoId) {
		check(todoId, String);

		Todos.remove(todoId);
	},
	'todos.update'(todoId, title) {
		check(todoId, String);
		check(title, String);

		Todos.update(todoId, { title });
	},
	'todos.setCompleted'(todoId, completed) {
		check(todoId, String);
		check(completed, Boolean);

		Todos.update(todoId, { $set: { completed } });
	},
	'todos.markAll'( completed ) {
		check(completed, Boolean);

		Todos.update({}, { $set: { completed } }, { multi: true });
	},
	'todos.clearCompleted'() {
		Todos.remove({ completed: true });
	}
});
