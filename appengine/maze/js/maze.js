/**
 * Blockly Games: Maze
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview JavaScript for Blockly's Maze application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Maze');

goog.require('Blockly.FieldDropdown');
goog.require('BlocklyDialogs');
goog.require('BlocklyGames');
goog.require('BlocklyInterface');
goog.require('Maze.Blocks');
goog.require('Maze.soy');

BlocklyGames.NAME = 'maze';

/**
 * Go to the next level.  Add skin parameter.
 */
BlocklyInterface.nextLevel = function() {
  if (BlocklyGames.LEVEL < BlocklyGames.MAX_LEVEL) {
    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname +
        '?level=' + (BlocklyGames.LEVEL + 1);
  } else {
    BlocklyInterface.indexPage();
  }
};

Maze.MAX_BLOCKS = [Infinity, // Level 0.
    Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity][BlocklyGames.LEVEL];


// Crash type constants.
Maze.CRASH_STOP = 1;
Maze.CRASH_SPIN = 2;
Maze.CRASH_FALL = 3;

Maze.SKINS = [
  // sprite: A 1029x51 set of 21 avatar images.
  // tiles: A 250x200 set of 20 map images.
  // marker: A 20x34 goal image.
  // background: An optional 400x450 background image, or false.
  // graph: Colour of optional grid lines, or false.
  // look: Colour of sonar-like look icon.
  // winSound: List of sounds (in various formats) to play when the player wins.
  // crashSound: List of sounds (in various formats) for player crashes.
  // crashType: Behaviour when player crashes (stop, spin, or fall).
  {
    sprite: 'maze/img/robot.png',
    tiles: 'maze/img/tiles0.png',
    marker: 'maze/img/objects/tire.png',
    obstacle: 'maze/img/objects/obstacle.png',
    background: 'maze/img/background.png',
    objects: ['maze/img/objects/spring.png', 'maze/img/objects/compass.png', 'maze/img/objects/speaker.png', 'maze/img/objects/tire.png'],
    graph: false,
    look: '#000',
    winSound: ['maze/sounds/win.mp3', 'maze/sounds/win.ogg'],
    crashSound: ['maze/sounds/fail.mp3', 'maze/sounds/fail.ogg'],
    music: ['maze/sounds/music_bg.mp3', 'maze/sounds/music_bg.ogg'],
    crashType: Maze.CRASH_STOP
  }
];

Maze.HUB = {
    ground: ['maze/img/hub/ground_dirty.png','maze/img/hub/ground_clean.png'],
    speaker: ['maze/img/hub/speakers_off.png','maze/img/hub/speakers_on.png'],
    street: ['maze/img/hub/street_unpaved.png','maze/img/hub/street_paved.png'],
    enviroment: [['maze/img/hub/enviroment_deforested0.png', 'maze/img/hub/enviroment_deforested1.png'],
                 ['maze/img/hub/enviroment_forested0.png', 'maze/img/hub/enviroment_forested1.png' ]],
    ale: 'maze/img/ale.png',
    ferrao: 'maze/img/ferrao.png',
    music: ['maze/sounds/music_bg.mp3', 'maze/sounds/music_bg.ogg'],
    graph: false,
    background: 'maze/img/hub/background.png',
    tiles: 'maze/img/hub/tiles.png',
    bgColor: '#000',
    speakerSound: ['maze/sounds/speakers_music.mp3', 'maze/sounds/speakers_music.ogg']
  };

Maze.SKIN_ID = 0;

Maze.SKIN = Maze.SKINS[Maze.SKIN_ID];

/**
 * Milliseconds between each animation frame.
 */
Maze.stepSpeed;

/**
 * The types of squares in the maze, which is represented
 * as a 2D array of SquareType values.
 * @enum {number}
 */
Maze.SquareType = {
  WALL: 0,
  OPEN: 1,
  START: 2,
  FINISH: 3,
  OBSTACLE: 4
};

Maze.SquareTypeHUB = {
  EMPTY: 0,
  GROUND: 1,
  ENVIROMENT: 2,
  SPEAKER: 3,
  STREET: 4,
  ALE: 5
};

// The maze square constants defined above are inlined here
// for ease of reading and writing the static mazes.
Maze.map = [
// Level 0.
 [[0],
  [3],
  [2],
  [2],
  [1],
  [4]],
// Level 1.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 4, 1, 4, 1, 0],
  [0, 0, 1, 2, 1, 0, 0],
  [0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 2.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 1, 4, 4, 4, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 4, 4, 4, 1, 0],
  [0, 0, 1, 2, 1, 0, 0]],
