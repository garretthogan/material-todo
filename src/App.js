import { CardContent, Slide } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import OfflineBoltOutlinedIcon from '@material-ui/icons/OfflineBoltOutlined';
import React, { Component } from 'react';
import { withAuthenticator } from 'aws-amplify-react';
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from './graphql/mutations';
import shortid from 'shortid';

import * as queries from './graphql/queries';

import writingIcon from './assets/apple-touch-icon.png';

const createNewTodo = name =>
  API.graphql(
    graphqlOperation(mutations.createTodo, {
      input: { id: shortid.generate(), name: name, description: 'N/A' }
    })
  );

const updateDescription = (description, todo) =>
  API.graphql(
    graphqlOperation(mutations.updateTodo, { input: { ...todo, description } })
  );

const deleteTodo = todo =>
  API.graphql(
    graphqlOperation(mutations.deleteTodo, {
      input: { id: todo.id }
    })
  );

const getAllTodos = () =>
  API.graphql(graphqlOperation(queries.listTodos)).then(
    response => response.data.listTodos.items
  );

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      newTodo: '',
      newTodoDescription: '',
      todoBeingEdited: -1,
      todos: []
    };
  }
  componentWillMount() {
    getAllTodos().then(response => {
      this.setState({ todos: response, isLoading: false });
    });
  }
  handleInput = key => event => {
    this.setState({ [key]: event.target.value });
  };
  createTodo = () => {
    this.finishEdit();
    const { newTodo } = this.state;
    if (newTodo.length > 0) {
      this.setState({ isLoading: true });
      createNewTodo(newTodo).then(response => {
        this.setState(prevState => ({
          todos: [...prevState.todos, response.data.createTodo],
          newTodo: '',
          newTodoDescription: '',
          todoBeingEdited: prevState.todos.length,
          isLoading: false
        }));
      });
    }
  };
  deleteTodo = index => () => {
    this.finishEdit();
    const todos = this.state.todos;
    const todoToDelete = todos.splice(index, 1)[0];
    this.setState({ isLoading: true });
    deleteTodo(todoToDelete)
      .then(getAllTodos)
      .then(response => {
        this.setState({ todos: response, isLoading: false });
      });
  };
  editTodo = index => () => {
    this.finishEdit();
    this.setState(prevState => ({
      todoBeingEdited: index,
      newTodoDescription: prevState.todos[index].description
    }));
  };
  finishEdit = () => {
    const { todoBeingEdited, todos, newTodoDescription } = this.state;
    const todo = this.state.todos[todoBeingEdited];
    if (todoBeingEdited > -1 && todos.length > 0 && todo) {
      this.setState({ isLoading: true });
      updateDescription(newTodoDescription, todo).then(response => {
        todos.splice(todoBeingEdited, 1, response.data.updateTodo);
        this.setState({ todos, todoBeingEdited: -1, isLoading: false });
      });
    }
  };
  render() {
    const {
      authData: { username }
    } = this.props;
    return (
      <div>
        <AppBar color="default" position="static">
          <Toolbar>
            <Typography variant="title">Material To Do </Typography>
            <div style={{ paddingLeft: 4 }}>
              <img alt="writing" style={{ maxWidth: 24 }} src={writingIcon} />
            </div>
            &nbsp;
            <Typography
              variant="display1"
              style={{ fontSize: 14, float: 'right' }}
            >
              {username}
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ padding: 12 }}>
          <Input
            placeholder="Go to the store"
            onChange={this.handleInput('newTodo')}
            value={this.state.newTodo}
            fullWidth
          />
        </div>
        <div style={{ padding: 12 }}>
          <Button
            onClick={this.createTodo}
            fullWidth
            variant="outlined"
            color="primary"
          >
            Create
          </Button>
        </div>
        <div style={{ padding: 4 }}>
          {this.state.todos.map((todo, i) => (
            <div style={{ padding: 4 }} key={i}>
              <Slide direction="right" in>
                <Card>
                  <CardContent>
                    <Typography onClick={this.finishEdit} variant="subheading">
                      {todo.name}
                      <EditOutlinedIcon
                        style={{ float: 'right', padding: 4 }}
                        onClick={this.editTodo(i)}
                      />
                      <DeleteOutlinedIcon
                        style={{ float: 'right', padding: 4 }}
                        onClick={this.deleteTodo(i)}
                      />
                      {this.state.todoBeingEdited === i && (
                        <OfflineBoltOutlinedIcon
                          style={{ float: 'right', padding: 4 }}
                        />
                      )}
                    </Typography>
                    {this.state.todoBeingEdited === i ? (
                      <Input
                        autoFocus
                        placeholder="Describe your to do..."
                        onChange={this.handleInput('newTodoDescription')}
                        onBlur={this.finishEdit}
                        value={this.state.newTodoDescription}
                        fullWidth
                      />
                    ) : (
                      <Typography onClick={this.editTodo(i)}>
                        {todo.description || 'Description goes here...'}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App);
