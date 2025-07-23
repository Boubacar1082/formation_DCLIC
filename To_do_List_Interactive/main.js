'use strict';

import { TaskList } from './TaskList.js';

const taskListElement = document.getElementById('taskList');
const completedTaskListElement = document.getElementById('completedTaskList');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const searchCompletedInput = document.getElementById('searchCompletedInput');

const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const prioritySelect = document.getElementById('prioritySelect');

// Instanciation de la liste des tâches
const taskList = new TaskList(taskListElement, completedTaskListElement);

// Fonction qui met à jour les compteurs du dashboard
function updateDashboard(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.done).length;
  const inProgress = total - completed;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('inProgressCount').textContent = inProgress;
  document.getElementById('doneCount').textContent = completed;
}

// On assigne un callback qui sera appelé à chaque modification de la liste
taskList.onChange = () => {
  updateDashboard(taskList.getAllTasks());
};

// Appelle une première fois pour initialiser le dashboard après chargement
updateDashboard(taskList.getAllTasks());

// Événement ajout de tâche
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  const priority = prioritySelect.value;

  if (text !== '') {
    taskList.addTask(text, priority);
    input.value = '';
    prioritySelect.value = 'normal';
    input.focus();
    // Plus besoin de refreshDashboard ici car c'est fait via onChange callback
  }
});

// Bouton pour supprimer toutes les tâches terminées
clearCompletedBtn.addEventListener('click', () => {
  if (confirm("Voulez-vous vraiment supprimer toutes les tâches terminées ?")) {
    taskList.clearCompleted();
  }
});

// Recherche dans les tâches terminées
searchCompletedInput.addEventListener('input', (e) => {
  const filter = e.target.value.toLowerCase();
  [...completedTaskListElement.children].forEach(li => {
    const text = li.querySelector('span').textContent.toLowerCase();
    li.style.display = text.includes(filter) ? '' : 'none';
  });
});