// Level 3.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 4, 1, 1, 1, 4, 0],
  [0, 1, 1, 2, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 4, 0, 1, 0],
  [0, 1, 4, 3, 4, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 4.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 4, 1, 1, 0],
  [0, 1, 3, 1, 3, 1, 0],
  [0, 4, 1, 0, 1, 4, 0],
  [0, 2, 3, 1, 3, 1, 0],
  [0, 1, 1, 4, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 5.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 4, 3, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 4, 4, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 6.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 4, 0, 0, 0, 4, 0],
  [4, 3, 1, 1, 1, 4, 4],
  [0, 1, 0, 2, 0, 1, 0],
  [4, 4, 4, 0, 4, 4, 4],
  [0, 4, 0, 0, 0, 4, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 7.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 1, 4, 4, 1, 3, 0],
  [0, 4, 0, 1, 0, 1, 0],
  [0, 1, 4, 4, 1, 4, 0],
  [0, 4, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 8.
 [[0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 1, 0, 1, 0],
  [0, 2, 1, 1, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 9.
 [[0, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 0],
  [3, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 2, 1],
  [0, 0, 0, 0, 0, 0, 0]],
// Level 10.
 [[0, 1, 1, 0, 3, 0, 1],
  [0, 1, 1, 0, 1, 1, 1],
  [0, 1, 0, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 1],
  [0, 2, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0]]
][BlocklyGames.LEVEL];

/**
 * Measure maze dimensions and set sizes.
 * ROWS: Number of tiles down.
 * COLS: Number of tiles across.
 * SQUARE_SIZE: Pixel height and width of each maze square (i.e. tile).
 */
Maze.ROWS = Maze.map.length;
Maze.COLS = Maze.map[0].length;

Maze.setConstantsValues = function(e) {
  var dpr = 1
  Maze.SCREEN_WIDTH = window.innerWidth* dpr 
  Maze.SCREEN_HEIGHT = window.innerHeight* dpr

  if (BlocklyGames.LEVEL == 0){
    Maze.SQUARE_SIZE = (Maze.SCREEN_WIDTH*0.70)/Maze.COLS;
    Maze.SQUARE_HEIGHT = (Maze.SCREEN_HEIGHT)/Maze.ROWS;
    Maze.PEGMAN_HEIGHT = (Maze.SCREEN_WIDTH*0.70)/Maze.COLS + 5;

    Maze.PEGMAN_WIDTH = (Maze.SCREEN_WIDTH*0.70)/Maze.COLS - 5;
    Maze.MAZE_WIDTH = Maze.SQUARE_SIZE * Maze.COLS;
    Maze.MAZE_HEIGHT = Maze.SQUARE_SIZE * Maze.ROWS;

    Maze.ZOOM_WORKSPACE = Maze.SCREEN_WIDTH/760

    Maze.MAZE_TOP_OFFSET = 0
  } else {
    Maze.SQUARE_SIZE = (Maze.SCREEN_WIDTH*0.4)/Maze.COLS;
    Maze.PEGMAN_HEIGHT = (Maze.SQUARE_SIZE*1.5) + 15;
    Maze.PEGMAN_WIDTH = (Maze.SQUARE_SIZE*1.5) - 15;

    Maze.MAZE_WIDTH = Maze.SQUARE_SIZE * Maze.COLS;
    Maze.MAZE_HEIGHT = Maze.SQUARE_SIZE * Maze.ROWS;
    Maze.PATH_WIDTH = Maze.SQUARE_SIZE / 3;

    Maze.ZOOM_WORKSPACE = Maze.SCREEN_WIDTH/680
    Maze.MAZE_TOP_OFFSET = (Maze.SCREEN_HEIGHT/2)-(Maze.MAZE_WIDTH/2) // to centralize
  }
  
}
Maze.setConstantsValues()

/**
 * Constants for cardinal directions.  Subsequent code assumes these are
 * in the range 0..3 and that opposites have an absolute difference of 2.
 * @enum {number}
 */
Maze.DirectionType = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3
};

/**
 * Outcomes of running the user program.
 */
Maze.ResultType = {
  UNSET: 0,
  SUCCESS: 1,
  FAILURE: -1,
  TIMEOUT: 2,
  ERROR: -2
};

/**
 * Result of last execution.
 */
Maze.result = Maze.ResultType.UNSET;

/**
 * Catched object counter.
 * One for the actual match and one for the whole level.
 * The totalLevelObjectsCatched doesn't change to 0 when reset button is pressed
 */
Maze.objectsCatched = 0;
Maze.totalLevelObjectsCatched = 0;

/**
 * Starting direction.
 */
Maze.startDirection = Maze.DirectionType.NORTH;

/**
 * PIDs of animation tasks currently executing.
 */
Maze.pidList = [];


//Make easier to begginers to connect blocks
Blockly.SNAP_RADIUS *= 2;

// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/West/South/East squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
Maze.tile_SHAPES = {
  '10010': [4, 0],  // Dead ends
  '10001': [3, 3],
  '11000': [0, 1],
  '10100': [0, 2],
  '11010': [4, 1],  // Vertical
  '10101': [3, 2],  // Horizontal
  '10110': [0, 0],  // Elbows
  '10011': [2, 0],
  '11001': [4, 2],
  '11100': [2, 3],
  '11110': [1, 1],  // Junctions
  '10111': [1, 0],
  '11011': [2, 1],
  '11101': [1, 2],
  '11111': [2, 2],  // Cross
  'null0': [4, 3],  // Empty
  'null1': [3, 0],
  'null2': [3, 1],
  'null3': [0, 3],
  'null4': [1, 3]
};

window.onresize = function(){
  //Maze.setConstantsValues(null)
};

Maze.fullscreen = function() {
  // if (!confirm("Quer ativar a tela cheia?")) {
  //   return;
  // }

  var body = document.getElementsByTagName("body")[0];
  if (body.requestFullscreen) {
    body.requestFullscreen();
  } else if (body.mozRequestFullScreen) { /* Firefox */
    body.mozRequestFullScreen();
  } else if (body.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    body.webkitRequestFullscreen();
  } else if (body.msRequestFullscreen) { /* IE/Edge */
    body.msRequestFullscreen();
  }
}

/** Array with all the levels of the game and "true" if already passed
 * that level, and "false" if not
 * Maze.LEVELS_DONE[0] is the HUB and it's always open
 */
Maze.LEVELS_DONE = [true, false, false, false, false]

/**
 * Check which level is done or not
 * return an array with booleans
 */
Maze.checkLevelsInStorage  = function() {
  for (var i = 1; i <= BlocklyGames.MAX_LEVEL; i++) {
    if (BlocklyGames.loadFromLocalStorage('maze', i)) {
      Maze.LEVELS_DONE[i] = true;
    }
  }
};
Maze.checkLevelsInStorage()

/**
 * Create and layout all the nodes for the path, scenery, Pegman, and goal.
 */

//Height of the top navigation bar  (if needed)
var topBarHeight = 0;

Maze.drawMap = function() {
  
  if (BlocklyGames.LEVEL == 0) {
    // Liveview Dimentions
    var svg = document.getElementById('svgMaze');
    svg.setAttribute('width', Maze.SCREEN_WIDTH*0.70);
    svg.setAttribute('height', Maze.SCREEN_HEIGHT - topBarHeight);
    svg.style.left = (Maze.SCREEN_WIDTH*0.3) + 'px';
    svg.style.position = 'fixed';

    // Draw the square of liveview 
    var square = document.createElementNS(Blockly.SVG_NS, 'rect');
    square.setAttribute('width', Maze.SCREEN_WIDTH*0.70);
    square.setAttribute('height', Maze.SCREEN_HEIGHT - topBarHeight);
    square.style.left = (Maze.SCREEN_WIDTH*0.70) + 'px';
    square.style.position = 'fixed';
    square.setAttribute('fill', '#5DBCD2');
    square.setAttribute('stroke-width', 1);
    square.setAttribute('stroke', '#CCB');
    svg.appendChild(square);

    //Move run button
    var runButton = document.getElementById("divRunButton")
    var cssText = "bottom: 3.5%;position: fixed;left: 6.5%;"
    runButton.style.cssText = cssText

    //set background
    var bg = document.createElementNS(Blockly.SVG_NS, 'image');
    bg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
        Maze.HUB.background);

    bg.setAttribute('height', Maze.SCREEN_HEIGHT - topBarHeight);
    bg.setAttribute('width', Maze.SCREEN_WIDTH*0.70); 
    bg.setAttribute('x', 0);
    bg.setAttribute('y', 0);
    svg.appendChild(bg);

    var enviromentCount = 0
    var putPegman = false 

    for (var y = 0; y < Maze.ROWS; y++) {
      for (var x = 0; x < Maze.COLS; x++) {

        if (putPegman) {
          
          // Add Ale
          var aleIcon = document.createElementNS(Blockly.SVG_NS, 'image');
          aleIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.ale);
          aleIcon.setAttribute('id', 'ale');
          aleIcon.setAttribute('width', Maze.SQUARE_SIZE);
          aleIcon.setAttribute('height', Maze.SQUARE_HEIGHT);
          svg.appendChild(aleIcon);

          aleIcon.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.5) -
              aleIcon.getAttribute('width')/2);
          aleIcon.setAttribute('y', Maze.SQUARE_HEIGHT * (3.5));

          // Add Pegman
          var ferraoIcon = document.createElementNS(Blockly.SVG_NS, 'image');
          ferraoIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.ferrao);
          ferraoIcon.setAttribute('id', 'pegman');
          ferraoIcon.setAttribute('width', Maze.SQUARE_SIZE);
          ferraoIcon.setAttribute('height', Maze.SQUARE_HEIGHT);
          svg.appendChild(ferraoIcon);

          ferraoIcon.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.7) -
              ferraoIcon.getAttribute('width')/2);
          ferraoIcon.setAttribute('y', Maze.SQUARE_HEIGHT * (3.7));

          putPegman = false
        
        }

        if (Maze.map[y][x] == Maze.SquareTypeHUB.GROUND) {
          var ground = document.createElementNS(Blockly.SVG_NS, 'image');
          ground.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.ground[0]);
          ground.setAttribute('id', 'ground');
          ground.setAttribute('width', Maze.SQUARE_SIZE);
          ground.setAttribute('height', Maze.SQUARE_HEIGHT);
          svg.appendChild(ground);

          ground.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.5) -
              ground.getAttribute('width')/2);
          ground.setAttribute('y', Maze.SQUARE_HEIGHT * (y + 0.5) -
              ground.getAttribute('height')/2);

          putPegman = true
        }
        if (Maze.map[y][x] == Maze.SquareTypeHUB.ENVIROMENT) {

          if (enviromentCount < 2) {
            var enviroment = document.createElementNS(Blockly.SVG_NS, 'image');
            enviroment.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
                Maze.HUB.enviroment[0][enviromentCount]);
            enviroment.setAttribute('id', 'enviroment'+enviromentCount);
            enviroment.setAttribute('width', Maze.SQUARE_SIZE);
            enviroment.setAttribute('height', Maze.SQUARE_HEIGHT);
            svg.appendChild(enviroment);

            enviroment.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.5) -
                enviroment.getAttribute('width')/2);
            enviroment.setAttribute('y', Maze.SQUARE_HEIGHT * (y + 0.5) -
                enviroment.getAttribute('height')/2);

            enviromentCount++
          }
        }
        if (Maze.map[y][x] == Maze.SquareTypeHUB.SPEAKER) {
          var speaker = document.createElementNS(Blockly.SVG_NS, 'image');
          speaker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.speaker[0]);
          speaker.setAttribute('id', 'speaker');
          speaker.setAttribute('width', Maze.SQUARE_SIZE);
          speaker.setAttribute('height', Maze.SQUARE_HEIGHT);
          svg.appendChild(speaker);

          speaker.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.5) -
              speaker.getAttribute('width')/2);
          speaker.setAttribute('y', Maze.SQUARE_HEIGHT * (y + 0.5) -
              speaker.getAttribute('height')/2);
        }
        if (Maze.map[y][x] == Maze.SquareTypeHUB.STREET) {
          var street = document.createElementNS(Blockly.SVG_NS, 'image');
          street.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.street[0]);
          street.setAttribute('id', 'street');
          street.setAttribute('width', Maze.SQUARE_SIZE);
          street.setAttribute('height', Maze.SQUARE_HEIGHT);
          svg.appendChild(street);

          street.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.5) -
              street.getAttribute('width')/2);
          street.setAttribute('y', Maze.SQUARE_HEIGHT * (y + 0.5) -
              street.getAttribute('height')/2);
        }
      }
    }

    // Draw the grid lines.
    if (Maze.HUB.graph) {
      var offsetX = Maze.SQUARE_SIZE;
      var offsetY = Maze.SQUARE_HEIGHT;

      for (var k = 0; k < Maze.ROWS; k++) {
        var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
        h_line.setAttribute('y1', k * Maze.SQUARE_HEIGHT + offsetY);
        h_line.setAttribute('x2', Maze.MAZE_WIDTH);
        h_line.setAttribute('y2', k * Maze.SQUARE_HEIGHT + offsetY);
        h_line.setAttribute('stroke', Maze.HUB.graph);
        h_line.setAttribute('stroke-width', 1);
        svg.appendChild(h_line);
      }
      for (var k = 0; k < Maze.COLS; k++) {
        var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
        v_line.setAttribute('x1', k * Maze.SQUARE_SIZE + offsetX);
        v_line.setAttribute('x2', k * Maze.SQUARE_SIZE + offsetX);
        v_line.setAttribute('y2', Maze.MAZE_HEIGHT);
        v_line.setAttribute('stroke', Maze.HUB.graph);
        v_line.setAttribute('stroke-width', 1);
        svg.appendChild(v_line);
      }
    }

  } else {

    //Liveview Dimentions
    var svg = document.getElementById('svgMaze');
    svg.setAttribute('width', Maze.SCREEN_WIDTH*0.4);
    svg.setAttribute('height', Maze.SCREEN_HEIGHT - topBarHeight);
    svg.style.left = (Maze.SCREEN_WIDTH*0.6) + 'px';
    svg.style.position = 'fixed';
    var scale = Math.max(Maze.ROWS, Maze.COLS) * Maze.SQUARE_SIZE;
    
    // Draw the square of liveview 
    var square = document.createElementNS(Blockly.SVG_NS, 'rect');
    square.setAttribute('width', Maze.SCREEN_WIDTH*0.4);
    square.setAttribute('height', Maze.SCREEN_HEIGHT - topBarHeight);
    square.style.left = (Maze.SCREEN_WIDTH*0.6) + 'px';
    square.style.position = 'fixed';
    square.setAttribute('fill', '#C6C987');
    square.setAttribute('stroke-width', 1);
    square.setAttribute('stroke', '#CCB');
    svg.appendChild(square);

    if (Maze.SKIN.background) {
      var bg = document.createElementNS(Blockly.SVG_NS, 'image');
      bg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          Maze.SKIN.background);

      bg.setAttribute('height', Maze.SCREEN_HEIGHT - topBarHeight);
      bg.setAttribute('width', Maze.SCREEN_WIDTH*0.4); 
      bg.setAttribute('x', 0);
      bg.setAttribute('y', 0);
      svg.appendChild(bg);
    }

    // Draw the grid lines.
    if (Maze.SKIN.graph) {
      var offset = Maze.SQUARE_SIZE;

      for (var k = 0; k < Maze.ROWS; k++) {
        var h_line = document.createElementNS(Blockly.SVG_NS, 'line');
        h_line.setAttribute('y1', k * Maze.SQUARE_SIZE + offset);
        h_line.setAttribute('x2', Maze.MAZE_WIDTH);
        h_line.setAttribute('y2', k * Maze.SQUARE_SIZE + offset);
        h_line.setAttribute('stroke', 'Maze.SKIN.graph');
        h_line.setAttribute('stroke-width', 1);
        svg.appendChild(h_line);
      }
      for (var k = 0; k < Maze.COLS; k++) {
        var v_line = document.createElementNS(Blockly.SVG_NS, 'line');
        v_line.setAttribute('x1', k * Maze.SQUARE_SIZE + offset);
        v_line.setAttribute('x2', k * Maze.SQUARE_SIZE + offset);
        v_line.setAttribute('y2', Maze.MAZE_HEIGHT);
        v_line.setAttribute('stroke', Maze.SKIN.graph);
        v_line.setAttribute('stroke-width', 1);
        svg.appendChild(v_line);
      }
    }
  }



  // Draw the tiles making up the maze map.

  // Return a value of '0' if the specified square is wall or out of bounds,
  // '1' otherwise (empty, start, finish).
  var normalize = function(x, y) {
    if (x < 0 || x >= Maze.COLS || y < 0 || y >= Maze.ROWS) {
      return '0';
    }
    return (Maze.map[y][x] == Maze.SquareType.WALL) ? '0' : '1';
  };

  if (BlocklyGames.LEVEL != 0) {
  // Compute and draw the tile for each square.
  var tileId = 0;
  var objectCount = 0;
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {
      // Compute the tile shape.
      var tileShape = normalize(x, y) +
          normalize(x, y - 1) +  // North.
          normalize(x + 1, y) +  // West.
          normalize(x, y + 1) +  // South.
          normalize(x - 1, y);   // East.

      // Draw the tile.
      if (!Maze.tile_SHAPES[tileShape]) {
        // Empty square.  Use null0 for large areas, with null1-4 for borders.
        // Add some randomness to avoid large empty spaces.
        if (tileShape == '00000' && Math.random() > 0.3) {
          tileShape = 'null0';
        } else {
          tileShape = 'null' + Math.floor(1 + Math.random() * 4);
        }
      }
      var left = Maze.tile_SHAPES[tileShape][0];
      var top = Maze.tile_SHAPES[tileShape][1];
      // Tile's clipPath element.
      var tileClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
      tileClip.setAttribute('id', 'tileClipPath' + tileId);
      var clipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
      clipRect.setAttribute('width', Maze.SQUARE_SIZE);
      clipRect.setAttribute('height', Maze.SQUARE_SIZE);

      clipRect.setAttribute('x', x * Maze.SQUARE_SIZE );
      clipRect.setAttribute('y', y * Maze.SQUARE_SIZE + Maze.MAZE_TOP_OFFSET);

      tileClip.appendChild(clipRect);
      svg.appendChild(tileClip);
      // Tile sprite.
      var tile = document.createElementNS(Blockly.SVG_NS, 'image');
      tile.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
          Maze.SKIN.tiles);
      // Position the tile sprite relative to the clipRect.
      tile.setAttribute('height', Maze.SQUARE_SIZE * 4);
      tile.setAttribute('width', Maze.SQUARE_SIZE * 5);
      tile.setAttribute('clip-path', 'url(#tileClipPath' + tileId + ')');
      tile.setAttribute('x', (x - left) * Maze.SQUARE_SIZE);
      tile.setAttribute('y', (y - top) * Maze.SQUARE_SIZE + Maze.MAZE_TOP_OFFSET);
      svg.appendChild(tile);
      tileId++;

      if (Maze.map[y][x] == Maze.SquareType.OBSTACLE) {
        // Add obstacle.
        var obstacle = document.createElementNS(Blockly.SVG_NS, 'image');
        obstacle.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
            Maze.SKIN.obstacle);
        obstacle.setAttribute('height', Maze.SQUARE_SIZE * 0.7);
        obstacle.setAttribute('width', Maze.SQUARE_SIZE * 0.7);
        svg.appendChild(obstacle);

        // // Move the obstacle into position.
        obstacle.setAttribute('x', Maze.SQUARE_SIZE * (x + 0.5) -
            obstacle.getAttribute('width') / 2);
        obstacle.setAttribute('y', Maze.SQUARE_SIZE * (y + 0.8) -
            obstacle.getAttribute('height') + Maze.MAZE_TOP_OFFSET);
      }

      if (Maze.map[y][x] == Maze.SquareType.FINISH) {

        if (BlocklyGames.LEVEL == 4) {
          // Add finish marker.
          var finishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
          finishMarker.setAttribute('id', 'finish'+objectCount);
          finishMarker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.SKIN.objects[BlocklyGames.LEVEL-1]);
          finishMarker.setAttribute('height', Maze.SQUARE_SIZE * 0.7);
          finishMarker.setAttribute('width', Maze.SQUARE_SIZE * 0.7);
          svg.appendChild(finishMarker);

          objectCount++

        } else {
          // Add finish marker.
          var finishMarker = document.createElementNS(Blockly.SVG_NS, 'image');
          finishMarker.setAttribute('id', 'finish');
          finishMarker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', Maze.SKIN.objects[BlocklyGames.LEVEL-1]);
          finishMarker.setAttribute('height', Maze.SQUARE_SIZE * 0.7);
          finishMarker.setAttribute('width', Maze.SQUARE_SIZE * 0.7);
          svg.appendChild(finishMarker);
        }
      }
    }
  }

  // Pegman's clipPath element, whose (x, y) is reset by Maze.displayPegman
  var pegmanClip = document.createElementNS(Blockly.SVG_NS, 'clipPath');
  pegmanClip.setAttribute('id', 'pegmanClipPath');
  var clipRect = document.createElementNS(Blockly.SVG_NS, 'rect');
  clipRect.setAttribute('id', 'clipRect');
  clipRect.setAttribute('width', Maze.PEGMAN_WIDTH);
  clipRect.setAttribute('height', Maze.PEGMAN_HEIGHT);
  pegmanClip.appendChild(clipRect);
  svg.appendChild(pegmanClip);

  // Add Pegman.
  var pegmanIcon = document.createElementNS(Blockly.SVG_NS, 'image');
  pegmanIcon.setAttribute('id', 'pegman');
  pegmanIcon.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      Maze.SKIN.sprite);
  pegmanIcon.setAttribute('height', Maze.PEGMAN_HEIGHT);
  pegmanIcon.setAttribute('width', Maze.PEGMAN_WIDTH * 41); // 49 * 45 (sprites) = 2205
  pegmanIcon.setAttribute('clip-path', 'url(#pegmanClipPath)');
  svg.appendChild(pegmanIcon);

  } //end of if level
};


