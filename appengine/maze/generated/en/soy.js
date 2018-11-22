// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace Maze.soy.
 */

goog.provide('Maze.soy');

goog.require('soy');
goog.require('soydata');
goog.require('BlocklyGames.soy');


Maze.soy.messages = function(opt_data, opt_ignored, opt_ijData) {
  return BlocklyGames.soy.messages(null, null, opt_ijData) + '<div style="display: none"><span id="Maze_moveForward">ande</span><span id="Maze_turnLeft">vire \u00E0 esquerda</span><span id="Maze_turnRight">vire \u00E0 direita</span><span id="Maze_doCode">fa\u00E7a</span><span id="Maze_elseCode">sen\u00E3o</span><span id="Maze_helpIfElse">Os blocos se-sen\u00E3o v\u00E3o fazer uma coisa ou outra.</span><span id="Maze_pathAhead">se tem estrada \u00E0 frente</span><span id="Maze_pathLeft">se tem estrada \u00E0 esquerda</span><span id="Maze_pathRight">se tem estrada \u00E0 direita</span><span id="Maze_repeatUntil">repita at\u00E9</span><span id="Maze_moveForwardTooltip">Faz o rob\u00F4 andar para frente uma vez.</span><span id="Maze_turnTooltip">Gira o rob\u00F4 para a esquerda ou direita.</span><span id="Maze_ifTooltip">Se tiver uma estrada nesta dire\u00E7\u00E3o, ent\u00E3o o rob\u00F4 faz estas a\u00E7\u00F5es.</span><span id="Maze_ifelseTooltip"> Se tiver uma estrada nesta dire\u00E7\u00E3o, ent\u00E3o o rob\u00F4 faz o primeiro bloco de a\u00E7\u00F5es. Caso contr\u00E1rio, ele faz o segundo bloco de a\u00E7\u00F5es.</span><span id="Maze_whileTooltip">O rob\u00F4 vai repetir as a\u00E7\u00F5es dentro do bloco at\u00E9 que encontre o ponto final do mapa.</span><span id="Maze_capacity0">Voc\u00EA n\u00E3o pode usar mais blocos.</span><span id="Maze_capacity1">Voc\u00EA s\u00F3 pode usar mais %1 bloco.</span><span id="Maze_capacity2">Voc\u00EA s\u00F3 pode usar mais %2 blocos.</span></div>';
};
if (goog.DEBUG) {
  Maze.soy.messages.soyTemplateName = 'Maze.soy.messages';
}


