import { API, graphqlOperation } from 'aws-amplify';
import shortid from 'shortid';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';

export const createNewTodo = name =>
  API.graphql(
    graphqlOperation(mutations.createTodo, {
      input: { id: shortid.generate(), name: name, description: 'N/A' }
    })
  );

export const updateDescription = (description, todo) =>
  API.graphql(
    graphqlOperation(mutations.updateTodo, { input: { ...todo, description } })
  );

export const deleteTodo = todo =>
  API.graphql(
    graphqlOperation(mutations.deleteTodo, {
      input: { id: todo.id }
    })
  );

export const getAllTodos = () =>
  API.graphql(graphqlOperation(queries.listTodos)).then(
    response => response.data.listTodos.items
  );