/**
 * Initialize Blockly and the maze.  Called on page load.
 */
Maze.init = function() {

  // Render the Soy template.
  document.body.innerHTML = Maze.soy.start({}, null,
      {lang: 'en',
       level: BlocklyGames.LEVEL,
       maxLevel: BlocklyGames.MAX_LEVEL,
       skin: Maze.SKIN_ID,
       html: BlocklyGames.IS_HTML});

  BlocklyInterface.init();

  //Useless
  var rtl = BlocklyGames.isRtl();
  var blocklyDiv = document.getElementById('blockly');
  var visualization = document.getElementById('visualization');

  //Position and dimentions of workspace
  var onresize = function(e) {
    if (BlocklyGames.LEVEL == 0) {
      blocklyDiv.style.top = 0 + 'px';
      blocklyDiv.style.height = (Maze.SCREEN_HEIGHT) + 'px';
      blocklyDiv.style.width = (Maze.SCREEN_WIDTH*0.3) + 'px';
    } else {
      blocklyDiv.style.top =(topBarHeight) + 'px';
      blocklyDiv.style.height = (Maze.SCREEN_HEIGHT - topBarHeight) + 'px';
      blocklyDiv.style.width = (Maze.SCREEN_WIDTH*0.6) + 'px'; 
    }
  };

  window.addEventListener('scroll', function() {
    onresize(null);
    Blockly.svgResize(BlocklyGames.workspace);
  });
  window.addEventListener('resize', onresize);
  onresize(null);

  var toolbox = document.getElementById('toolbox');

  //Check if it's the level 0 (HUB) or not
  var TOOLS_ON = true;
  if (BlocklyGames.LEVEL == 0) {
    TOOLS_ON = false
  }

  //Change settings of workspace
  BlocklyGames.workspace = Blockly.inject('blockly',
      {'media': 'third-party/blockly/media/',
        'grid':
         {'spacing': '30',
          'length': '1',
          'colour': '#bbb',
          'snap': true
        },
       'maxBlocks': Maze.MAX_BLOCKS,
       'toolbox': toolbox,
       'trashcan': TOOLS_ON,
       'scrollbars':TOOLS_ON,
       'zoom': {'startScale': Maze.ZOOM_WORKSPACE}
       });

  // load audios
  BlocklyGames.workspace.getAudioManager().load(Maze.SKIN.winSound, 'win');
  BlocklyGames.workspace.getAudioManager().load(Maze.SKIN.crashSound, 'fail');
  BlocklyGames.workspace.getAudioManager().load(Maze.SKIN.music, 'music');

  // Not really needed, there are no user-defined functions or variables.
  Blockly.JavaScript.addReservedWords('moveForward,moveBackward,jumpForward, jumpBackward' +
      'turnRight,turnLeft,isPathForward,isPathRight,isPathBackward,isPathLeft');

  //Hide toolbox if it's level 0
  if (BlocklyGames.LEVEL == 0) {
    var blocklyFlyoutBackground = document.getElementsByClassName('blocklyFlyoutBackground');
    blocklyFlyoutBackground[0].style.display = "none"
  }
  
  //Call drawMap() function and draw liveView
  Maze.drawMap();

  var defaultXml;
  if (BlocklyGames.LEVEL == 0) {
    //Default blocks in the level 0 (HUB)
    var lastlevelDone = 0
    for (var i = 1; i < Maze.LEVELS_DONE.length; i++) {
      if (Maze.LEVELS_DONE[i] == true) {
        lastlevelDone++
      }
    }

    if (lastlevelDone == 0) {
      //nothing to show
    } else if (lastlevelDone == 1) {
      defaultXml =
      '<xml>' +
      '  <block movable="false" type="maze_changeGround" x="-20" y="30"><field name="STA">groundDirty</field></block>' +
      '</xml>' ;
    } else if (lastlevelDone == 2) {
      defaultXml =
      '<xml>' +
      '  <block movable="false" type="maze_changeGround" x="-20" y="30"><field name="STA">groundDirty</field></block>' +
      '  <block movable="false" type="maze_changeEnviroment" x="-20" y="55"><field name="STA">enviromentDeforested</field></block>' +
      '</xml>' ;
    } else if (lastlevelDone == 3) {
      defaultXml =
      '<xml>' +
      '  <block movable="false" type="maze_changeGround" x="-20" y="30"><field name="STA">groundDirty</field></block>' +
      '  <block movable="false" type="maze_changeEnviroment" x="-20" y="55"><field name="STA">enviromentDeforested</field></block>' +
      '  <block movable="false" type="maze_changeSpeaker" x="-20" y="80"><field name="STA">speakerOff</field></block>' +
      '</xml>' ;
    } else if (lastlevelDone == 4) {
      defaultXml =
      '<xml>' +
      '  <block movable="false" type="maze_changeGround" x="-20" y="30"><field name="STA">groundDirty</field></block>' +
      '  <block movable="false" type="maze_changeEnviroment" x="-20" y="55"><field name="STA">enviromentDeforested</field></block>' +
      '  <block movable="false" type="maze_changeSpeaker" x="-20" y="80"><field name="STA">speakerOff</field></block>' +
      '  <block movable="false" type="maze_changeStreet" x="-20" y="105"><field name="STA">streetUnpaved</field></block>' +
      '</xml>' ;
    }
    
    } else {
      defaultXml = ""
      // '<xml>' +
      // '  <block movable="' + (BlocklyGames.LEVEL != 1) + '" ' +
      // 'type="maze_moveForward" x="30" y="30"></block>' +
      // '</xml>' ;
    }
  BlocklyInterface.loadBlocks(defaultXml, false);


  
  Maze.finish_ = []
  // Locate the start and finish squares.
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {

      //If its the level 0, just mark where Ale is
      if (BlocklyGames.LEVEL == 0 ) {
        if (Maze.map[y][x] == Maze.SquareTypeHUB.ALE) {
          Maze.start_ = {x: x, y: y};
           Maze.finish_ = [{x: x, y: y}];
        }


      } else {     
        if (Maze.map[y][x] == Maze.SquareType.START) {
          Maze.start_ = {x: x, y: y};
        } else if (Maze.map[y][x] == Maze.SquareType.FINISH) {

          if (BlocklyGames.LEVEL == 4) {
            Maze.finish_.push({x: x, y: y});
          } else {
            Maze.finish_ = [{x: x, y: y}];
          }
        }
      }
    }
  }

  Maze.reset(true);

  //Add listeners
  BlocklyGames.workspace.addChangeListener(function() {Maze.updateCapacity();});

  if (BlocklyGames.LEVEL == 0 ){
    BlocklyGames.bindClick('runButton', Maze.changeButtonClick);
    BlocklyGames.bindClick('helpButton', Maze.showHelpDialog);
    BlocklyGames.bindClick('mapButton', Maze.showMapDialog);
  } else {
    BlocklyGames.bindClick('runButton', Maze.runButtonClick);
    BlocklyGames.bindClick('helpButton', Maze.showHelpDialog);
    BlocklyGames.bindClick('mapButton', Maze.showMapDialog);
    BlocklyGames.bindClick('resetButton', Maze.resetButtonClick);
  }

  // Every level gets an introductory modal dialog
  // If not done yet
  if (!BlocklyGames.loadFromLocalStorage(BlocklyGames.NAME,
                                        BlocklyGames.LEVEL)) {
    Maze.showCutsceneDialog(BlocklyGames.LEVEL)
  }

  // schedule some function
  //setTimeout(BlocklyDialogs.abortOffer, 5 * 60 * 1000);

  // All other levels get interactive help.  But wait 5 seconds for the
  // user to think a bit before they are told what to do.
  setTimeout(function() {
    BlocklyGames.workspace.addChangeListener(Maze.levelHelp);
    Maze.levelHelp();
  }, 5000);


  // Play the backgroundmusic
  if (BlocklyGames.LEVEL == 0) {
    BlocklyGames.workspace.getAudioManager().play('music', 0.5);
    setTimeout(Maze.repeatMusic, 3 * 60 * 1000); // duration of music 3 minutes
  }

  // Lazy-load the JavaScript interpreter.
  setTimeout(BlocklyInterface.importInterpreter, 1);
  // Lazy-load the syntax-highlighting.
  setTimeout(BlocklyInterface.importPrettify, 1);
  
};

