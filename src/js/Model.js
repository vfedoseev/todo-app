const MODEL_KEY = 'td_list';
const STATUS_KEY = 'td_status';

class Model {
  constructor() {
    this.todos = [];
    this.handlers = {};
  }

  // Use simplified event interface
  // Events will be used only for 'async' storage actions
  on(eventName, handler) {
    this.handlers[eventName] = handler;
  }

  trigger(eventName) {
    this.handlers[eventName] && this.handlers[eventName]();
  }

  getAll() {
    // Make a copy to prevent array mutations
    let todos = [].concat(this.todos);

    return todos;
  }

  getItemById(id) {
    return this.todos.find(todo => {
      return todo.id === id;
    });
  }

  getInfo() {
    let total = this.todos.length;
    let completed = this.todos.filter(todo => {
      return !!todo.completed;
    }).length;

    return {total, completed};
  }

  addItem(todoItem) {
    this.todos = this.todos.concat(todoItem);
  }

  updateItem(id, data) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return Object.assign(todo, data);
      }

      return todo;
    });
  }

  toggleItem(id) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }

      return todo;
    });
  }

  removeItem(id) {
    this.todos = this.todos.filter(todo => {
      return (todo.id !== id);
    });
  }

  load() {
    this.todos = [
      {
        id: 1,
        title: "Initial commit",
        completed: true
      }, {
        id: 2,
        title: "Add localStorage",
        completed: false
      }, {
        id: 3,
        title: "Build js bundle",
        completed: false
      }
    ];
    // Emulate async loading
    return Promise.resolve();
  }
}
