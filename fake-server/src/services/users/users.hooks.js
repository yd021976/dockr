const { authenticate } = require('@feathersjs/authentication').hooks;
const users = require('../../users.json')

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt'), fakeUserId()],
    create: [hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [hashPassword(), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function fakeUserId() {
  return function (hook) {
    let response = users[hook.id]
    hook.result = response
    return hook;
  }
}