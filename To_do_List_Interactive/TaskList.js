"use strict";

import { createTaskElement } from "./Task.js";

export class TaskList {
  constructor(activeListElement, completedListElement) {
    this.activeListElement = activeListElement;
    this.completedListElement = completedListElement;
    this.tasks = [];
    this.completedTasks = [];
    this.onChange = null; // Callback à appeler à chaque modification
    this.loadTasks();
  }

  addTask(text, priority = "normal") {
    const task = { text: text.trim(), priority, done: false };
    this.tasks.push(task);
    this.render();
    this.saveTasks();
    this.notifyChange();
  }

  deleteTask(taskToDelete) {
    this.tasks = this.tasks.filter((t) => t !== taskToDelete);
    this.completedTasks = this.completedTasks.filter((t) => t !== taskToDelete);
    this.render();
    this.saveTasks();
    this.notifyChange();
  }

  toggleTaskDone(task) {
    task.done = !task.done;
    if (task.done) {
      // Déplacer la tâche dans les terminées
      this.tasks = this.tasks.filter((t) => t !== task);
      this.completedTasks.push(task);
    } else {
      // Remettre la tâche dans les actives
      this.completedTasks = this.completedTasks.filter((t) => t !== task);
      this.tasks.push(task);
    }
    this.render();
    this.saveTasks();
    this.notifyChange();
  }

  clearCompleted() {
    this.completedTasks = [];
    this.render();
    this.saveTasks();
    this.notifyChange();
  }

  saveTasks() {
    try {
      localStorage.setItem("todo-tasks-active", JSON.stringify(this.tasks));
      localStorage.setItem(
        "todo-tasks-completed",
        JSON.stringify(this.completedTasks)
      );
    } catch (e) {
      console.error("Erreur sauvegarde", e);
    }
  }

  loadTasks() {
    try {
      const active = localStorage.getItem("todo-tasks-active");
      const completed = localStorage.getItem("todo-tasks-completed");
      this.tasks = active ? JSON.parse(active) : [];
      this.completedTasks = completed ? JSON.parse(completed) : [];
      this.render();
      this.notifyChange();
    } catch (e) {
      this.tasks = [];
      this.completedTasks = [];
      console.error("Erreur chargement", e);
    }
  }

  render() {
    this.activeListElement.innerHTML = "";
    this.completedListElement.innerHTML = "";

    this.tasks.forEach((task) => {
      const li = createTaskElement(
        task,
        this.saveTasks.bind(this),
        this.deleteTask.bind(this),
        () => {}, // placeholder updateOrderCallback
        this.toggleTaskDone.bind(this)
      );
      this.activeListElement.appendChild(li);
    });

    this.completedTasks.forEach((task) => {
      const li = createTaskElement(
        task,
        this.saveTasks.bind(this),
        this.deleteTask.bind(this),
        () => {}, // placeholder updateOrderCallback
        this.toggleTaskDone.bind(this)
      );
      li.classList.add("done");
      this.completedListElement.appendChild(li);
    });
  }

  // Renvoie toutes les tâches (actives + terminées)
  getAllTasks() {
    return [...this.tasks, ...this.completedTasks];
  }

  // Appelle le callback onChange s'il existe
  notifyChange() {
    if (this.onChange) {
      this.onChange();
    }
  }

  // La Gestion du test
  updateTaskOrderFromDOM() {
    const newOrder = [];
    this.activeListElement.querySelectorAll("li").forEach((li) => {
      const text = li.querySelector("span").textContent;
      const task = [...this.tasks, ...this.completedTasks].find(
        (t) => t.text === text && !t.done
      );
      if (task) {
        newOrder.push(task);
      }
    });
    this.tasks = newOrder;
    this.saveTasks();
    this.notifyChange();
  }
}
