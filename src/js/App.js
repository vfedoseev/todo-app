const directSorter = createSorter('title', false, title => title.toLowerCase());
const reverseSorter = createSorter('title', true, title => title.toLowerCase());

const KEYCODE_ENTER = 13;
const KEYCODE_ESC = 27;

class App {
  constructor(element) {
    this.todos = new Model();
    this.sortOrderActive = false;
    this.sortOrderDirect = true;
    this.editFinished = false;

    this.inputEl = element.querySelector('.js-todo-input');
    this.todoList = element.querySelector('.js-todo-list');
    this.counterEl = element.querySelector('.js-todo-count');
    this.statusEl = element.querySelector('.js-todo-status');
    this.sortBtn = element.querySelector('.js-todo-btn-sort');

    this._bindListeners();
    // Handle model events to emulate external storage actions
    this.todos.on('saved', this._renderStorageStatus.bind(this, 'success'));
    this.todos.on('error', this._renderStorageStatus.bind(this, 'error'));
    this.todos.load().then(() => {
      this._render(true);
      this._renderStorageStatus('success');
    });
  }

  _bindListeners() {
    this.inputEl.addEventListener('change', this._inputHandler.bind(this));
    this.todoList.addEventListener('click', this._listClickHandler.bind(this));
    this.sortBtn.addEventListener('click', this._sortClickHandler.bind(this));
  }

  _inputHandler(event) {
    let value = event.target.value;

    value = value.trim();
    event.target.value = '';

    this.todos.addItem({
      id: uuid(),
      title: value,
      completed: false
    });
    this._render();
  }

  _listClickHandler(event) {
    let action, id;
    let render = false;
    let target = event.target;
    let actionWrapper = target.closest('[data-action]');
    let itemWrapper = target.closest('[data-id]');

    if (actionWrapper && itemWrapper) {
      action = actionWrapper.getAttribute('data-action');
      id = itemWrapper.getAttribute('data-id');
      id = parseInt(id, 10);

      switch (action) {
        case 'toggle':
          this.todos.toggleItem(id);
          render = true;
          break;
        case 'remove':
          this.todos.removeItem(id);
          render = true;
          break;
        case 'edit':
          this._startEdit(id);
          break;
      }

      if (render) {
        this._render();
      }
    }
  }

  _sortClickHandler(event) {
    if (this.sortOrderActive) {
      this.sortOrderDirect = !this.sortOrderDirect;
    }
    this.sortOrderActive = true;

    this._render();
  }

  _startEdit(id) {
    let itemEl = this.todoList.querySelector(`[data-id="${id}"]`);
    let todo = this.todos.getItemById(id);

    if (!itemEl || !todo) {
      return;
    }

    let input = this._cacheEditInput();
    input.value = todo.title;
    itemEl.appendChild(input);
    input.focus();
    this.editFinished = false;
  }

  _finishEdit(event) {
    let itemWrapper = event.target.closest('[data-id]');

    if (itemWrapper) {
      let id = itemWrapper.getAttribute('data-id');
      id = parseInt(id, 10);
      let value = event.target.value;

      if (value.trim() === '') {
        this.todos.removeItem(id);
      } else {
        this.todos.updateItem(id, {
          title: value
        });
      }
    }

    this.editFinished = true;
    this._removeEditInput();
    this._render();
  }

  _cancelEdit() {
    this._removeEditInput();
  }

  _cacheEditInput() {
    if (!this.editInput) {
      let input = document.createElement('input');
      input.className = 'todo-list__input';

      input.addEventListener('keyup', event => {
        switch (event.keyCode) {
          case KEYCODE_ENTER:
            this._finishEdit(event);
            break;
          case KEYCODE_ESC:
            event.target.blur();
            break;
        }
      });

      input.addEventListener('blur', event => {
        this._cancelEdit();
      });

      this.editInput = input;
    }

    return this.editInput;
  }

  _removeEditInput() {
    if (this.editFinished) {
      return;
    }
    this.editInput.parentNode && this.editInput.parentNode.removeChild(this.editInput);
  }

  _render(force) {
    let todos = this.todos.getAll();

    if (this.sortOrderActive) {
      todos.sort(this.sortOrderDirect ? directSorter : reverseSorter);
    }

    this.todoList.innerHTML = todos.map(todoItemTemplate).join('');
    this._renderFooter();
  }

  _renderFooter() {
    this.counterEl.innerHTML = infoTemplate(this.todos.getInfo());
    this.sortOrderActive && this.sortBtn.classList.remove('todo-btn--inactive');
    this.sortBtn.innerText = this.sortOrderDirect ? 'A-Z' : 'Z-A';
  }

  _renderStorageStatus(status) {
    let {lastTS} = this.todos.getStorageStatus();

    this.statusEl.classList.toggle('todo-footer__status--success', status === 'success');
    this.statusEl.classList.toggle('todo-footer__status--error', status === 'error');
    this.statusEl.innerText = statusTemplate(status, lastTS);
  }
}