// Repeats the music when it ends
Maze.repeatMusic = function(e){
  BlocklyGames.workspace.getAudioManager().play('window', 0.5);
  setTimeout(Maze.repeatMusic, 3 * 60 * 1000); // duration of music 3 minutes
  console.log("playing music")
};

// Hide custscenemodal dialog.
Maze.hideCustsceneDialog = function(e){
  BlocklyDialogs.hideDialog(true)
};

// Show cutscene modal dialog.
Maze.showCutsceneDialog = function(number){
  var content = document.getElementById('dialogCutscene'+number);
    var style = {};

    var cssText =
      "height: 0;"+
      "padding-top: 33%;"+
      "margin: 8% 20%;"+
      "width: 55%;";
    var dialog = document.getElementById('dialog')
    dialog.style.cssText = cssText

    BlocklyDialogs.showDialog(content, null, false, true, style, null);
    if (number < 5) {
      setTimeout(Maze.hideCustsceneDialog, 45 * 1000);
    }
};

// Show map modal dialog.
Maze.showMapDialog = function(e){
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }
  var content = document.getElementById('dialogMap');
  var style = {};
  var cssText =
    "height: 0;"+
    "padding-top: 36%;"+
    "background: url(maze/img/helps/bg-map.png) center/contain no-repeat;"+
    "background-size: contain;"+
    "margin: 10% 25%;"+
    "width: 51%;";
  var dialog = document.getElementById('dialog')
  dialog.style.cssText = cssText

  BlocklyDialogs.showDialog(content, null, false, true, style, null);

  Maze.disableButtonsMap()
  Maze.activeButtonsMap() 
};

Maze.disableButtonsMap = function(){
  var img = document.getElementsByClassName("locked");
  for(var i = 1; i < img.length; i++) {
     var anchor = img.item(i).previousSibling;
     anchor.style.pointerEvents = "none";
     anchor.style.cursor = "default"; 
  } 
}

Maze.activeButtonsMap = function(){
  Maze.checkLevelsInStorage()
  var img = document.getElementsByClassName("locked");

  if (img != null) {
    for(var i = 0; i < Maze.LEVELS_DONE.length; i++) {
      if (Maze.LEVELS_DONE[i] == true && i != Maze.LEVELS_DONE.length-1) {   
        img.item(i+1).classList.add('not'); 

        var anchor = img.item(i+1).previousSibling;
        anchor.style.pointerEvents = "auto";
        anchor.style.cursor = "pointer";
      }
    }  
  }
}

// Show help modal dialog.
Maze.showHelpDialog = function(e){
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }
  var content = document.getElementById('dialogHelp');
  var style = {};

  var cssText =
    "height: 0;"+
    "padding-top: 38%;"+
    "background: url(maze/img/helps/help-level-"+BlocklyGames.LEVEL+".png) top/contain no-repeat;"+
    "margin: 10% 25%;"+
    "width: 50%;";
  var dialog = document.getElementById('dialog')
  dialog.style.cssText = cssText

  BlocklyDialogs.showDialog(content, null, false, true, style, null);
};

// // Show end modal dialog.
// Maze.showEndDialog = function(){
//   var endDialog = document.getElementById('dialogEnd');
//   endDialog.style.display = "block"

//   var okButton = endDialog.getElementsByTagName('button')[0]
//   okButton.onclick = function() {hideEnd()};
// }

function hideEnd() {
  var endDialog = document.getElementById('dialogEnd');

  endDialog.style.display = "none"
}

/**
 * When the workspace changes, update the help as needed.
 * @param {Blockly.Events.Abstract=} opt_event Custom data for event.
 */
