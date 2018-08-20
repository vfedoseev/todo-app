export function todoItemTemplate(todo) {
  let statusClassName = !!todo.completed ? 'todo-item--completed' : '';
  return `<li class="todo-list__item" data-id="${todo.id}">
    <span class="todo-item ${statusClassName}" data-action="toggle">
      <span class="todo-item__text">
        <span class="todo-item__title">${todo.title}</span>
      </span>
      <span class="todo-item__controls">
        <button class="todo-btn todo-btn--transparent" data-action="edit">
          Edit
        </button>
        <button class="todo-btn todo-btn--lg todo-btn--transparent" data-action="remove">
          &times;
        </button>
      </span>
    </span>
  </li>`;
}

export function infoTemplate(info) {
  return `Completed: ${info.completed} / Total: ${info.total}`;
}

export function statusTemplate(status, lastTS) {
  return `Storage ${status} | Last saved: ${lastTS < 0 ? 'Never' : (new Date(lastTS)).toLocaleString()}`;
}
