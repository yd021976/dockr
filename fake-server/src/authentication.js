const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');


module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());


  /**
   * Fake auth function that controle in wich cases we return error or return successfull auth
   */
  function fakeAuth() {
    return async function (hook) {

      // If called internally or we are already authenticated skip
      if (!hook.params.provider || hook.params.authenticated) {
        return Promise.resolve(hook);
      }

      switch (hook.data.strategy) {

        // When Anonymous, let's return success auth
        case 'anonymous':
          hook.params.authenticated = true;
          hook.params.payload = { userId: 'anonymous strategy : fakeUser' }
          break;

        // When local auth is required, we only successfull auth for a user called "jasmine_test"
        case 'local':
          if (hook.data['email'] != 'jasmine_test') {
            throw new Error('Auth error');
          }
          hook.params.authenticated = true;
          hook.params.payload = { userId: 'auth strategy : fakeUser local' }
          break;

        // We don't handle any other auth strategy than anonymous or local
        default:
          throw new Error('Unknown strategy', hook);
          break;
      }
      return hook;
    }
  }

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        fakeAuth()
        // authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      create: []
    }
  });
};
