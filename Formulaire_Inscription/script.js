//Le champs nom & prenom
const nomPrenomSaisie = document.getElementById("nomPrenom");
const message = document.getElementById("messageNom");

//Les variables du botton se connecter
const btnConnecter = document.getElementById("btnConnecter");
let nomValide = false;
let mdpValide = false;

//Ecouter la saisie dans le champs
nomPrenomSaisie.addEventListener("input", function () {
    const valeurSaisie = nomPrenomSaisie.value.trim();

    if(valeurSaisie.length < 6) {
        message.textContent = "Text invalide (minimum 6 caractères)";
        message.style.display = "block";
        nomValide = false;
    }else {
        message.textContent = "";
        message.style.display = "none";
        nomValide = true;
    }

    activerOuBloquerBoutton();
});

//Pour le mot de passe
const motdePasseSaisie = document.getElementById("motdePasse");
const messageP = document.getElementById("messagePassword");

//Ecouter la saisie du champs
motdePasseSaisie.addEventListener("input", function() {
    const valeurMotDePasse = motdePasseSaisie.value.trim();
    // Regex : au moins 8 caractères, 1 majuscule, 1 chiffre
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if(!regex.test(valeurMotDePasse)) {
        messageP.textContent = "Mot de Passe faible (8 caractères minimum avec 1 majuscule et 1 chiffre)";
        messageP.style.display = "block";
        mdpValide = false;
    }else {
        messageP.textContent = "";
        messageP.style.display = "none";
        mdpValide = true;
    }

    activerOuBloquerBoutton();
});
//Le Boutton se connecter

//Activer ou bloquer le boutton selon la validite
function activerOuBloquerBoutton() {
    btnConnecter.disabled = !(nomValide && mdpValide);
};

//Afficher si tout est valide
btnConnecter.addEventListener("click", function() {
    const nomPrenom = nomPrenomSaisie.value.trim();
    const motdePasse = motdePasseSaisie.value.trim();
    alert(`Bienvenue ${nomPrenom} !\n Votre Mot de Passe est: ${motdePasse}`);
});

