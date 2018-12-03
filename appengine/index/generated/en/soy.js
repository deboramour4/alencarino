// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Index.soy.
 */

goog.provide('Index.soy');

goog.require('soy');
goog.require('soydata');
goog.require('BlocklyGames.soy');


Index.soy.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '<div style="display: none"><span id="title">Alencarino</span></div>';
};
if (goog.DEBUG) {
  Index.soy.messages.soyTemplateName = 'Index.soy.messages';
}


Index.soy.start = function(opt_data, opt_ignored, opt_ijData) {
  return Index.soy.messages(null, null, opt_ijData) + '<div id="header"><img id="imgAle" src="maze/img/ale.png" title="Oi, eu sou Al\u00EA!" alt="Oi, eu sou Al\u00EA!"><img id="imgRobot" src="maze/img/ferrao.png" title="Oi, eu sou Ferr\u00E3o!" alt="Oi, eu sou Ferr\u00E3o!"><div id="startButtonDiv"><button id="startButton" class="secondary" title="Clique aqui para iniciar o jogo.">Come\u00E7ar</button></div></div><div id="preferencesButtonDiv"><button id="preferencesButton" class="primary" title="Clique aqui para mudar as prefer\u00EAncias.">Ajustes</button></div><div id="creditsButtonDiv"><button id="creditsButton" class="primary" title="Clique aqui para ver os cr\u00E9ditos.">Cr\u00E9ditos</button></div>' + BlocklyGames.soy.dialog(null, null, opt_ijData) + '<div id="dialogPreferences" class="dialogHiddenContent"><ul class="preferences"><li><div id="clearDataButtonDiv"><button id="clearDataButton" class="primary" title="Clique aqui para deletar todo o seu progresso">Reiniciar</button></div></li><li><h1>Clique aqui para deletar todo o seu progresso.</h1></li></ul><ul class="preferences"><li><button id="musicOnButton" class="primary" title="Liga o som">Ligar</button><button id="musicOffButton" class="primary" title="Desliga o som">Desligar</button></li><li><h1>Clique aqui para ligar/desligar o som.</h1></li></ul><div style="right: 0;position: absolute;bottom: 0;">' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</div></div><div id="dialogCredits" class="dialogHiddenContent"><center><img src="maze/img/helps/level_help_4.png" class="helpModalImage"></center><div style="right: 0;position: absolute;bottom: 0;">' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</div></div>';
};
if (goog.DEBUG) {
  Index.soy.start.soyTemplateName = 'Index.soy.start';
}
