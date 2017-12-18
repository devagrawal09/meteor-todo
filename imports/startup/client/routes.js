import { FlowRouter } from 'meteor/kadira:flow-router';

import '/imports/ui/body';

FlowRouter.route('/', {
	name: 'all'
});

FlowRouter.route('/active', {
	name: 'active'
});

FlowRouter.route('/completed', {
	name: 'completed'
});