Maze.levelHelp = function(opt_event) {
  // if (opt_event && opt_event.type == Blockly.Events.UI) {
  //   // Just a change to highlighting or somesuch.
  //   return;
  // } else if (BlocklyGames.workspace.isDragging()) {
  //   // Don't change helps during drags.
  //   return;
  // } else if (Maze.result == Maze.ResultType.SUCCESS ||
  //            BlocklyGames.loadFromLocalStorage(BlocklyGames.NAME,
  //                                              BlocklyGames.LEVEL)) {
  //   // The user has already won.  They are just playing around.
  //   return;
  // }
  // var rtl = BlocklyGames.isRtl();
  // var userBlocks = Blockly.Xml.domToText(
  //     Blockly.Xml.workspaceToDom(BlocklyGames.workspace));
  // var toolbar = BlocklyGames.workspace.flyout_.workspace_.getTopBlocks(true);
  // var content = null;
  // var origin = null;
  // var style = null;
  // if (BlocklyGames.LEVEL == 1) {
  //   if (BlocklyGames.workspace.getAllBlocks().length < 2) {
  //     content = document.getElementById('dialogHelpStack');
  //     style = {'width': '370px', 'top': '130px'};
  //     style[rtl ? 'right' : 'left'] = '215px';
  //     origin = toolbar[0].getSvgRoot();
  //   } else {
  //     var topBlocks = BlocklyGames.workspace.getTopBlocks(true);
  //     if (topBlocks.length > 1) {
  //       var xml = [
  //           '<xml>',
  //             '<block type="maze_moveForward" x="0" y="0">',
  //               '<next>',
  //                 '<block type="maze_moveForward"></block>',
  //               '</next>',
  //             '</block>',
  //           '</xml>'];
  //       BlocklyInterface.injectReadonly('sampleOneTopBlock', xml);
  //       content = document.getElementById('dialogHelpOneTopBlock');
  //       style = {'width': '360px', 'top': '120px'};
  //       style[rtl ? 'right' : 'left'] = '225px';
  //       origin = topBlocks[0].getSvgRoot();
  //     } else if (Maze.result == Maze.ResultType.UNSET) {
  //       // Show run help dialog.
  //       content = document.getElementById('dialogHelpRun');
  //       style = {'width': '360px', 'top': '410px'};
  //       style[rtl ? 'right' : 'left'] = '400px';
  //       origin = document.getElementById('runButton');
  //     }
  //   }
  // } else if (BlocklyGames.LEVEL == 2) {
  //   if (Maze.result != Maze.ResultType.UNSET &&
  //       document.getElementById('runButton').style.display == 'none') {
  //     content = document.getElementById('dialogHelpReset');
  //     style = {'width': '360px', 'top': '410px'};
  //     style[rtl ? 'right' : 'left'] = '400px';
  //     origin = document.getElementById('resetButton');
  //   }
  // } else if (BlocklyGames.LEVEL == 3) {
  //   if (userBlocks.indexOf('maze_forever') == -1) {
  //     if (BlocklyGames.workspace.remainingCapacity() == 0) {
  //       content = document.getElementById('dialogHelpCapacity');
  //       style = {'width': '430px', 'top': '310px'};
  //       style[rtl ? 'right' : 'left'] = '50px';
  //       origin = document.getElementById('capacityBubble');
  //     } else {
  //       content = document.getElementById('dialogHelpRepeat');
  //       style = {'width': '360px', 'top': '360px'};
  //       style[rtl ? 'right' : 'left'] = '425px';
  //       origin = toolbar[3].getSvgRoot();
  //     }
  //   }
  // } else if (BlocklyGames.LEVEL == 4) {
  //   if (BlocklyGames.workspace.remainingCapacity() == 0 &&
  //       (userBlocks.indexOf('maze_forever') == -1 ||
  //        BlocklyGames.workspace.getTopBlocks(false).length > 1)) {
  //     content = document.getElementById('dialogHelpCapacity');
  //     style = {'width': '430px', 'top': '310px'};
  //     style[rtl ? 'right' : 'left'] = '50px';
  //     origin = document.getElementById('capacityBubble');
  //   } else {
  //     var showHelp = true;
  //     // Only show help if there is not a loop with two nested blocks.
  //     var blocks = BlocklyGames.workspace.getAllBlocks();
  //     for (var i = 0; i < blocks.length; i++) {
  //       var block = blocks[i];
  //       if (block.type != 'maze_forever') {
  //         continue;
  //       }
  //       var j = 0;
  //       while (block) {
  //         var kids = block.getChildren();
  //         block = kids.length ? kids[0] : null;
  //         j++;
  //       }
  //       if (j > 2) {
  //         showHelp = false;
  //         break;
  //       }
  //     }
  //     if (showHelp) {
  //       content = document.getElementById('dialogHelpRepeatMany');
  //       style = {'width': '360px', 'top': '360px'};
  //       style[rtl ? 'right' : 'left'] = '425px';
  //       origin = toolbar[3].getSvgRoot();
  //     }
  //   }
  // } else if (BlocklyGames.LEVEL == 5) {
  //   if (Maze.SKIN_ID == 0 && !Maze.showPegmanMenu.activatedOnce) {
  //     content = document.getElementById('dialogHelpSkins');
  //     style = {'width': '360px', 'top': '60px'};
  //     style[rtl ? 'left' : 'right'] = '20px';
  //     origin = document.getElementById('pegmanButton');
  //   }
  // } else if (BlocklyGames.LEVEL == 6) {
  //   if (userBlocks.indexOf('maze_if') == -1) {
  //     content = document.getElementById('dialogHelpIf');
  //     style = {'width': '360px', 'top': '430px'};
  //     style[rtl ? 'right' : 'left'] = '425px';
  //     origin = toolbar[4].getSvgRoot();
  //   }
  // } else if (BlocklyGames.LEVEL == 7) {
  //   if (!Maze.levelHelp.initialized7_) {
  //     // Create fake dropdown.
  //     var span = document.createElement('span');
  //     span.className = 'helpMenuFake';
  //     var options =
  //         [BlocklyGames.getMsg('Maze_pathAhead'),
  //          BlocklyGames.getMsg('Maze_pathLeft'),
  //          BlocklyGames.getMsg('Maze_pathRight')];
  //     var prefix = Blockly.utils.commonWordPrefix(options);
  //     var suffix = Blockly.utils.commonWordSuffix(options);
  //     if (suffix) {
  //       var option = options[0].slice(prefix, -suffix);
  //     } else {
  //       var option = options[0].substring(prefix);
  //     }
  //     // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
  //     span.textContent = option + ' ' + Blockly.FieldDropdown.ARROW_CHAR;
  //     // Inject fake dropdown into message.
  //     var container = document.getElementById('helpMenuText');
  //     var msg = container.textContent;
  //     container.textContent = '';
  //     var parts = msg.split(/%\d/);
  //     for (var i = 0; i < parts.length; i++) {
  //       container.appendChild(document.createTextNode(parts[i]));
  //       if (i != parts.length - 1) {
  //         container.appendChild(span.cloneNode(true));
  //       }
  //     }
  //     Maze.levelHelp.initialized7_ = true;
  //   }
  //   // The hint says to change from 'ahead', but keep the hint visible
  //   // until the user chooses 'right'.
  //   if (userBlocks.indexOf('isPathRight') == -1) {
  //     content = document.getElementById('dialogHelpMenu');
  //     style = {'width': '360px', 'top': '430px'};
  //     style[rtl ? 'right' : 'left'] = '425px';
  //     origin = toolbar[4].getSvgRoot();
  //   }
  // } else if (BlocklyGames.LEVEL == 9) {
  //   if (userBlocks.indexOf('maze_ifElse') == -1) {
  //     content = document.getElementById('dialogHelpIfElse');
  //     style = {'width': '360px', 'top': '305px'};
  //     style[rtl ? 'right' : 'left'] = '425px';
  //     origin = toolbar[5].getSvgRoot();
  //   }
  // }
  // if (content) {
  //   if (content.parentNode != document.getElementById('dialog')) {
  //     BlocklyDialogs.showDialog(content, origin, true, false, style, null);
  //   }
  // } else {
  //   BlocklyDialogs.hideDialog(false);
  // }
};



/**
 * Save the blocks for a one-time reload.
 */
Maze.saveToStorage = function() {
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != undefined && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(BlocklyGames.workspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }
};

/**
 * Reset the maze to the start position and kill any pending animation tasks.
 * @param {boolean} first True if an opening animation is to be played.
 */
Maze.reset = function(first) {
  //Maze.fullscreen()

  if (BlocklyGames.LEVEL == 0) {
    // // Kill all tasks.
    // for (var i = 0; i < Maze.pidList.length; i++) {
    //   window.clearTimeout(Maze.pidList[i]);
    // }
    // Maze.pidList = [];

    // Maze.pegmanD = Maze.startDirection;
    // Maze.pegmanX = Maze.start_.x;
    // Maze.pegmanY = Maze.start_.y;

    // Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD);

    //

  } else {
    // Kill all tasks.
    for (var i = 0; i < Maze.pidList.length; i++) {
      window.clearTimeout(Maze.pidList[i]);
    }
    Maze.pidList = [];

    // Move Pegman into position.
    Maze.pegmanX = Maze.start_.x;
    Maze.pegmanY = Maze.start_.y;

    //Change number of objects catched in current code o zero
    Maze.objectsCatched = 0
  
    Maze.pegmanD = Maze.startDirection;
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 2);

    if (BlocklyGames.LEVEL == 4) {
      for (var i = 0; i < 4; i++) {
        var finishIcon = document.getElementById('finish'+i);
        finishIcon.setAttribute('x', Maze.SQUARE_SIZE * (Maze.finish_[i].x + 0.5) -
        finishIcon.getAttribute('width') / 2);
        finishIcon.setAttribute('y', (Maze.SQUARE_SIZE * (Maze.finish_[i].y + 0.7) -
        finishIcon.getAttribute('height')) + Maze.MAZE_TOP_OFFSET);
        finishIcon.style.visibility = "visible";
      }
    } else {
      // Move the finish icon into position.
      var finishIcon = document.getElementById('finish');
      finishIcon.setAttribute('x', Maze.SQUARE_SIZE * (Maze.finish_[0].x + 0.5) -
      finishIcon.getAttribute('width') / 2);
      finishIcon.setAttribute('y', (Maze.SQUARE_SIZE * (Maze.finish_[0].y + 0.8) -
      finishIcon.getAttribute('height')) + Maze.MAZE_TOP_OFFSET);
      finishIcon.style.visibility = "visible"
    }

    // Make 'look' icon invisible and promote to top.
    var lookIcon = document.getElementById('look');
    lookIcon.style.display = 'none';
    lookIcon.parentNode.appendChild(lookIcon);
    var paths = lookIcon.getElementsByTagName('path');
    for (var i = 0, path; (path = paths[i]); i++) {
      path.setAttribute('stroke', Maze.SKIN.look);
    }
  }
};

