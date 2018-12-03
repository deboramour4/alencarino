// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace BlocklyGames.soy.
 */

goog.provide('BlocklyGames.soy');

goog.require('soy');
goog.require('soydata');


BlocklyGames.soy.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '<div style="display: none"><span id="Games_name">Vers\u00E3o Beta</span><span id="Games_puzzle">Atividade</span><span id="Games_maze">Maze</span><span id="Games_bird">Bird</span><span id="Games_turtle">Turtle</span><span id="Games_movie">Movie</span><span id="Games_music">Music</span><span id="Games_pondTutor">Pond Tutor</span><span id="Games_pond">Pond</span><span id="Games_genetics">Genetics</span><span id="Games_linesOfCode1">Voc\u00EA resolveu esse problema com %1 linha de JavaScript:</span><span id="Games_linesOfCode2">Voc\u00EA resolveu esse problema com %1 linhas de JavaScript:</span><span id="Games_nextLevel">Est\u00E1 preparado para o n\u00EDvel %1?</span><span id="Games_finalLevel">Voc\u00EA \u00E9 demais!</span><span id="Games_submitTitle">Nome do projeto:</span><span id="Games_linkTooltip">Save and link to blocks.</span><span id="Games_runTooltip">Execute os comandos que voc\u00EA escolheu.</span><span id="Games_runProgram">Executar</span><span id="Games_resetTooltip">Pare o programa e reinicie a fase.</span><span id="Games_resetProgram">Retornar</span><span id="Games_help">Ajuda</span><span id="Games_dialogOk">OK</span><span id="Games_dialogCancel">Cancelar</span><span id="Games_catLogic">Logic</span><span id="Games_catLoops">Loop</span><span id="Games_catMath">Math</span><span id="Games_catText">Text</span><span id="Games_catLists">Lists</span><span id="Games_catColour">Colour</span><span id="Games_catVariables">Variables</span><span id="Games_catProcedures">Functions</span><span id="Games_httpRequestError">Houve um problema com a requisi\u00E7\u00E3o.</span><span id="Games_linkAlert">Share your blocks with this link:\\n\\n%1</span><span id="Games_hashError">Desculpa, mas \'%1\' n\u00E3o corresponde a nenhum programa salvo.</span><span id="Games_xmlError">N\u00E3o foi poss\u00EDvel carregar seu arquivo salvo. Ser\u00E1 que ele foi criado com uma vers\u00E3o diferente do Blockly?</span><span id="Games_submitted">Obrigado por ajudar meu amigo!</span><span id="Games_listVariable">list</span><span id="Games_textVariable">text</span><span id="Games_breakLink">Once you start editing JavaScript, you can\'t go back to editing blocks. Is this OK?</span><span id="Games_blocks">Blocks</div></div>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.messages.soyTemplateName = 'BlocklyGames.soy.messages';
}


BlocklyGames.soy.titleSpan = function(opt_data, opt_ignored, opt_ijData) {
  return '<span id="title">' + ((opt_ijData.html) ? '<a href="index.html?lang=' + soy.$$escapeHtml(opt_ijData.lang) + '">' : '<a href="./?lang=' + soy.$$escapeHtml(opt_ijData.lang) + '">') + 'Alencarino</a> : ' + soy.$$escapeHtml(opt_data.appName) + '</span>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.titleSpan.soyTemplateName = 'BlocklyGames.soy.titleSpan';
}


BlocklyGames.soy.levelLinks = function(opt_data, opt_ignored, opt_ijData) {
  var output = ' &nbsp; ';
  var iLimit23 = opt_data.maxLevel + 1;
  for (var i23 = 1; i23 < iLimit23; i23++) {
    output += ' ' + ((i23 == opt_data.level) ? '<span class="level_number level_done" id="level' + soy.$$escapeHtml(i23) + '">' + soy.$$escapeHtml(i23) + '</span>' : (i23 == opt_data.maxLevel) ? '<a class="level_number" id="level' + soy.$$escapeHtml(i23) + '" href="?lang=' + soy.$$escapeHtml(opt_data.lang) + '&level=' + soy.$$escapeHtml(i23) + soy.$$escapeHtml(opt_data.suffix) + '">' + soy.$$escapeHtml(i23) + '</a>' : '<a class="level_dot" id="level' + soy.$$escapeHtml(i23) + '" href="?lang=' + soy.$$escapeHtml(opt_data.lang) + '&level=' + soy.$$escapeHtml(i23) + soy.$$escapeHtml(opt_data.suffix) + '"></a>');
  }
  return output;
};
if (goog.DEBUG) {
  BlocklyGames.soy.levelLinks.soyTemplateName = 'BlocklyGames.soy.levelLinks';
}


BlocklyGames.soy.dialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogShadow" class="dialogAnimate"></div><div id="dialogBorder"></div><div id="dialog"></div>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.dialog.soyTemplateName = 'BlocklyGames.soy.dialog';
}


BlocklyGames.soy.doneDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogDone" class="dialogHiddenContent"><div id="congratulationsText" style="font-size: large; margin: 1em;">Muito bom!<br>Est\u00E1 pronto(a) para o n\u00EDvel ' + soy.$$escapeHtml(opt_ijData.level + 1) + '?</div><div id="dialogDoneButtons" class="farSide" style="padding: 1ex 3ex 0">' + ((opt_ijData.level > 1) ? '<button id="doneMap" class="third">HUB</button>' : '') + '<button id="doneOk" class="secondary">Pr\u00F3xima</button>' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</div></div>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.doneDialog.soyTemplateName = 'BlocklyGames.soy.doneDialog';
}


BlocklyGames.soy.abortDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogAbort" class="dialogHiddenContent">Esse n\u00EDvel parece muito dif\u00EDcil. Voc\u00EA acha melhor tentar um outro e voltar depois?<div class="farSide" style="padding: 1ex 3ex 0"><button id="abortCancel" class="third">Cancelar</button><button id="abortOk" class="secondary">OK</button></div></div>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.abortDialog.soyTemplateName = 'BlocklyGames.soy.abortDialog';
}


BlocklyGames.soy.storageDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="dialogStorage" class="dialogHiddenContent"><div id="containerStorage"></div>' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</div>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.storageDialog.soyTemplateName = 'BlocklyGames.soy.storageDialog';
}


BlocklyGames.soy.ok = function(opt_data, opt_ignored, opt_ijData) {
  return '<div id="doneCancel" class="farSide" style="padding: 1ex 3ex 0"><button class="secondary" onclick="BlocklyDialogs.hideDialog(true)">X</button></div>';
};
if (goog.DEBUG) {
  BlocklyGames.soy.ok.soyTemplateName = 'BlocklyGames.soy.ok';
}