Maze.soy.start = function(opt_data, opt_ignored, opt_ijData) {
  return Maze.soy.messages(null, null, opt_ijData) + '<table width="100%" height="50px" id="topBar"><tr><td><h1>' + BlocklyGames.soy.titleSpan({appName: '\uD83C\uDFAE'}, null, opt_ijData) + BlocklyGames.soy.levelLinks({level: opt_ijData.level, maxLevel: opt_ijData.maxLevel, lang: opt_ijData.lang}, null, opt_ijData) + '</h1></td></tr></table>' + Maze.soy.toolbox(null, null, opt_ijData) + '<div id="mapButtonDiv"><button id="mapButton" class="primary" title="usa isso pra voltar pra o mapa"><img src="common/1x1.gif" class="map icon21">Fases</button></div><div id="helpButtonDiv"><button id="helpButton" class="primary" title="usa isso pra ajuda"><img src="common/1x1.gif" class="help icon21">Ajuda</button></div><div id="blockly"></div><div id="visualization"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="svgMaze" ><g id="look"><path d="M 0,-15 a 15 15 0 0 1 15 15" /><path d="M 0,-35 a 35 35 0 0 1 35 35" /><path d="M 0,-55 a 55 55 0 0 1 55 55" /></g></svg><div id="capacityBubble"><div id="capacity"></div></div></div><div id="pegmanMenu"></div><div id="divRunButton"><button id="runButton" class="primary" title="Makes the player do what the blocks say."><img src="common/1x1.gif" class="run icon21"> Executar</button><button id="resetButton" class="primary" style="display: none" title="Put the player back at the start of the maze."><img src="common/1x1.gif" class="stop icon21"> Retornar</button></div>' + BlocklyGames.soy.dialog(null, null, opt_ijData) + BlocklyGames.soy.doneDialog(null, null, opt_ijData) + BlocklyGames.soy.abortDialog(null, null, opt_ijData) + BlocklyGames.soy.storageDialog(null, null, opt_ijData) + '<div id="dialogMap" class="dialogHiddenContent" style="height: 100%"><center><table style="width:60%;" ><tr><td colspan="4"><center><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=0"><button class="third">In\u00EDcio</button></a></center></td></tr><tr><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=1"><button class="primary">Fase 1</button></a></td><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=2"><button class="primary">Fase 2</button></a></td><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=3"><button class="primary">Fase 3</button></a></td><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=4"><button class="primary">Fase 4</button></a></td></tr></table></center><div style="right: 0;position: absolute;bottom: 0;">' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</div></div><div id="dialogHelp" class="dialogHiddenContent" style="height: 100%"><center><table style="width:60%;" ><tr><td colspan="4"><center><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=0"><button class="third">In\u00EDcio</button></a></center></td></tr><tr><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=1"><button class="primary">Fase 1</button></a></td><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=2"><button class="primary">Fase 2</button></a></td><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=3"><button class="primary">Fase 3</button></a></td><td><a href="file:///home/deboramoura/Downloads/blockly-tests/appengine/maze.html?lang=en&level=4"><button class="primary">Fase 4</button></a></td></tr></table></center><div style="right: 0;position: absolute;bottom: 0;">' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</div></div>' + ((opt_ijData.level == 1) ? '<div id="dialogHelpStack" class="dialogHiddenContent"><table><tr><td><img src="common/help.png"></td><td>&nbsp;</td><td>Stack a couple of \'move forward\' blocks together to help me reach the goal.</td><td valign="top"><img src="maze/img/help_stack.png" class="mirrorImg" height=63 width=136></td></tr></table></div><div id="dialogHelpOneTopBlock" class="dialogHiddenContent"><table><tr><td><img src="common/help.png"></td><td>&nbsp;</td><td>On this level, you need to stack together all of the blocks in the white workspace.<div id="sampleOneTopBlock" class="readonly"></div></td></tr></table></div><div id="dialogHelpRun" class="dialogHiddenContent"><table><tr><td>Run your program to see what happens.</td><td rowspan=2><img src="common/help.png"></td></tr><tr><td><div><img src="maze/img/help_run.png" class="mirrorImg" height=27 width=141></div></td></tr></table></div>' : (opt_ijData.level == 2) ? '<div id="dialogHelpReset" class="dialogHiddenContent"><table><tr><td>Your program didn\'t solve the maze. Press \'Reset\' and try again.</td><td rowspan=2><img src="common/help.png"></td></tr><tr><td><div><img src="maze/img/help_run.png" class="mirrorImg" height=27 width=141></div></td></tr></table></div>' : (opt_ijData.level == 3 || opt_ijData.level == 4) ? ((opt_ijData.level == 3) ? '<div id="dialogHelpRepeat" class="dialogHiddenContent"><table><tr><td><img src="maze/img/help_up.png"></td><td>Reach the end of this path using only two blocks. Use \'repeat\' to run a block more than once.</td><td><img src="common/help.png"></td></tr></table></div>' : '') + '<div id="dialogHelpCapacity" class="dialogHiddenContent"><table><tr><td><img src="common/help.png"></td><td>&nbsp;</td><td>You have used up all the blocks for this level. To create a new block, you first need to delete an existing block.</td></tr></table></div><div id="dialogHelpRepeatMany" class="dialogHiddenContent"><table><tr><td><img src="maze/img/help_up.png"></td><td>You can fit more than one block inside a \'repeat\' block.</td><td><img src="common/help.png"></td></tr></table></div>' : (opt_ijData.level == 5) ? '<div id="dialogHelpSkins" class="dialogHiddenContent"><table><tr><td><img src="common/help.png"></td><td width="95%">Choose your favourite player from this menu.</td><td><img src="maze/img/help_up.png"></td></tr></table></div>' : (opt_ijData.level == 6) ? '<div id="dialogHelpIf" class="dialogHiddenContent"><table><tr><td><img src="maze/img/help_up.png"></td><td>An \'if\' block will do something only if the condition is true. Try turning left if there is a path to the left.</td><td><img src="common/help.png"></td></tr></table></div>' : (opt_ijData.level == 7) ? '<div id="dialogHelpMenu" class="dialogHiddenContent"><table><tr><td><img src="maze/img/help_up.png"></td><td id="helpMenuText">Click on %1 in the \'if\' block to change its condition.</td><td><img src="common/help.png"></td></tr></table></div>' : (opt_ijData.level == 9) ? '<div id="dialogHelpIfElse" class="dialogHiddenContent"><table><tr><td><img src="maze/img/help_down.png"></td><td>If-else blocks will do one thing or the other.</td><td><img src="common/help.png"></td></tr></table></div>' : (opt_ijData.level == 10) ? '<div id="dialogHelpWallFollow" class="dialogHiddenContent"><table><tr><td><img src="common/help.png"></td><td>&nbsp;</td><td>Can you solve this complicated maze? Try following the left-hand wall. Advanced programmers only!' + BlocklyGames.soy.ok(null, null, opt_ijData) + '</td></tr></table></div>' : '');
};
if (goog.DEBUG) {
  Maze.soy.start.soyTemplateName = 'Maze.soy.start';
}


Maze.soy.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none;">' + ((opt_ijData.level > 0) ? '<block type="maze_moveForward"></block><block type="maze_catchObject"></block>' + ((opt_ijData.level > 1) ? '<block type="maze_jumpForward"></block>' + ((opt_ijData.level > 2) ? '<block type="maze_turn"><field name="DIR">turnRight</field></block>' + ((opt_ijData.level == 5) ? '<block type="maze_ifCustom"></block>' : (opt_ijData.level == 6) ? '<block type="maze_forever"></block>' : (opt_ijData.level > 6) ? '<block type="maze_ifCustom"></block><block type="maze_forever"></block>' : '') : '') : '') : '') + '</xml>';
};
if (goog.DEBUG) {
  Maze.soy.toolbox.soyTemplateName = 'Maze.soy.toolbox';
}