/**
 * Click the run button.  Start the program.
 * @param {!Event} e Mouse or touch event.
 */
Maze.runButtonClick = function(e) {
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }
  BlocklyDialogs.hideDialog(false);
  // Only allow a single top block on level 1.
  if (BlocklyGames.LEVEL == 1 &&
      BlocklyGames.workspace.getTopBlocks(false).length > 1 &&
      Maze.result != Maze.ResultType.SUCCESS &&
      !BlocklyGames.loadFromLocalStorage(BlocklyGames.NAME,
                                         BlocklyGames.LEVEL)) {
    Maze.levelHelp();
    return;
  }

  var runButton = document.getElementById('runButton');
  var resetButton = document.getElementById('resetButton');
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + 'px';
  }
  runButton.style.display = 'none';
  resetButton.style.display = 'inline';

  Maze.reset(false);
  Maze.execute();
};


/**
 * Click the change button on level 0.  Change de illustrations.
 * @param {!Event} e Mouse or touch event.
 */
Maze.changeButtonClick = function(e) {
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }

  BlocklyDialogs.hideDialog(false);

  Maze.reset(false);
  Maze.execute();
};

/**
 * Updates the document's 'capacity' element with a message
 * indicating how many more blocks are permitted.  The capacity
 * is retrieved from BlocklyGames.workspace.remainingCapacity().
 */
Maze.updateCapacity = function() {
  var cap = BlocklyGames.workspace.remainingCapacity();
  var p = document.getElementById('capacity');
  if (cap == Infinity) {
    p.style.display = 'none';
  } else {
    p.style.display = 'inline';
    p.innerHTML = '';
    cap = Number(cap);
    var capSpan = document.createElement('span');
    capSpan.className = 'capacityNumber';
    capSpan.appendChild(document.createTextNode(cap));
    if (cap == 0) {
      var msg = BlocklyGames.getMsg('Maze_capacity0');
    } else if (cap == 1) {
      var msg = BlocklyGames.getMsg('Maze_capacity1');
    } else {
      var msg = BlocklyGames.getMsg('Maze_capacity2');
    }
    var parts = msg.split(/%\d/);
    for (var i = 0; i < parts.length; i++) {
      p.appendChild(document.createTextNode(parts[i]));
      if (i != parts.length - 1) {
        p.appendChild(capSpan.cloneNode(true));
      }
    }
  }
};

/**
 * Click the reset button.  Reset the maze.
 * @param {!Event} e Mouse or touch event.
 */
Maze.resetButtonClick = function(e) {
  // Prevent double-clicks or double-taps.
  if (BlocklyInterface.eventSpam(e)) {
    return;
  }
  var runButton = document.getElementById('runButton');
  runButton.style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  BlocklyGames.workspace.highlightBlock(null);
  Maze.reset(false);
  Maze.levelHelp();
};

/**
 * Inject the Maze API into a JavaScript interpreter.
 * @param {!Interpreter} interpreter The JS Interpreter.
 * @param {!Interpreter.Object} scope Global scope.
 */
Maze.initInterpreter = function(interpreter, scope) {
  // API
  var wrapper;

  wrapper = function(id) {
    Maze.move(0, id);
  };
  interpreter.setProperty(scope, 'moveForward',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    Maze.move(2, id);
  };
  interpreter.setProperty(scope, 'moveBackward',
      interpreter.createNativeFunction(wrapper));
  
  // New blocks created 
  wrapper = function(id) {
    Maze.jump(0, id);
  };
  interpreter.setProperty(scope, 'jumpForward',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    Maze.jump(2, id);
  };
  interpreter.setProperty(scope, 'jumpBackward',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    return Maze.catchObject(id);
  };
  interpreter.setProperty(scope, 'catchObject',
      interpreter.createNativeFunction(wrapper));

  // New HUB blocks created
  wrapper = function(id) {
    Maze.changeGround(0, id);
  };
  interpreter.setProperty(scope, 'groundDirty',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeGround(1, id);
  };
  interpreter.setProperty(scope, 'groundClean',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeEnviroment(0, id);
  };
  interpreter.setProperty(scope, 'enviromentDeforested',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeEnviroment(1, id);
  };
  interpreter.setProperty(scope, 'enviromentForested',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeSpeaker(0, id);
  };
  interpreter.setProperty(scope, 'speakerOff',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeSpeaker(1, id);
  };
  interpreter.setProperty(scope, 'speakerOn',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeStreet(0, id);
  };
  interpreter.setProperty(scope, 'streetUnpaved',
      interpreter.createNativeFunction(wrapper));
  wrapper = function(id) {
    Maze.changeStreet(1, id);
  };
  interpreter.setProperty(scope, 'streetPaved',
      interpreter.createNativeFunction(wrapper));
// End 

  wrapper = function(id) {
    Maze.turn(0, id);
  };
  interpreter.setProperty(scope, 'turnLeft',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    Maze.turn(1, id);
  };
  interpreter.setProperty(scope, 'turnRight',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    return Maze.isPath(0, id, false);
  };
  interpreter.setProperty(scope, 'isPathForward',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    return Maze.isPath(1, id, false);
  };
  interpreter.setProperty(scope, 'isPathRight',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    return Maze.isPath(2, id, false);
  };
  interpreter.setProperty(scope, 'isPathBackward',
      interpreter.createNativeFunction(wrapper));

  wrapper = function(id) {
    return Maze.isPath(3, id, false);
  };
  interpreter.setProperty(scope, 'isPathLeft',
      interpreter.createNativeFunction(wrapper));

  wrapper = function() {
    return Maze.notDone();
  };
  interpreter.setProperty(scope, 'notDone',
      interpreter.createNativeFunction(wrapper));
};

/**
 * Execute the user's code.
 */
Maze.execute = function() {
  if (!('Interpreter' in window)) {
    // Interpreter lazy loads and hasn't arrived yet.  Try again later.
    setTimeout(Maze.execute, 250);
    return;
  }

  Maze.log = [];
  Blockly.selected && Blockly.selected.unselect();
  var code = Blockly.JavaScript.workspaceToCode(BlocklyGames.workspace);
  Maze.result = Maze.ResultType.UNSET;
  var interpreter = new Interpreter(code, Maze.initInterpreter);

  // Try running the user's code.  There are four possible outcomes:
  // 1. If pegman reaches the finish [SUCCESS], true is thrown.
  // 2. If the program is terminated due to running too long [TIMEOUT],
  //    false is thrown.
  // 3. If another error occurs [ERROR], that error is thrown.
  // 4. If the program ended normally but without solving the maze [FAILURE],
  //    no error or exception is thrown.
  try {
    var ticks = 10000;  // 10k ticks runs Pegman for about 8 minutes.
    while (interpreter.step()) {
      if (ticks-- == 0) {
        throw Infinity;
      }
    }
    Maze.result = Maze.notDone() ?
        Maze.ResultType.FAILURE : Maze.ResultType.SUCCESS;
  } catch (e) {
    // A boolean is thrown for normal termination.
    // Abnormal termination is a user error.
    if (e === Infinity) {
      Maze.result = Maze.ResultType.TIMEOUT;
    } else if (e === false) {
      Maze.result = Maze.ResultType.ERROR;
    } else {
      // Syntax error, can't happen.
      Maze.result = Maze.ResultType.ERROR;
      //alert(e);
    }
  }

  // Fast animation if execution is successful.  Slow otherwise.
  if (Maze.result == Maze.ResultType.SUCCESS) {
    Maze.stepSpeed = 150;
    Maze.log.push(['finish', null]);
  } else {
    Maze.stepSpeed = 150;
  }

  // Maze.log now contains a transcript of all the user's actions.
  // Reset the maze and animate the transcript.
  Maze.reset(false);
  Maze.pidList.push(setTimeout(Maze.animate, 100));
  
};

/**
 * Iterate through the recorded path and animate pegman's actions.
 */
