import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware, { Saga } from "redux-saga";
import { composeWithDevTools } from "redux-devtools-extension";

import { rootState } from "./reducer";
import * as sagas from "./sagas";

export function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const enhancers = composeWithDevTools(applyMiddleware(...middleware));
  const store = createStore(rootState, enhancers);

  Object.values(sagas).forEach(saga => {
    sagaMiddleware.run(saga as Saga);
  });

  return store;
}
