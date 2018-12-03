/**
 * Blockly Games: Index
 *
 * Copyright 2014 Google Inc.
 * https://github.com/google/blockly-games
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly Game's index page.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Index');

goog.require('BlocklyGames');
goog.require('BlocklyInterface');
goog.require('BlocklyDialogs');
goog.require('Index.soy');


/**
 * Array of application names.
 */
Index.APPS = ['puzzle', 'maze', 'bird', 'turtle', 'movie', 'music',
              'pond-tutor', 'pond-duck'];

/**
 * Set the music preference in navigator
 * to "on"
 */
Index.setMusicPreferences = function() {
  if (typeof(Storage) !== "undefined") {

    if (window.sessionStorage.getItem("musicState") == null) {
      window.sessionStorage.setItem("musicState", "on"); 
    }
  } else {
      alert("Não é possível configurar o som.")
  }
}
Index.setMusicPreferences()

/**
 * Set the music preference in navigator
 * param state -> "on" or "off"
 */
Index.changeMusicPreferences = function(state) {
  if (typeof(Storage) !== "undefined") {
    window.sessionStorage.setItem("musicState", state); 
  } else {
      alert("Não é possível configurar o som.")
  }
}

/**
 * Initialize Blockly and the maze.  Called on page load.
 */
Index.init = function() {
  // Render the Soy template.
  document.body.innerHTML = Index.soy.start({}, null,
    {lang: BlocklyGames.LANG,
     html: BlocklyGames.IS_HTML,
     rtl: BlocklyGames.isRtl()});

  BlocklyGames.init();

  // var languageMenu = document.getElementById('languageMenu');
  // languageMenu.addEventListener('change', BlocklyGames.changeLanguage, true);

  BlocklyGames.bindClick('startButton', Index.startGame);
  BlocklyGames.bindClick('preferencesButton', Index.showPreferencesDialog);
  BlocklyGames.bindClick('creditsButton', Index.showCreditsDialog);

  BlocklyGames.bindClick('clearDataButton', Index.clearData);
  BlocklyGames.bindClick('musicOnButton', Index.toggleMusic);
  BlocklyGames.bindClick('musicOffButton', Index.toggleMusic);


  if (window.sessionStorage.getItem("musicState") == "off") {
    var musicButton = document.getElementById("musicOffButton")
    musicButton.classList.add("musicHide")
  } else {
    var musicButton = document.getElementById("musicOnButton")
    musicButton.classList.add("musicHide")
  } 

  var storedData = false;
  var levelsDone = [];
  for (var i = 0; i < Index.APPS.length; i++) {
    levelsDone[i] = 0;
    for (var j = 1; j <= BlocklyGames.MAX_LEVEL; j++) {
      if (BlocklyGames.loadFromLocalStorage(Index.APPS[i], j)) {
        storedData = true;
        levelsDone[i]++;
      }
    }
  }

  if (storedData) {
    // var clearButtonPara = document.getElementById('clearDataPara');
    // clearButtonPara.style.visibility = 'visible';
    // BlocklyGames.bindClick('clearData', Index.clearData_);
  }
};

/**
 * Clear all stored data.
 * @private
 */
Index.clearData_ = function() {
  if (!confirm(BlocklyGames.getMsg('Index_clear'))) {
    return;
  }
  for (var i = 0; i < Index.APPS.length; i++) {
    for (var j = 1; j <= BlocklyGames.MAX_LEVEL; j++) {
      delete window.localStorage[Index.APPS[i] + j];
      // alert(Index.APPS[i] +j)
    }
  }
  location.reload();
};

// Show preferences modal dialog.
Index.showPreferencesDialog = function(e){
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }
  var content = document.getElementById('dialogPreferences');
  var style = {};

  var cssText =
    "height: 0;"+
    "padding-top: 30%;"+
    "background: url(maze/img/map_bg.png) center/contain no-repeat #d3d993;"+
    "margin: 10% 25%;"+
    "width: 50%;";
  var dialog = document.getElementById('dialog')
  dialog.style.cssText = cssText

  BlocklyDialogs.showDialog(content, null, false, true, style, null);
};

// Show credits modal dialog.
Index.showCreditsDialog = function(e){
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }
  var content = document.getElementById('dialogCredits');
  var style = {};

  var cssText =
    "height: 0;"+
    "padding-top: 40%;"+
    "background: url(maze/img/helps/level_help_4.png) top/contain no-repeat #fff;"+
    "margin: 10% 25%;"+
    "width: 50%;";

  var dialog = document.getElementById('dialog')
  dialog.style.cssText = cssText

  BlocklyDialogs.showDialog(content, null, false, true, style, null);
};

// Starts the game
Index.startGame = function(){
  window.location.replace("maze.html?level=1");
};


/**
 * Clear all stored data.
 */
Index.clearData  = function() {
  if (!confirm("Tem certeza que quer deletar todo o seu progresso?")) {
    return;
  }
  for (var i = 1; i <= BlocklyGames.MAX_LEVEL; i++) {
    delete window.localStorage['maze' + i];
  }
  window.sessionStorage.removeItem('musicState')

  location.reload();
};

/**
 * toggleMusic OFF/ON.
 */
Index.toggleMusic  = function() {
  var musicOnButton = document.getElementById("musicOnButton")
  var musicOffButton = document.getElementById("musicOffButton")

  if (window.sessionStorage.getItem("musicState") == "on") {

      musicOnButton.classList.remove("musicHide")
      musicOffButton.classList.add("musicHide")

      Index.changeMusicPreferences("off") 

    } else if (window.sessionStorage.getItem("musicState") == "off") {

      musicOnButton.classList.add("musicHide")
      musicOffButton.classList.remove("musicHide")

      Index.changeMusicPreferences("on") 
    } else {
      alert("Desculpe, não é possível alterar as preferências de som.")
    }

};


window.addEventListener('load', Index.init, false);