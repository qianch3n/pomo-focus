import ACTION from './constants';
import agent from './agent';

const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ACTION.ASYNC_START, subtype: action.type });

    action.payload.then( res => {
      console.log('RESULT:');
      console.log(res);
      action.payload = res;
      store.dispatch(action);
    }, error => {
      console.dir(error);
      action.error = true;
      action.payload = error.response.body.errors.message;
      store.dispatch(action);
    });
    return;
  }
  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}

const localStorageMiddleware = store => next => action => {
  if (action.type === ACTION.REGISTER || action.type === ACTION.LOGIN) {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.user.token);
      agent.setToken(action.payload.user.token);
    }
  } else if (action.type === ACTION.LOGOUT) {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }

  next(action);
}

export {
  promiseMiddleware,
  localStorageMiddleware
}