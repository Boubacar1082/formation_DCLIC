"use strict";

import { TaskList } from "../TaskList.js";

function normalizeString(str) {
  return str.normalize("NFC").trim().replace(/\s+/g, " ");
}

function getCharCodes(str) {
  return Array.from(str).map((c) => c.charCodeAt(0));
}

QUnit.module("Tests To-Do List", (hooks) => {
  let taskList;
  let activeListElement;
  let completedListElement;

  hooks.beforeEach(() => {
    activeListElement = document.createElement("ul");
    completedListElement = document.createElement("ul");
    taskList = new TaskList(activeListElement, completedListElement);

    taskList.tasks = [];
    taskList.completedTasks = [];
    activeListElement.innerHTML = "";
    completedListElement.innerHTML = "";
  });

  QUnit.test("Ajout d'une tâche", (assert) => {
    taskList.addTask("Tâche de test", "normal");

    const texteStocke = normalizeString(taskList.tasks[0].text);
    const texteAttendu = normalizeString("Tâche de test");

    console.log("Codes texte stocké :", getCharCodes(texteStocke));
    console.log("Codes texte attendu:", getCharCodes(texteAttendu));

    assert.equal(taskList.tasks.length, 1, "Une tâche a été ajoutée.");
    assert.equal(
      texteStocke,
      texteAttendu,
      `Le texte enregistré doit être exactement "${texteAttendu}", mais c'est "${texteStocke}"`
    );
  });

  QUnit.test("Suppression d'une tâche", (assert) => {
    taskList.addTask("À supprimer", "normal");
    const task = taskList.tasks[0];
    taskList.deleteTask(task);

    assert.equal(taskList.tasks.length, 0, "La tâche a été supprimée.");
  });

  QUnit.test("Marquage tâche comme terminée", (assert) => {
    taskList.addTask("Tâche à terminer", "normal");
    const task = taskList.tasks[0];
    taskList.toggleTaskDone(task);

    assert.ok(task.done, "La tâche est marquée terminée.");
    assert.equal(taskList.tasks.length, 0, "La tâche a quitté la liste active.");
    assert.equal(
      taskList.completedTasks.length,
      1,
      "La tâche est dans la liste des terminées."
    );
  });

  QUnit.test("Retour d'une tâche vers la liste active", (assert) => {
    taskList.addTask("Tâche à revenir", "normal");
    const task = taskList.tasks[0];
    taskList.toggleTaskDone(task); // Terminer
    taskList.toggleTaskDone(task); // Revenir

    assert.notOk(task.done, "La tâche est de nouveau active.");
    assert.equal(taskList.completedTasks.length, 0, "La liste des terminées est vide.");
    assert.equal(taskList.tasks.length, 1, "La tâche est revenue dans la liste active.");
  });

  QUnit.test("Modification du texte et priorité", (assert) => {
    taskList.addTask("Texte initial", "normal");
    const task = taskList.tasks[0];

    task.text = "Texte modifié";
    task.priority = "high";

    assert.equal(task.text, "Texte modifié", "Le texte a été modifié.");
    assert.equal(task.priority, "high", "La priorité a été modifiée.");
  });

  QUnit.test("Réorganisation Drag & Drop (ordre DOM)", (assert) => {
    taskList.addTask("Tâche A", "low");
    taskList.addTask("Tâche B", "high");

    // Simulation : Inverser dans le DOM
    const taskItems = activeListElement.children;
    activeListElement.insertBefore(taskItems[1], taskItems[0]);

    taskList.updateTaskOrderFromDOM();

    assert.strictEqual(
      taskList.tasks[0].text,
      "Tâche B",
      "Tâche B est maintenant en première position."
    );
    assert.strictEqual(
      taskList.tasks[1].text,
      "Tâche A",
      "Tâche A est maintenant en seconde position."
    );
  });

  QUnit.test("Suppression de toutes les tâches terminées", (assert) => {
    taskList.addTask("Tâche 1", "normal");
    const task = taskList.tasks[0];
    taskList.toggleTaskDone(task); // La tâche passe en terminée

    taskList.clearCompleted();

    assert.equal(
      taskList.completedTasks.length,
      0,
      "Toutes les tâches terminées ont été supprimées."
    );
  });
});