Maze.animate = function() {
  var action = Maze.log.shift();
  if (!action) {
    BlocklyInterface.highlight(null);
    Maze.levelHelp();
    return;
  }
  BlocklyInterface.highlight(action[1]);

  switch (action[0]) {
    case 'north':
      Maze.scheduleWalk([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY - 1, Maze.pegmanD * 4]);
      Maze.pegmanY--;
      break;
    case 'east':
      Maze.scheduleWalk([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX + 1, Maze.pegmanY, Maze.pegmanD * 4]);
      Maze.pegmanX++;
      break;
    case 'south':
      Maze.scheduleWalk([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY + 1, Maze.pegmanD * 4]);
      Maze.pegmanY++;
      break;
    case 'west':
      Maze.scheduleWalk([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX - 1, Maze.pegmanY, Maze.pegmanD * 4]);
      Maze.pegmanX--;
      break;
    
    // New animations created
    case 'jump_north':
      Maze.scheduleJump([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY - 2, Maze.pegmanD * 4]);
      Maze.pegmanY = Maze.pegmanY-2;
      break;
    case 'jump_east':
      Maze.scheduleJump([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX + 2, Maze.pegmanY, Maze.pegmanD * 4]);
      Maze.pegmanX = Maze.pegmanX+2;
      break;
    case 'jump_south':
      Maze.scheduleJump([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX, Maze.pegmanY + 2, Maze.pegmanD * 4]);
      Maze.pegmanY = Maze.pegmanY+2;
      break;
    case 'jump_west':
      Maze.scheduleJump([Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 4],
                    [Maze.pegmanX - 2, Maze.pegmanY, Maze.pegmanD * 4]);
      Maze.pegmanX = Maze.pegmanX-2;
      break;

    case 'catch_north':
      Maze.scheduleCatch();
      break;
    case 'catch_east':
      Maze.scheduleCatch();
      break;
    case 'catch_south':
      Maze.scheduleCatch();
      break;
    case 'catch_west':
      Maze.scheduleCatch();
      break;
    //End

    case 'look_north':
      Maze.scheduleLook(Maze.DirectionType.NORTH);
      break;
    case 'look_east':
      Maze.scheduleLook(Maze.DirectionType.EAST);
      break;
    case 'look_south':
      Maze.scheduleLook(Maze.DirectionType.SOUTH);
      break;
    case 'look_west':
      Maze.scheduleLook(Maze.DirectionType.WEST);
      break;
    case 'fail_forward':
      Maze.scheduleFail(true);
      break;
    case 'fail_backward':
      Maze.scheduleFail(false);
      break;
    case 'left':
      Maze.scheduleTurn(0);
      Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD - 1);
      break;
    case 'right':
      Maze.scheduleTurn(1);
      Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD + 1);
      break;
    case 'finish':
      Maze.scheduleFinish(true);
      BlocklyInterface.saveToLocalStorage();


      if (BlocklyGames.LEVEL >= 4) {
        Maze.showCutsceneDialog(5)
      } else {
        setTimeout(BlocklyDialogs.congratulations, 1000);

        var cssText = "";
        var dialog = document.getElementById('dialog')
        dialog.style.cssText = cssText
      }
  }

  Maze.pidList.push(setTimeout(Maze.animate, Maze.stepSpeed * 5));
};

/**
 * Schedule the animations for a move or turn.
 * @param {!Array.<number>} startPos X, Y and direction starting points.
 * @param {!Array.<number>} endPos X, Y and direction ending points.
 */
Maze.scheduleWalk = function(startPos, endPos) {
  var deltas = [(endPos[0] - startPos[0]) / 4,
                (endPos[1] - startPos[1]) / 4,
                (endPos[2] - startPos[2]) / 4];
  //Choose sprite to show
  var sprite = Maze.pegmanD + (Maze.pegmanD + 1) + 12
  var directionSprite = Maze.pegmanD * 2;
  
  Maze.stepSpeed = 150; 

  Maze.displayPegman(startPos[0] + deltas[0],
                     startPos[1] + deltas[1],
                     sprite);

  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(startPos[0] + deltas[0] * 2,
          startPos[1] + deltas[1] * 2,
          sprite+1);
    }, Maze.stepSpeed));

  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(startPos[0] + deltas[0] * 3,
          startPos[1] + deltas[1] * 3,
          sprite);
    }, Maze.stepSpeed * 2));
  
  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(endPos[0], endPos[1], directionSprite);
    }, Maze.stepSpeed * 3));
};

Maze.scheduleJump = function(startPos, endPos) {
  var deltas = [(endPos[0] - startPos[0]) / 4,
                (endPos[1] - startPos[1]) / 4,
                (endPos[2] - startPos[2]) / 4];
  //Choose sprite to show
  var sprite = (Maze.pegmanD * 3) + 21

  Maze.stepSpeed = 150; 

  Maze.displayPegman(startPos[0] + deltas[0],
                     startPos[1] + deltas[1],
                     sprite);

  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(startPos[0] + deltas[0] * 2,
          startPos[1] + deltas[1] * 2,
          sprite+1);
    }, Maze.stepSpeed));

  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(startPos[0] + deltas[0] * 3,
          startPos[1] + deltas[1] * 3,
          sprite+1);
    }, Maze.stepSpeed * 2));
  
  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(endPos[0], endPos[1],
          sprite+2);
    }, Maze.stepSpeed * 3));
};

/**
 * Display animation for Turn pegman left or right.
 * @param {number} dir Direction to turn (0 = left, 1 = right).
 */
Maze.scheduleTurn = function(dir) {
  var sprite

  if (dir) {
    // Right turn (clockwise).
    sprite = (Maze.pegmanD * 2) + 1 
  } else {
    // Left turn (counterclockwise).
    if (Maze.pegmanD == Maze.DirectionType.EAST || Maze.pegmanD == Maze.DirectionType.WEST){
      sprite = (Maze.pegmanD * 2) - 1 
    } else {
      sprite = 8 - (Maze.pegmanD * 2) - 1 
    }
  }

  Maze.stepSpeed = 150; 

  Maze.pidList.push(setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, sprite);
  }, Maze.stepSpeed));

  Maze.pidList.push(setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, Maze.pegmanD * 2);
  }, Maze.stepSpeed * 2));

};

/**
 * Schedule the animations and sounds for a failed move.
 * @param {boolean} forward True if forward, false if backward.
 */
Maze.scheduleFail = function(forward) {
  var deltaX = 0;
  var deltaY = 0;
  switch (Maze.pegmanD) {
    case Maze.DirectionType.NORTH:
      deltaY = -1;
      break;
    case Maze.DirectionType.EAST:
      deltaX = 1;
      break;
    case Maze.DirectionType.SOUTH:
      deltaY = 1;
      break;
    case Maze.DirectionType.WEST:
      deltaX = -1;
      break;
  }
  if (!forward) {
    deltaX = -deltaX;
    deltaY = -deltaY;
  }
    // Bounce bounce.
    var sprite = Maze.pegmanD + 33

    Maze.stepSpeed = 150; 

    deltaX /= 4;
    deltaY /= 4;
    var directionSprite = Maze.pegmanD * 2;

    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, directionSprite);
    BlocklyGames.workspace.getAudioManager().play('fail', 1.0);
    Maze.pidList.push(setTimeout(function() {
        Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, sprite);
      }, Maze.stepSpeed * 2));  
};

/**
 * Schedule the animations and sound for a victory dance.
 * @param {boolean} sound Play the victory sound.
 */
Maze.scheduleFinish = function(sound) {

  Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
  if (sound) {
    BlocklyGames.workspace.getAudioManager().play('win', 1.0);
  }
  Maze.stepSpeed = 150;  

  Maze.pidList.push(setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 18);
    }, Maze.stepSpeed));
  Maze.pidList.push(setTimeout(function() {
    Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 16);
    }, Maze.stepSpeed * 2));
  Maze.pidList.push(setTimeout(function() {
      Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, 18);
    }, Maze.stepSpeed * 3));
};

/**
 * Display Pegman at the specified location, facing the specified direction.
 * @param {number} x Horizontal grid (or fraction thereof).
 * @param {number} y Vertical grid (or fraction thereof).
 * @param {number} d Direction (0 - 15) or dance (16 - 17).
 * @param {number=} opt_angle Optional angle (in degrees) to rotate Pegman.
 */
Maze.displayPegman = function(x, y, d, opt_angle) {

  if (BlocklyGames.LEVEL != 0) {
    var pegmanIcon = document.getElementById('pegman');

    var pegmanYPos = Maze.SQUARE_SIZE * (y + 0.5) - Maze.PEGMAN_HEIGHT/2 - 8 + Maze.MAZE_TOP_OFFSET
    
    var pegmanXOffset = Maze.PEGMAN_WIDTH/2 - Maze.SQUARE_SIZE/2 

    pegmanIcon.setAttribute('x',
      (x * Maze.SQUARE_SIZE - d * Maze.PEGMAN_WIDTH + 1) - pegmanXOffset );
    pegmanIcon.setAttribute('y', pegmanYPos)

    var clipRect = document.getElementById('clipRect');
    clipRect.setAttribute('x', (x * Maze.SQUARE_SIZE + 1) - pegmanXOffset);
    clipRect.setAttribute('y', pegmanYPos);

    if (opt_angle) {
      pegmanIcon.setAttribute('transform', 'rotate(' + opt_angle + ', ' +
          (x * Maze.SQUARE_SIZE + Maze.SQUARE_SIZE / 2) + ', ' +
          (y * Maze.SQUARE_SIZE + Maze.SQUARE_SIZE / 2) + ')');
    } else {
      pegmanIcon.setAttribute('transform', 'rotate(0, 0, 0)');
    }
  } 
};

/**
 * Display the look icon at Pegman's current location,
 * in the specified direction.
 * @param {!Maze.DirectionType} d Direction (0 - 3).
 */
Maze.scheduleLook = function(d) {
  var x = Maze.pegmanX;
  var y = Maze.pegmanY;
  switch (d) {
    case Maze.DirectionType.NORTH:
      x += 0.5;
      break;
    case Maze.DirectionType.EAST:
      x += 1;
      y += 0.5;
      break;
    case Maze.DirectionType.SOUTH:
      x += 0.5;
      y += 1;
      break;
    case Maze.DirectionType.WEST:
      y += 0.5;
      break;
  }
  x *= Maze.SQUARE_SIZE;
  y *= Maze.SQUARE_SIZE;
  var deg = d * 90 - 45;

  var lookIcon = document.getElementById('look');
  lookIcon.setAttribute('transform',
      'translate(' + x + ', ' + y + ') ' +
      'rotate(' + deg + ' 0 0) scale(.4)');
  var paths = lookIcon.getElementsByTagName('path');
  lookIcon.style.display = 'inline';
  for (var i = 0, path; (path = paths[i]); i++) {
    Maze.scheduleLookStep(path, Maze.stepSpeed * i);
  }
};

/**
 * Display the animation of catch object at Pegman's current location,
 * in the specified direction.
 * @param {!Maze.DirectionType} d Direction (0 - 3).
 */
