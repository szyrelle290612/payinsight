import { Meteor } from 'meteor/meteor';
import Server from '../imports/api/classes/server/Server';

import '../imports/api/server/index';
import '../imports/api/server/publication/Userpub';

Meteor.startup(() => {
  Server.registerFunctions();
  Server.initServer();
  Server.run();
});
