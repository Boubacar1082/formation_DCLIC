'use strict';

let draggedItem = null;

export function createTaskElement(task, saveCallback, deleteCallback, updateOrderCallback, toggleDoneCallback) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.classList.add(`priority-${task.priority}`);
  if (task.done) li.classList.add('done');
  li.draggable = true;
  
  // Drag & Drop
  li.addEventListener('dragstart', (e) => {
    draggedItem = li;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => li.classList.add('hide'), 0);
  });

  li.addEventListener('dragend', () => {
    draggedItem = null;
    li.classList.remove('hide');
  });

  li.addEventListener('dragover', (e) => {
    e.preventDefault();
    const bounding = li.getBoundingClientRect();
    const offset = e.clientY - bounding.top;

    try {
      if (offset > bounding.height / 2) {
        li.parentNode.insertBefore(draggedItem, li.nextSibling);
      } else {
        li.parentNode.insertBefore(draggedItem, li);
      }
      updateOrderCallback();
    } catch (error) {
      console.error("Erreur drag & drop :", error);
    }
  });

  // Texte de la tâche
  const span = document.createElement('span');
  span.textContent = task.text;

  // Affichage priorité
  const prioritySpan = document.createElement('span');
  prioritySpan.textContent = `Priorité : ${task.priority}`;
  prioritySpan.classList.add('priority-text');

  // Bouton 🎨 pour changer priorité
  const priorityBtn = document.createElement('button');
  priorityBtn.textContent = '🎨';
  priorityBtn.title = 'Changer la priorité';

  // Select pour changer la priorité (caché au début)
  const prioritySelect = document.createElement('select');
  prioritySelect.style.display = 'none';
  prioritySelect.classList.add('priority-select');

  ['low', 'normal', 'high'].forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    if (task.priority === value) option.selected = true;
    prioritySelect.appendChild(option);
  });

  // Au clic sur le bouton 🎨, on cache le bouton et on affiche le select
  priorityBtn.onclick = () => {
    priorityBtn.style.display = 'none';
    prioritySelect.style.display = 'inline-block';
    prioritySelect.focus();
  };

  // Quand on change la priorité via le select
  prioritySelect.onchange = () => {
    const newPriority = prioritySelect.value;

    li.classList.remove('priority-low', 'priority-normal', 'priority-high');
    task.priority = newPriority;
    li.classList.add(`priority-${task.priority}`);

    prioritySpan.textContent = `Priorité : ${task.priority}`;

    saveCallback();

    prioritySelect.style.display = 'none';
    priorityBtn.style.display = 'inline-block';
  };

  // Si le select perd le focus, on revient au bouton 🎨
  prioritySelect.onblur = () => {
    prioritySelect.style.display = 'none';
    priorityBtn.style.display = 'inline-block';
  };

  // Bouton modifier
  const editBtn = document.createElement('button');
  editBtn.textContent = '✏️';
  editBtn.title = 'Modifier';
  editBtn.onclick = () => {
    const newText = prompt('Modifier la tâche :', task.text);
    if (newText && newText.trim() !== '') {
      task.text = newText.trim();
      span.textContent = task.text;
      saveCallback();
    }
  };

  // Bouton terminé / non terminé
  const doneBtn = document.createElement('button');
  doneBtn.textContent = task.done ? '↩️' : '✅';
  doneBtn.onclick = () => {
    toggleDoneCallback(task);
  };

  // Bouton supprimer
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑️';
  deleteBtn.onclick = () => {
    li.classList.add('removing');
    setTimeout(() => {
      li.remove();
      deleteCallback(task);
    }, 500);
  };

  li.style.position = 'relative'; // Pour positionner correctement les éléments si besoin

  li.append(span, prioritySpan, priorityBtn, prioritySelect, editBtn, doneBtn, deleteBtn);
  

  return li;
}
