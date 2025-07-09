    // --- Text Typing automatique ---
    const autoText = "Bienvenue sur notre site de démonstration !";
    let i = 0;
    function autoTyping() {
      if (i < autoText.length) {
        document.getElementById("typingAuto").textContent += autoText[i];
        i++;
        setTimeout(autoTyping, 100);
      }
    }
    autoTyping();

    // --- Text Typing après saisie ---
    function startUserTyping() {
      const input = document.getElementById("inputUser").value;
      const output = document.getElementById("typingUser");
      output.textContent = "";
      let j = 0;
      function type() {
        if (j < input.length) {
          output.textContent += input[j];
          j++;
          setTimeout(type, 100);
        }
      }
      type();
    }

    // --- Text Typing en direct ---
    let currentLiveText = "";
    let indexLive = 0;
    document.getElementById("inputLive").addEventListener("input", function (e) {
      const valeur = e.target.value;
      const output = document.getElementById("typingLive");

      if (valeur.length > currentLiveText.length) {
        const newChar = valeur.charAt(indexLive);
        setTimeout(() => {
          output.textContent += newChar;
          indexLive++;
          currentLiveText = valeur;
        }, 80);
      } else {
        currentLiveText = valeur;
        indexLive = valeur.length;
        output.textContent = valeur;
      }
    });

    // --- Générateur de mot de passe ---
    function genererMotDePasse() {
      const length = parseInt(document.getElementById("length").value);
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let motDePasse = "";

      for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * caracteres.length);
        motDePasse += caracteres.charAt(index);
      }

      document.getElementById("passwordResult").textContent = motDePasse;
    }

    function copierMotDePasse() {
      const password = document.getElementById("passwordResult").textContent;
      if (password) {
        navigator.clipboard.writeText(password);
        alert("Mot de passe copié !");
      }
    }