import { CardContent, Slide } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import React, { Component } from 'react';

import writingIcon from './assets/apple-touch-icon.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodo: '',
      newTodoDescription: '',
      todoBeingEdited: -1,
      todos: []
    };
  }
  handleInput = key => event => {
    this.setState({ [key]: event.target.value });
  };
  createTodo = () => {
    this.finishEdit();
    const { newTodo } = this.state;
    if (newTodo.length > 0) {
      this.setState(prevState => ({
        todos: [
          ...prevState.todos,
          { title: this.state.newTodo, description: '' }
        ],
        newTodo: '',
        newTodoDescription: '',
        todoBeingEdited: prevState.todos.length
      }));
    }
  };
  deleteTodo = index => () => {
    this.finishEdit();
    const todos = this.state.todos;
    todos.splice(index, 1);
    this.setState({ todos });
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
      const todoEdited = {
        title: todo.title,
        description: newTodoDescription
      };

      todos.splice(todoBeingEdited, 1, todoEdited);
      this.setState({ todos, todoBeingEdited: -1 });
    }
  };
  render() {
    return (
      <div>
        <AppBar color="default" position="static">
          <Toolbar>
            <Typography variant="title">Material To Do </Typography>
            <div style={{ paddingLeft: 4 }}>
              <img alt="writing" style={{ maxWidth: 24 }} src={writingIcon} />
            </div>
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
              <Slide direction="up" in>
                <Card>
                  <CardContent>
                    <Typography onClick={this.finishEdit} variant="subheading">
                      {todo.title}
                      <EditOutlinedIcon
                        style={{ float: 'right', padding: 4 }}
                        onClick={this.editTodo(i)}
                      />
                      <DeleteOutlinedIcon
                        style={{ float: 'right', padding: 4 }}
                        onClick={this.deleteTodo(i)}
                      />
                    </Typography>
                    {this.state.todoBeingEdited === i ? (
                      <Input
                        autoFocus
                        placeholder="Describe your to do..."
                        onChange={this.handleInput('newTodoDescription')}
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

export default App;
