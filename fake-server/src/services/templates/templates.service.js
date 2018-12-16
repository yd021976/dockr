// Initializes the `templates` service on path `/templates`
const createService = require('./templates.class.js');
const hooks = require('./templates.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/templates', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('templates');

  service.hooks(hooks);
};