Maze.scheduleCatch = function() {
  //Choose sprite to show
  var sprite = Maze.pegmanD  + 37

  Maze.displayPegman(Maze.pegmanX, Maze.pegmanY, sprite);

  if (BlocklyGames.LEVEL == 4) {
    var obj = Maze.whichObject()

    if (obj != -1){
      var object = document.getElementById("finish"+obj)
      object.style.visibility = "hidden";
    }
  } else {
    var obj = Maze.whichObject()
    if (obj != -1){
      var object = document.getElementById("finish")
      object.style.visibility = "hidden";
    } 
  }
};

/**
 * Returns the number of the object that the robot is in
 */
Maze.whichObject = function() {
  var count = 0;
  for (var y = 0; y < Maze.ROWS; y++) {
    for (var x = 0; x < Maze.COLS; x++) {
      if (Maze.map[y][x] == Maze.SquareType.FINISH) {
        if (Maze.pegmanY == y && Maze.pegmanX == x) {
          return count
        }
        count++
      }
    }
  } 
  return -1
};

/**
 * Schedule one of the 'look' icon's waves to appear, then disappear.
 * @param {!Element} path Element to make appear.
 * @param {number} delay Milliseconds to wait before making wave appear.
 */
Maze.scheduleLookStep = function(path, delay) {
  Maze.pidList.push(setTimeout(function() {
    path.style.display = 'inline';
    setTimeout(function() {
      path.style.display = 'none';
    }, Maze.stepSpeed * 2);
  }, delay));
};

//MAIN FUNCTIONS OF HUB BLOCKS

/**
 * Changes the actual state of the ground
 * @param state Direction 0->dirty, 1->clean.
 * @param id The id of the block that changed the ground.
 */
Maze.changeGround = function(state, id) {

  var ground = document.getElementById("ground")

  ground.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.ground[state]);
};
/**
 * Changes the actual state of the enviroment
 * @param state Direction 0->deforest, 1->forest.
 * @param id The id of the block that changed the enviroment.
 */
Maze.changeEnviroment = function(state, id) {

  for (var i = 0; i < 2; i++) {
    var enviroment = document.getElementById("enviroment"+i)
    enviroment.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.enviroment[state][i]); 
  }
};
/**
 * Changes the actual state of the speaker
 * @param state Direction 0->off, 1->on.
 * @param id The id of the block that changed the speaker.
 */
Maze.changeSpeaker = function(state, id) {

  var speaker = document.getElementById("speaker")

  speaker.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.speaker[state]);
};
/**
 * Changes the actual state of the street
 * @param state Direction 0->unpaved, 1->paved.
 * @param id The id of the block that changed the street.
 */
Maze.changeStreet = function(state, id) {

  var street = document.getElementById("street")

  street.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
              Maze.HUB.street[state]);
};


/**
 * Keep the direction within 0-3, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Maze.constrainDirection4 = function(d) {
  d = Math.round(d) % 4;
  if (d < 0) {
    d += 4;
  }
  return d;
};

/**
 * Keep the direction within 0-15, wrapping at both ends.
 * @param {number} d Potentially out-of-bounds direction value.
 * @return {number} Legal direction value.
 */
Maze.constrainDirection16 = function(d) {
  d = Math.round(d) % 16;
  if (d < 0) {
    d += 16;
  }
  return d;
};

// Core functions.

/**
 * Attempt to move pegman forward or backward.
 * @param {number} direction Direction to move (0 = forward, 2 = backward).
 * @param {string} id ID of block that triggered this action.
 * @throws {true} If the end of the maze is reached.
 * @throws {false} If Pegman collides with a wall.
 */
Maze.move = function(direction, id) {
  var wrongMove = false
  if (!Maze.isPath(direction, null, false)) {
    wrongMove = true
  }

  // If moving backward, flip the effective direction.
  var effectiveDirection = Maze.pegmanD + direction;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      Maze.pegmanY--;
      command = 'north';
      break;
    case Maze.DirectionType.EAST:
      Maze.pegmanX++;
      command = 'east';
      break;
    case Maze.DirectionType.SOUTH:
      Maze.pegmanY++;
      command = 'south';
      break;
    case Maze.DirectionType.WEST:
      Maze.pegmanX--;
      command = 'west';
      break;
  }
  Maze.log.push([command, id]);

  if (wrongMove){
    Maze.log.push(['fail_' + (direction ? 'backward' : 'forward'), id]);
    throw false;
  }
};

/**
 * Attempt to jump pegman forward or backward.
 * @param {number} direction Direction to move (0 = forward, 2 = backward).
 * @param {string} id ID of block that triggered this action.
 * @throws {true} If the end of the maze is reached.
 * @throws {false} If Pegman collides with a wall.
 */
Maze.jump = function(direction, id) {
  var wrongJump = false
  if (!Maze.isPath(direction, null, true)) {
    wrongJump = true
  }
  // If moving backward, flip the effective direction.
  var effectiveDirection = Maze.pegmanD + direction;
  var command;
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      Maze.pegmanY = Maze.pegmanY-2;
      command = 'jump_north';
      break;
    case Maze.DirectionType.EAST:
      Maze.pegmanX = Maze.pegmanX+2;
      command = 'jump_east';
      break;
    case Maze.DirectionType.SOUTH:
      Maze.pegmanY = Maze.pegmanY+2;
      command = 'jump_south';
      break;
    case Maze.DirectionType.WEST:
      Maze.pegmanX = Maze.pegmanX-2;
      command = 'jump_west';
      break;
  }

  Maze.log.push([command, id]);

  if (wrongJump){
    Maze.log.push(['fail_' + (direction ? 'backward' : 'forward'), id]);
    throw false;
  }
};

/**
 * Turn pegman left or right.
 * @param {number} direction Direction to turn (0 = left, 1 = right).
 * @param {string} id ID of block that triggered this action.
 */
Maze.turn = function(direction, id) {
  if (direction) {
    // Right turn (clockwise).
    Maze.pegmanD++;
    Maze.log.push(['right', id]);
  } else {
    // Left turn (counterclockwise).
    Maze.pegmanD--;
    Maze.log.push(['left', id]);
  }
  Maze.pegmanD = Maze.constrainDirection4(Maze.pegmanD);
};

/**
 * Is there a path next to pegman?
 * @param {number} direction Direction to look
 *     (0 = forward, 1 = right, 2 = backward, 3 = left).
 * @param {?string} id ID of block that triggered this action.
 *     Null if called as a helper function in Maze.move().
 * @param {?string} isJump to identify if it's called from a jump block.
 *     Null if called in isPathFoward.. etc.
 * @return {boolean} True if there is a path.
 */
Maze.isPath = function(direction, id, isJump) {
  var effectiveDirection = Maze.pegmanD + direction;
  var square;
  var command;
  var numberOfSquares = 1;
  if (isJump) {
    numberOfSquares = 2;
  }
  switch (Maze.constrainDirection4(effectiveDirection)) {
    case Maze.DirectionType.NORTH:
      square = Maze.map[Maze.pegmanY - numberOfSquares] &&
          Maze.map[Maze.pegmanY - numberOfSquares][Maze.pegmanX];
      command = 'look_north';
      break;
    case Maze.DirectionType.EAST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX + numberOfSquares];
      command = 'look_east';
      break;
    case Maze.DirectionType.SOUTH:
      square = Maze.map[Maze.pegmanY + numberOfSquares] &&
          Maze.map[Maze.pegmanY + numberOfSquares][Maze.pegmanX];
      command = 'look_south';
      break;
    case Maze.DirectionType.WEST:
      square = Maze.map[Maze.pegmanY][Maze.pegmanX - numberOfSquares];
      command = 'look_west';
      break;
  }
  if (id) {
    Maze.log.push([command, id]);
  }

  return square !== Maze.SquareType.WALL && square !== undefined && square !== Maze.SquareType.OBSTACLE;
};

/**
 * Check if there's something to catch at that square
 * If it has something, catch it
 * @return {boolean} True if something was catched, false if not.
 */
Maze.catchObject = function(id) {
  var actualSquare = Maze.map[Maze.pegmanY][Maze.pegmanX];
  var command;

  switch (Maze.pegmanD) {
    case Maze.DirectionType.NORTH:
      command = 'catch_north';
      break;
    case Maze.DirectionType.EAST:
      command = 'catch_east';
      break;
    case Maze.DirectionType.SOUTH:
      command = 'catch_south';
      break;
    case Maze.DirectionType.WEST:
      command = 'catch_west';
      break;
  }

  if (id) {
    Maze.log.push([command, id]);
  }

  //if (BlocklyGames.LEVEL == 1) {
    if (actualSquare == Maze.SquareType.FINISH) {
      Maze.objectsCatched++
      Maze.totalLevelObjectsCatched++
      return true
   // } else {
  //    return false
   // }
  }

};


/**
 * Is the player at the finish marker?
 * @return {boolean} True if not done, false if done.
 */
Maze.notDone = function() {
  var catchedAllObjects = false
  var correctX = false
  var correctY = false

  if (BlocklyGames.LEVEL <= 3) {
    catchedAllObjects = Maze.objectsCatched >= 1 ? true : false;
    correctX = Maze.pegmanX == Maze.finish_[0].x ? true : false;
    correctY = Maze.pegmanY == Maze.finish_[0].y ? true : false;
  } else {
    if (Maze.objectsCatched >= 4) {
      catchedAllObjects = true;
      correctX = true;
      correctY = true;      
    }

  }

  //alert("correctX "+correctX+"\ncorrectY "+correctY+"\ncatchedAllObjects "+catchedAllObjects)
  return !correctX || !correctY || !catchedAllObjects;
};

//--------------------------------------------------------------------------
window.addEventListener('load', Maze.init);


