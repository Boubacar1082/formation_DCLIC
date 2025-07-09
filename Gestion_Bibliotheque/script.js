
let bibliotheque = [ ];


function ajouterLivre() {
    let titre = document.getElementById('titre').value.trim();
    let auteur = document.getElementById('auteur').value.trim();
    let annee = document.getElementById('annee').value.trim();
    let disponible = document.getElementById('disponibilite').checked;

    let livre = {
        titre: titre,
        auteur: auteur,
        annee: annee,
        disponible: disponible
    };
    bibliotheque.push(livre);

    alert(`Le livre "${titre}" à été ajouté avec succès !`);

    document.getElementById('titre').value = "";
    document.getElementById('auteur').value = "";
    document.getElementById('annee').value = "";
    document.getElementById('disponibilite').checked = false;
};

function rechercherLivre() {
    let recherche = document.getElementById('rechercher').value.trim().toLowerCase();
    let resultat = document.getElementById('resultat-verification');

    let trouve = false;

    for (let livre of bibliotheque) {
        if (livre.titre.toLowerCase() === recherche) {
          trouve = true;
          if (livre.disponible) {
            resultat.textContent = `✅ Le livre "${livre.titre}" est disponible.`;
            resultat.style.color = "green";
          } else {
            resultat.textContent = `❌ Le livre "${livre.titre}" n'est pas disponible.`;
            resultat.style.color = "red";
          }
          break;
        }
    }

    if (!trouve) {
        resultat.textContent = `❌ Livre introuvable.`;
        resultat.style.color = "gray";
    }
};