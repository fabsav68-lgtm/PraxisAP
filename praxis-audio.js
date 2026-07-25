/*
  praxis-audio.js — Lecture vocale réutilisable pour les modules Praxis (SimAP)
  Mise à jour : recherche de voix élargie pour une meilleure diction, débit ralenti.
*/
 
(function () {
  var SELECTOR = window.PRAXIS_AUDIO_SELECTOR || 'h2, h3, p, li, .aide, .regle, .opt';
  var _enLecture = false;
 
  function panelActif() {
    return document.querySelector('.panel.active') || document.body;
  }
 
  function meilleureVoixFr(){
    var voix = speechSynthesis.getVoices().filter(function(v){ return v.lang && v.lang.toLowerCase().indexOf('fr') === 0; });
    if(voix.length === 0) return null;
    var bonsNoms = ['amélie','audrey','thomas','daniel'];
    var meilleure = voix.find(function(v){ return /enhanced|premium|neural/i.test(v.name); });
    if(!meilleure){
      meilleure = voix.find(function(v){
        var n = v.name.toLowerCase();
        return bonsNoms.some(function(bn){ return n.indexOf(bn) !== -1; });
      });
    }
    return meilleure || voix[0];
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
    var voix = meilleureVoixFr();
 
    var i = 0;
    function suivante() {
      if (!_enLecture || i >= textes.length) { stopLecture(); return; }
      var u = new SpeechSynthesisUtterance(textes[i++]);
      u.lang = 'fr-FR';
      u.rate = 0.9;
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
