/*
  praxis-audio.js — Lecture vocale réutilisable pour les modules Praxis (SimAP)
  À UPLOADER À LA RACINE DU REPO PraxisAP — ce fichier était référencé par les 12
  modules mais n'existait pas encore, donc le bouton ne faisait rien au clic.

  INTÉGRATION DANS UN MODULE (rappel, déjà fait sur les 12 modules SimAP) :

  1) Bouton, là où se trouve la barre de score/navigation :
     <button class="btn-audio" id="btn-audio" onclick="lireOnglet()">🔊 Écouter</button>

  2) Style du bouton dans le <style> du module (couleur d'accent à adapter par module) :
     .btn-audio{position:fixed;bottom:16px;right:16px;background:var(--em);color:#0a0d0f;
       padding:10px 18px;border-radius:24px;font-size:13px;font-weight:700;
       cursor:pointer;z-index:1000;box-shadow:0 4px 16px rgba(0,0,0,.4);}

  3) Inclure ce script juste avant la fermeture </body> :
     <script src="praxis-audio.js"></script>

  PERSONNALISATION (optionnelle) :
     <script>window.PRAXIS_AUDIO_SELECTOR = "h2, h3, p, li, .ma-classe";</script>
     <script src="praxis-audio.js"></script>
*/

(function () {
  var SELECTOR = window.PRAXIS_AUDIO_SELECTOR || 'h2, h3, p, li, .aide, .regle, .opt';
  var _enLecture = false;

  function panelActif() {
    return document.querySelector('.panel.active') || document.body;
  }

  function meilleureVoixFr(){
    var voix = speechSynthesis.getVoices().filter(function(v){ return v.lang && v.lang.toLowerCase().indexOf('fr') === 0; });
    var meilleure = voix.find(function(v){ return /enhanced|premium|neural/i.test(v.name); });
    return meilleure || voix[0] || null;
  }

  function lireOnglet() {
    if (_enLecture) { stopLecture(); return; }
    if (!('speechSynthesis' in window)) {
      alert('Lecture audio non disponible sur ce navigateur.');
      return;
    }
    var conteneur = panelActif();
    var textes = [];
    conteneur.querySelectorAll(SELECTOR).forEach(function (el) {
      var t = el.innerText.trim();
      if (t.length > 2) textes.push(t);
    });
    if (textes.length === 0) return;

    _enLecture = true;
    var btn = document.getElementById('btn-audio');
    if (btn) btn.textContent = '⏹ Stop';

    var i = 0;
    function suivante() {
      if (!_enLecture || i >= textes.length) { stopLecture(); return; }
      var u = new SpeechSynthesisUtterance(textes[i++]);
      u.lang = 'fr-FR';
      u.rate = 0.95;
      var voix = meilleureVoixFr();
      if (voix) u.voice = voix;
      u.onend = suivante;
      u.onerror = suivante;
      speechSynthesis.speak(u);
    }
    speechSynthesis.cancel();
    setTimeout(suivante, 50);
  }

  function stopLecture() {
    _enLecture = false;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    var btn = document.getElementById('btn-audio');
    if (btn) btn.textContent = '🔊 Écouter';
  }

  window.lireOnglet = lireOnglet;
  window.stopLecture = stopLecture;
})();
