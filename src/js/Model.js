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

  getStorageStatus() {
    let data = localStorage.getItem(STATUS_KEY);

    if (data) {
      return JSON.parse(data);
    }
    return {
      lastTS: -1
    }
  }

  addItem(todoItem) {
    this.todos = this.todos.concat(todoItem);
    this.save();
  }

  updateItem(id, data) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        return Object.assign(todo, data);
      }

      return todo;
    });
    this.save();
  }

  toggleItem(id) {
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }

      return todo;
    });
    this.save();
  }

  removeItem(id) {
    this.todos = this.todos.filter(todo => {
      return (todo.id !== id);
    });
    this.save();
  }

  load() {
    this.todos = JSON.parse(localStorage.getItem(MODEL_KEY) || '[]');
    // Emulate async loading
    return Promise.resolve();
  }

  save() {
    try {
      localStorage.setItem(MODEL_KEY, JSON.stringify(this.todos));
      localStorage.setItem(STATUS_KEY, JSON.stringify({
        lastTS: Date.now()
      }));
      this.trigger('saved');
    } catch(e) {
      this.trigger('error');
    }
  }
}

export default Model;
