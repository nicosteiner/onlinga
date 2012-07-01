ONLINGA.Gamepad = (function() {

  // private variables

  var underground = [],
      surface = [],
      props = [],
      military = [],
      canvas,
      canvasContext;

  // public methods
  
  return {

    init: function() {
    
      canvas = document.getElementById('background-canvas');
      
      canvasContext = canvas.getContext('2d');

      // 0 = meadow (normal area)
      // 1 = fallow (green)
      // 2 = fallow (beige)

      underground = [
      
        [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 0, 1, 1, 0, 1, 1, 1, 0, 0],
                                      
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                                      
        [0, 0, 2, 2, 2, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
                                      
      ];
      
      
      // 0 = nothing
      // 1 = lake
      // 2 = tree
      // 3 = hill
      // 4 = canyon
      
      surface = [
      
        [0, 2, 0, 2, 2, 0, 0, 2, 0, 0],
                                      
        [1, 1, 0, 3, 2, 2, 3, 2, 0, 0],
                                      
        [3, 1, 0, 0, 3, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 1, 2, 0, 0, 0, 0, 3],
                                      
        [0, 0, 0, 0, 0, 0, 1, 1, 2, 0],
                                      
        [0, 0, 0, 2, 0, 0, 0, 1, 2, 2]
                                      
      ];
      
      // depends on surface data
      
      // 0 = nothing
      // 2 + 1 = one tree
      // 2 + 2 = many trees
      
      props = [
      
        [0, 1, 0, 2, 2, 0, 0, 2, 0, 0],
                                      
        [0, 0, 0, 3, 2, 1, 4, 2, 0, 0],
                                      
        [1, 0, 0, 0, 2, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 5],
                                      
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                                      
        [0, 0, 0, 1, 0, 0, 0, 0, 2, 0]
                                      
      ];
      
      military = [
      
        {
        
          position: { x: 2, y: 1 },
          
          player: 1,
          
          type: 'rider',
          
          range: 4,
          
          units: ONLINGA.Units.Factory.createRiders(1),
          
          orientation: 1
          
        }, {
        
          position: { x: 5, y: 2 },
          
          player: 2,
          
          type: 'knight',
          
          range: 2,
          
          units: ONLINGA.Units.Factory.createKnights(2),
          
          orientation: 1
          
        }, {
        
          position: { x: 6, y: 2 },
          
          player: 2,
          
          type: 'archer',
          
          range: 3,
          
          units: ONLINGA.Units.Factory.createArchers(3),
          
          orientation: 1
          
        }, {
        
          position: { x: 8, y: 3 },
          
          player: 1,
          
          type: 'rider',
          
          range: 4,
          
          units: ONLINGA.Units.Factory.createRiders(2),
          
          orientation: 1
          
        }, {
        
          position: { x: 4, y: 4 },
          
          player: 2,
          
          type: 'knight',
          
          range: 2,
          
          units: ONLINGA.Units.Factory.createKnights(5),
          
          orientation: 1
          
        }, {
        
          position: { x: 1, y: 4 },
          
          player: 1,
          
          type: 'rider',
          
          range: 4,
          
          units: ONLINGA.Units.Factory.createRiders(3),

          orientation: 1
          
        }, {
        
          position: { x: 4, y: 3 },
          
          player: 1,
          
          type: 'knight',
          
          range: 2,
          
          units: ONLINGA.Units.Factory.createKnights(5),
          
          orientation: 1
          
        }
        
      ];
      
      // specials
      // ========
      
      // ? = castle building
      // ? = river
      // ? = bridge
    
      // troups were positioned dynamically
      
      // some initial vars
      
      ONLINGA.Gamepad.range = false;
      
      ONLINGA.Gamepad.movedMilitaryIndex = false;
      
      ONLINGA.Gamepad.activePlayer = 1;
      
      ONLINGA.Gamepad.createMilitaryIndex();
      
    },
    
    createMilitaryIndex: function() {
    
      var i;
      
      for (i = 0; i < military.length; i += 1) {
      
        military[i].index = i;
      
      }
    
    },
    
    removeMilitaryByIndex: function(index) {
    
      if (military[index]) {
      
        delete military[index];
      
      }
    
    },
    
    renderSurface: function() {
    
      // for performance reasons remove preloader from dom
      
      $('#preloader').remove();
      
      $('#gamepad').removeClass('hidden');
    
      // for performance reasons grass and stones were rendered as canvas

      ONLINGA.Gamepad.renderBackground();
    
      ONLINGA.Gamepad.renderMilitary();

      // trees and hills are rendered as dom nodes
      
      ONLINGA.Gamepad.renderObjects();

      // start the game with displaying a title
      
      ONLINGA.Gamepad.showGameTitle('<h1>Player 1</h1>');
      
    },
    
    initEvents: function() {
    
      $('#wrapper').click(function(e) {
        
        ONLINGA.Gamepad.processClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        
      });
      
      $('#next-turn-button').click(function(e) {
      
        e.preventDefault();
        
        ONLINGA.Gamepad.switchToNextTurn();
      
      });
    
    },
    
    switchToNextTurn: function() {
    
      ONLINGA.Gamepad.range = false;
      
      ONLINGA.Gamepad.movedMilitaryIndex = false;
      
      ONLINGA.Gamepad.deselectAll();
  
      $('#next-turn-button').removeClass('highlight');
    
      if (ONLINGA.Gamepad.activePlayer === 1) {
      
        ONLINGA.Gamepad.activePlayer = 2;
        
        ONLINGA.Gamepad.showGameTitle('<h1>Player 2</h1>');
      
      } else {
      
        ONLINGA.Gamepad.activePlayer = 1;
      
      
        ONLINGA.Gamepad.showGameTitle('<h1>Player 1</h1>');
      
      }
      
    },
    
    processClick: function(x, y) {
    
      // get target hexaeder
      
      var i, j, offset;
      
      for (i = 0; i < underground.length; i += 1) {
    
        for (j = 0; j < underground[i].length; j += 1) {
        
          offset = j % 2 === 0 ? 36 : 0;
          
          if (x > j * 54 + 5 &&
              x < j * 54 + 73 - 5 &&
              y > i * 72 + offset &&
              y < i * 72 + offset + 73) {
            
            ONLINGA.Gamepad.processClickAtTile(j, i);
            
            break;
            
          }
          
        }
        
      }
      
    },
    
    processClickAtTile: function(x, y) {

      var offsetY, i, j, validTarget, validClick, possibleEnemy, surfaceData;
    
      // the main logic can be found here
    
      // check the mode of selection (selected / not selected)
      
      if (ONLINGA.Gamepad.validTargets) {
    
        // yes, currently something is selected
    
        if (ONLINGA.Gamepad.selectedMilitary && ONLINGA.Gamepad.selectedMilitary.position.x === x && ONLINGA.Gamepad.selectedMilitary.position.y === y) {
      
          // if the active military group is clicked, undo selection completely
      
          ONLINGA.Gamepad.deselectAll();
          
        } else {

          // if an other tile is clicked...
          
          // check if it is a valid target for the military
        
          validClick = false;
        
          validTarget = false;
        
          for (i = 0; i < ONLINGA.Gamepad.validTargets.length; i += 1) {
          
            // at the beginning of a new range validTargets[i] is undefined
          
            if (ONLINGA.Gamepad.validTargets[i]) {
          
              for (j = 0; j < ONLINGA.Gamepad.validTargets[i].length; j += 1) {
              
                if (ONLINGA.Gamepad.validTargets[i][j].x === x && ONLINGA.Gamepad.validTargets[i][j].y === y) {
                
                  validClick = true;
                
                  // you can only move with a distance of 1
                
                  if (i === 1) {
                  
                    validTarget = ONLINGA.Gamepad.validTargets[i][j];
                    
                    ONLINGA.Gamepad.range = ONLINGA.Gamepad.validTargets.length - i - 1;
                    
                  }
                  
                  break;
                
                }
                
              }
              
            }
          
          }
          
          if (validTarget) {
          
            // calculate target action
            
            // check for attacking enemy
            
            possibleEnemy = ONLINGA.Gamepad.getMilitaryAtPosition(x, y);
            
            surfaceData = ONLINGA.Gamepad.getSurfaceDataAtPosition(x, y);
            
            if (possibleEnemy && possibleEnemy.player !== ONLINGA.Gamepad.activePlayer) {
            
              // attack

              ONLINGA.Units.CombatManager.processCloseAttack(ONLINGA.Gamepad.selectedMilitary, possibleEnemy);
            
            } else {
            
              // deal with surface data later
              
              ONLINGA.Gamepad.moveMilitaryToPosition(x, y);
            
              ONLINGA.Gamepad.highlightActiveMilitaryHexaeder();

            }
      
          } else {
          
            if (!validClick) {
            
              // no valid target/click (click outside of range)
            
              ONLINGA.Gamepad.deselectAll();
              
            }
          
          }
        
        }
        
      } else {
      
        // there is nothing selected
    
        // check if there is own military at clicked tile
        
        ONLINGA.Gamepad.selectedMilitary = ONLINGA.Gamepad.getMilitaryAtPosition(x, y);
        
        if (ONLINGA.Gamepad.selectedMilitary && ONLINGA.Gamepad.selectedMilitary.player === ONLINGA.Gamepad.activePlayer) {
      
          // yes, there is own military
          
          // check if it the active military for this round
          
          if (ONLINGA.Gamepad.movedMilitaryIndex === false || ONLINGA.Gamepad.selectedMilitary.index === ONLINGA.Gamepad.movedMilitaryIndex) {
            
            // no military was moved before or the same military was moved
            
            // highlight military and valid targets
        
            ONLINGA.Gamepad.highlightActiveMilitaryHexaeder();

            ONLINGA.Gamepad.highlightTargetHexaeders(ONLINGA.Gamepad.range);
            
            // if there are no moves left inform user
            
            if (ONLINGA.Gamepad.range === 0) {

              ONLINGA.Gamepad.showHintAtPosition('NO MOVES LEFT!', x, y);
              
            }
            
          } else {
          
            // a military that was not moved before was selected
            // in this case prevent military from beeing moved
          
            ONLINGA.Gamepad.selectedMilitary = false;
          
          }
          
        }
            
      }
      
    },
    
    highlightActiveMilitaryHexaeder: function() {
    
      var x, y;
    
      if (ONLINGA.Gamepad.selectedMilitary) {
    
        x = ONLINGA.Gamepad.selectedMilitary.position.x;
        
        y = ONLINGA.Gamepad.selectedMilitary.position.y;
          
        if (!ONLINGA.Gamepad.militaryHighlightElement) {
      
          ONLINGA.Gamepad.militaryHighlightElement = $('.highlight').first().clone().appendTo('#gamepad');

          ONLINGA.Gamepad.militaryHighlightElement.addClass('pulse');
          
        }
        
        offsetY = x % 2 === 0 ? 36 : 0;
        
        $(ONLINGA.Gamepad.militaryHighlightElement).css({
        
          left: x * 54 + 1,
          
          top: y * 72 + offsetY + 1,
          
          display: 'block'
          
        });
        
      }
          
    },
    
    deselectAll: function() {
    
      // deselect targets
      
      ONLINGA.Gamepad.removeExistingTargetHighlightings();
    
      // deselect military
      
      ONLINGA.Gamepad.deselectMilitary();
    
    },
    
    showAttackHits: function(hits) {
    
      var text;
    
      if (hits < 0) {
      
        $('#hit').addClass('negative');
      
      } else {
      
        $('#hit').removeClass('negative');
      
      }
      
      text = hits > 1 || hits < -1 ? hits + ' HITS' : hits + 'HIT';
    
      $('#hit').text(text);
    
      $('#hit').css({ display: 'block' });
    
      $('#hit').animate( { fontSize: '-=30px' }, 250 )
               .animate( { opacity: 0 }, 500, function() {
                $('#hit').css({ fontSize: '100px', opacity: '1', display: 'none' });
      });

      $('#gamepad').animate( { marginLeft: '-=10px', marginTop: '-=10px' }, 10 )
                   .animate( { marginLeft: '+=10px', marginTop: '+=10px' }, 10 )
                   .animate( { marginLeft: '-=6px', marginTop: '-=6px' }, 10 )
                   .animate( { marginLeft: '+=6px', marginTop: '+=6px' }, 10 )
                   .animate( { marginLeft: '-=4px', marginTop: '-=4px' }, 10 )
                   .animate( { marginLeft: '+=4px', marginTop: '+=4px' }, 10 );
    
    },
    
    setMilitaryOrientation: function(x, y) {
    
      var xOrientation, yOrientation, orientation,
          militaryBackground, militaryElement,
          regExpPattern;
      
      xOrientation = x - ONLINGA.Gamepad.selectedMilitary.position.x;
      
      yOrientation = y - ONLINGA.Gamepad.selectedMilitary.position.y - (x % 2);
      
      // there are 6 orientations possible
      
      // the calculation only in vertical orientation depends on x position
      
      // 1 - down / 2 - down|left / 3 - up|left
      
      if (xOrientation === 0 && yOrientation === (1 - (x % 2))) {
      
        orientation = 1;
      
      }
    
      if (xOrientation === -1 && yOrientation === 0) {
      
        orientation = 2;
      
      }
    
      if (xOrientation === -1 && yOrientation === -1) {
      
        orientation = 3;
      
      }
    
      // 4 - up   / 5 - up|right  / 6 - down|right
      
      if (xOrientation === 0 && yOrientation === (-1 - (x % 2))) {
      
        orientation = 4;
      
      }
        
      if (xOrientation === 1 && yOrientation === -1) {
      
        orientation = 5;
      
      }
    
      if (xOrientation === 1 && yOrientation === 0) {
      
        orientation = 6;
      
      }
      
      if (orientation) {
      
        // change military character backgrounds
        
        militaryElement = $('#military-tile-' + ONLINGA.Gamepad.selectedMilitary.index);
        
        militaryBackground = militaryElement.css('background-image');

        regExpPattern = new RegExp(ONLINGA.Gamepad.selectedMilitary.type + '-' + ONLINGA.Gamepad.selectedMilitary.orientation, 'gi');
        
        militaryBackground = militaryBackground.replace(regExpPattern, ONLINGA.Gamepad.selectedMilitary.type + '-' + orientation);
      
        militaryElement.css({
          
          'background-image': militaryBackground
          
        });
      
        // set new orientation after that
        
        ONLINGA.Gamepad.selectedMilitary.orientation = orientation;
        
      }
      
    },
    
    setMilitaryPosition: function(x, y) {
    
      var militaryElement, offsetY;
    
      ONLINGA.Gamepad.selectedMilitary.position.x = x;
      
      ONLINGA.Gamepad.selectedMilitary.position.y = y;
      
      militaryElement = $('#military-tile-' + ONLINGA.Gamepad.selectedMilitary.index);
    
      offsetY = ONLINGA.Gamepad.selectedMilitary.position.x % 2 === 0 ? 36 : 0;

      militaryElement.css({
      
        left: ONLINGA.Gamepad.selectedMilitary.position.x * 54,
        
        top: ONLINGA.Gamepad.selectedMilitary.position.y * 72 + offsetY,
        
        display: 'block'
        
      });
    
    },
    
    moveMilitaryToPosition: function(x, y) {
    
      var treeElement;
    
      if (ONLINGA.Gamepad.selectedMilitary) {
      
        // when military is moved, player can't select any other military in the same round
        
        ONLINGA.Gamepad.movedMilitaryIndex = ONLINGA.Gamepad.selectedMilitary.index;
      
        treeElement = ONLINGA.Gamepad.getTreeElementAtPosition(ONLINGA.Gamepad.selectedMilitary.position.x, ONLINGA.Gamepad.selectedMilitary.position.y);
        
        if (treeElement) {
        
          treeElement.removeClass('transparent');
        
        }
      
        treeElement = ONLINGA.Gamepad.getTreeElementAtPosition(x, y);
        
        if (treeElement) {
        
          treeElement.addClass('transparent');
        
          // if this is the case, show a hint "defence bonus"
          
          ONLINGA.Gamepad.showHintAtPosition('DEFENCE BONUS', x, y);
          
        }
      
        ONLINGA.Gamepad.setMilitaryOrientation(x, y);
      
        ONLINGA.Gamepad.setMilitaryPosition(x, y);
      
        // still moves left?
        
        if (ONLINGA.Gamepad.range !== 0) {
        
          ONLINGA.Gamepad.highlightTargetHexaeders(ONLINGA.Gamepad.range);
        
        } else {
        
          // no moves left
          
          ONLINGA.Gamepad.endTurn();
        
          ONLINGA.Gamepad.showHintAtPosition('NO MOVES LEFT!', x, y);
          
        }
      
      }
      
    },
    
    endTurn: function() {
    
      ONLINGA.Gamepad.deselectAll();
      
      ONLINGA.Gamepad.range = 0;
  
      // highlight next turn button
      
      $('#next-turn-button').addClass('highlight');
      
      //ONLINGA.Gamepad.playAudio('horn');
      
    },
    
    showHintAtPosition: function(text, x, y) {
    
      var offsetY;
    
      $('#hint').text(text);

      offsetY = x % 2 === 0 ? 36 : 0;
      
      $('#hint').css({
      
        left: x * 54 + 37 - (text.length * 3),
        
        top: y * 72 + offsetY,
        
        display: 'block',
        
        opacity: '0.2'
      
      });

      $('#hint').animate( { marginTop: '-=6px', opacity: 1 }, 500 )
                .delay(250)
                .animate( { marginTop: '-=6px', opacity: 0 }, 500, function() {
                $('#hint').css({ marginTop: '0', display: 'none' });
      });
      
    },
    
    playAudio: function(audio) {
    
      var audioElement;
      
      audioElement = document.getElementById('audio-' + audio);
    
      if (audioElement) {
      
        audioElement.play();
      
      }
    
    },
    
    showGameTitle: function(titleMarkup) {
    
      $('#title').html(titleMarkup);
      
      $('#title').removeClass('hidden');
      
      ONLINGA.Gamepad.playAudio('swoosh');
    
      $('#title').animate({
                   top: '+=300px',
                   fontSize: '-=150px'
                 }, 250)
                 .delay(500)
                 .animate({
                   top: '-=25px',
                   letterSpacing: '+=80px',
                   fontSize: '+=50px',
                   opacity: 0
                 }, 250, function() {
                     $('#title').css({
                       top: '-100px',
                       fontSize: '230px',
                       letterSpacing: '-=80px',
                       opacity: 1
                     })
                     .addClass('hidden');
                 });
      
    },
    
    highlightTargetHexaeders: function(range) {
    
      if (range === false) {
    
        // calculate range by type of military
        
        if (ONLINGA.Gamepad.selectedMilitary) {
        
          range = ONLINGA.Gamepad.selectedMilitary.range;
          
        }
        
        // remove existing highlightings
        
        ONLINGA.Gamepad.removeExistingTargetHighlightings();
        
        // highlight targets in range
        
        ONLINGA.Gamepad.highlightTargetsInRange(range);
        
      } else {
      
        // remove existing highlightings
        
        ONLINGA.Gamepad.removeExistingTargetHighlightings();
        
        // highlight targets in range
        
        ONLINGA.Gamepad.highlightTargetsInRange(range);

      }
    
    },
    
    removeExistingTargetHighlightings: function() {
    
      var existingHighlightings, i;
      
      existingHighlightings = $('#gamepad .highlight.target');
    
      for (i = 0; i < existingHighlightings.length; i += 1) {
      
        $(existingHighlightings[i]).remove();
      
      }
      
      delete ONLINGA.Gamepad.validTargets;
      
    },
    
    deselectMilitary: function() {

      if (ONLINGA.Gamepad.militaryHighlightElement) {
    
        $(ONLINGA.Gamepad.militaryHighlightElement).css({
          
          display: 'none'
          
        });
        
      }
      
      ONLINGA.Gamepad.selectedMilitary = false;
      
    },
    
    highlightTargetsInRangeSub: function(range) {
    
      var i, x, y;
    
      ONLINGA.Gamepad.validTargets[range] = [];
      
      for (i = 0; i < ONLINGA.Gamepad.validTargets[range - 1].length; i += 1) {
    
        x = ONLINGA.Gamepad.validTargets[range - 1][i].x;
    
        y = ONLINGA.Gamepad.validTargets[range - 1][i].y;
    
        ONLINGA.Gamepad.highlightTargetHexaeder(x - 1, y - x % 2, range);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x, y - 1, range);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x + 1, y - x % 2, range);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x - 1, y + (1 - x % 2), range);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x + 1, y + (1 - x % 2), range);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x, y + 1, range);
    
      }
    
    },
    
    highlightTargetsInRange: function(range) {
    
      var x, y, i;
      
      x = ONLINGA.Gamepad.selectedMilitary.position.x;
    
      y = ONLINGA.Gamepad.selectedMilitary.position.y;
    
      // highlight range 1 in every case
      
      ONLINGA.Gamepad.validTargets = [];
      
      ONLINGA.Gamepad.validTargets[1] = [];
      
      if (range > 0) {
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x - 1, y - x % 2, 1);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x, y - 1, 1);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x + 1, y - x % 2, 1);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x - 1, y + (1 - x % 2), 1);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x + 1, y + (1 - x % 2), 1);
      
        ONLINGA.Gamepad.highlightTargetHexaeder(x, y + 1, 1);
        
      }
    
      if (range > 1) {
    
        for (i = 2; i <= range; i += 1) {
        
          ONLINGA.Gamepad.highlightTargetsInRangeSub(i);
        
        }
        
      }
    
    },
    
    isAlreadyValidTarget: function(x, y, range) {
    
      var i, j;
    
      // targets with range = 1 are always new
    
      if (range > 1) {
      
        for (i = 0; i <= range; i += 1) {
        
          // at the beginning of a new range validTargets[i] is undefined
        
          if (ONLINGA.Gamepad.validTargets[i]) {
        
            for (j = 0; j < ONLINGA.Gamepad.validTargets[i].length; j += 1) {
            
              if (ONLINGA.Gamepad.validTargets[i][j].x === x && ONLINGA.Gamepad.validTargets[i][j].y === y) {
              
                return true;
              
              }
            
            }
            
          }
          
        }
      
      }
      
      return false;
    
    },
    
    highlightTargetHexaeder: function(x, y, range) {
    
      var highlightElement, militaryTarget, offsetY;

      highlightElement = $('.highlight.hexaeder').first().clone().appendTo('#gamepad');

      highlightElement.addClass('target');
      
      // check if hexaeder is valid target (no lake/canyon)
      
      if (typeof surface[y] !== 'undefined' && typeof surface[y][x] !== 'undefined' && surface[y][x] !== 1 && surface[y][x] !== 4) {
      
        // check if there is an own military target
        // if not, highlight the hexaeder

        if (!ONLINGA.Gamepad.isAlreadyValidTarget(x, y, range)) {
        
          militaryTarget = ONLINGA.Gamepad.getMilitaryAtPosition(x, y);
          
          if (!militaryTarget || militaryTarget.player !== ONLINGA.Gamepad.activePlayer) {
          
            offsetY = x % 2 === 0 ? 36 : 0;
            
            $(highlightElement).css({
            
              left: x * 54 + 1,
              
              top: y * 72 + offsetY + 1,
                    
              display: 'block'
              
            });
            
            ONLINGA.Gamepad.validTargets[range].push({
            
              x: x,
              
              y: y
              
            });
            
          }
          
          // if it is an enemy military, highlight hexaeder red
          
          if (militaryTarget && militaryTarget.player !== ONLINGA.Gamepad.activePlayer) {
          
            highlightElement.addClass('enemy');
          
          }
          
          // if it is outside range 1, make it even more transparent
          
          if (range > 1) {
          
            highlightElement.addClass('outside');
          
          }
          
        }
        
      }
    
    },
    
    getMilitaryAtPosition: function(x, y) {
    
      var i;
      
      for (i = 0; i < military.length; i += 1) {
      
        if (military[i] && military[i].position.x === x && military[i].position.y === y) {
        
          return military[i];
        
        }
      
      }
    
    },
    
    getTreeElementAtPosition: function(x, y) {
    
      var treeElement;
    
      if (surface[y][x] === 2) {

        treeElement = $('#tree-tile-' + y + '-' + x);
        
      }
      
      return treeElement;
      
    },
        
    getSurfaceDataAtPosition: function(x, y) {
    
      var surfaceData;
      
      surfaceData = {
      
        surface: surface[y] && surface[y][x] ? surface[y][x] : false,
        
        props: props[y] && props[y][x] ? props[y][x] : false
      
      };
      
      return surfaceData;
    
    },
    
    renderBackground: function() {
    
      var i, j, meadowImage = [],
          hexagonImage, offset,
          fallowImage = [];
    
      canvasContext.fillStyle = 'rgba(140, 164, 52, 1)';
      canvasContext.fillRect(0, 0, 570, 470);
    
      // create images
    
      meadowImage[0] = new Image();
          
      meadowImage[0].src = 'img/gamepad/meadow-1.gif';

      meadowImage[1] = new Image();
          
      meadowImage[1].src = 'img/gamepad/meadow-2.gif';

      meadowImage[2] = new Image();
          
      meadowImage[2].src = 'img/gamepad/meadow-3.gif';

      hexagonImage = new Image();

      hexagonImage.src = 'img/gamepad/hexaeder.png';

      fallowImage[0] = new Image();

      fallowImage[0].src = 'img/gamepad/fallow-medium-1.png';
      
      fallowImage[1] = new Image();
      
      fallowImage[1].src = 'img/gamepad/fallow-big-1.png';
      
      fallowImage[2] = new Image();
      
      fallowImage[2].src = 'img/gamepad/fallow-big-2.png';
        
      for (i = 0; i < underground.length; i += 1) {
    
        for (j = 0; j < underground[i].length; j += 1) {
    
          offset = j % 2 === 0 ? 36 : 0;
          
          canvasContext.drawImage(meadowImage[$.random(3)], j * 54, i * 72 + offset, 74, 73);
          
        }
        
      }
      
      for (i = 0; i < underground.length; i += 1) {
    
        for (j = 0; j < underground[i].length; j += 1) {
        
          offset = j % 2 === 1 ? 36 : 0;
          
          if (underground[i][j] === 1 && underground[i][j + 1] === 1 && underground[i + 1][j + 1] === 1 && underground[i][j + 2] !== 1) {
   
            canvasContext.drawImage(fallowImage[0], j * 54 + 4, i * 72 + 8 + offset, 120, 130);
          
          }
          
          // maybe later
          
          /*
          if (underground[i][j] === 2 && underground[i][j + 1] === 2 && underground[i + 1][j + 1] === 2 && underground[i][j + 2] !== 2) {
          }
          */
          
          if (underground[i][j] === 1 && underground[i][j + 1] === 1 && underground[i + 1][j + 1] === 1 && underground[i][j + 2] === 1) {
   
            canvasContext.drawImage(fallowImage[1], j * 54 + 4, i * 72 + 8 + offset, 171, 132);
            
          }
          
          if (underground[i][j] === 2 && underground[i][j + 1] === 2 && underground[i + 1][j + 1] === 2 && underground[i][j + 2] === 2) {
   
            canvasContext.drawImage(fallowImage[2], j * 54 + 4, i * 72 + 8 + offset, 171, 132);
            
          }
          
        }
        
      }
      
      // draw hexagons
      
      for (i = 0; i < underground.length; i += 1) {
    
        for (j = 0; j < underground[i].length; j += 1) {
        
          offset = j % 2 === 0 ? 36 : 0;
          
          canvasContext.drawImage(hexagonImage, j * 54, i * 72 + offset, 74, 73);
          
        }
        
      }
      
      // canvas lines solutions is too blurry
      /*
      canvasContext.strokeStyle = 'rgba(80, 93, 37, 1)';
      canvasContext.lineWidth = 1;
      
      canvasContext.translate(0.5, 0.5);
      
      for (i = 0; i < underground.length; i += 1) {
    
        for (j = 0; j < underground[i].length; j += 1) {
        
          offset = j % 2 === 0 ? 36 : 0;
          
          x = j * 54;
          
          y = i * 72;
          
          canvasContext.beginPath();
          canvasContext.moveTo(x, y + 36 + offset);
          canvasContext.lineTo(x + 18, y + offset);
          canvasContext.lineTo(x + 18 + 36, y + offset);
          canvasContext.lineTo(x + 18 + 36 + 19, y + 36 + offset);
          canvasContext.lineTo(x + 18 + 36, y + 36 + 36 + offset);
          canvasContext.lineTo(x + 18, y + 36 + 36 + offset);
          canvasContext.closePath();
          
          canvasContext.stroke();

        }
        
      }
      */
      
    },
    
    renderObjects: function() {
    
      var i, j, offset, offsetX, offsetY, lakeSmallImage, lakeBigImage, treeElement, hillElement;

      // load images
      
      lakeSmallImage = new Image();
      
      lakeSmallImage.src = 'img/gamepad/lake-small.png';

      lakeBigImage = new Image();
      
      lakeBigImage.src = 'img/gamepad/lake-big.png';
      
      // small and big lakes
    
      for (i = 0; i < surface.length; i += 1) {
    
        for (j = 0; j < surface[i].length; j += 1) {
    
          if (!(surface[i][j] === 1 && surface[i][j - 1] === 1 && surface[i + 1][j] === 1) && !(surface[i][j] === 1 && surface[i - 1][j - 1] === 1 && surface[i - 1][j] === 1)) {
   
            if (surface[i][j] === 1 && surface[i][j + 1] === 1 && surface[i + 1][j + 1] === 1 && !(surface[i][j] === 1 && surface[i][j - 1] === 1 && surface[i + 1][j] === 1) && !(surface[i][j] === 1 && surface[i - 1][j - 1] === 1 && surface[i - 1][j] === 1)) {
    
              // draw big lake
              
              offset = j % 2 === 1 ? 36 : 0;
        
              canvasContext.drawImage(lakeBigImage, j * 54 + 4, i * 72 + 8 + offset, 122, 134);
            
            } else {
          
              if (surface[i][j] === 1) {
              
                // draw small lake
                
                offset = j % 2 === 0 ? 36 : 0;
          
                canvasContext.drawImage(lakeSmallImage, j * 54 + 15, i * 72 + 14 + offset, 45, 44);
              
              }
                  
            }
          
          }
          
        }
        
      }
      
      // small and big trees
      
      for (i = 0; i < surface.length; i += 1) {
    
        for (j = 0; j < surface[i].length; j += 1) {
    
          if (surface[i][j] === 2) {

            treeElement = $('.trees').first().clone().appendTo('#gamepad');
            
            if (props[i][j] === 1) {
            
              treeElement.addClass('one');
              
              offsetX = 10;
              offsetY = j % 2 === 0 ? 36 : 0;
          
            }
            
            if (props[i][j] === 2) {
            
              treeElement.addClass('many');
              
              offsetX = 0;
              offsetY = j % 2 === 0 ? 20 : -16;
          
            }
            
            // prevent trees from beeing draged while moving the gamepad
            
            treeElement.mousedown(ONLINGA.Gamepad.preventEventDefault);

            treeElement.attr('id', 'tree-tile-' + i + '-' + j).css({
            
              left: j * 54 + offsetX,
              
              top: i * 72 + 10 + offsetY,
              
              display: 'block'
              
            });
            
            if (ONLINGA.Gamepad.getMilitaryAtPosition(i, j) !== 0) {
            
              treeElement.addClass('transparent');
            
            }
          
          }

        }
        
      }
      
      // hills
    
      for (i = 0; i < surface.length; i += 1) {
    
        for (j = 0; j < surface[i].length; j += 1) {
    
          if (surface[i][j] === 3) {

            hillElement = $('.hills').first().clone().appendTo('#gamepad');
            
            hillElement.addClass('version-' + props[i][j]);
              
            offsetY = j % 2 === 0 ? 36 : 0;

            // prevent hills from beeing draged while moving the gamepad
            
            hillElement.mousedown(ONLINGA.Gamepad.preventEventDefault);

            hillElement.attr('id', 'hill-tile-' + i + '-' + j).css({
            
              left: j * 54,
              
              top: i * 72 + offsetY,
              
              display: 'block'
              
            });
          
          }

        }
        
      }
      
    },
    
    renderMilitary: function() {
    
      var i;
    
      for (i = 0; i < military.length; i += 1) {
    
        // add index
        
        military[i].index = i;
    
        ONLINGA.Gamepad.renderSingleArmy(i);
        
      }
    
    },

    renderSingleArmy: function(index) {
    
      var militaryElement, offsetY, i, currentHealth, healthElement;
    
      // remove existing dom elements
      
      $('#military-tile-' + index).remove();
      
      // create new dom elements
    
      militaryElement = $('.military').first().clone().appendTo('#gamepad');
      
      militaryElement.addClass('military');
      
      militaryElement.addClass(military[index].type + '-' + military[index].player + '-' + military[index].units.length);
      
      offsetY = military[index].position.x % 2 === 0 ? 36 : 0;

      // prevent military element from beeing draged while moving the gamepad
      
      militaryElement.mousedown(ONLINGA.Gamepad.preventEventDefault);

      militaryElement.attr('id', 'military-tile-' + index).css({
      
        left: military[index].position.x * 54,
        
        top: military[index].position.y * 72 + offsetY,
        
        display: 'block'
        
      });

      healthElement = $('.health').first().clone().appendTo(militaryElement);
      
      // for each unit add an unit helath element
      
      for (i = 0; i < military[index].units.length; i += 1) {
      
        currentHealth = 6 / (military[index].units[i].maxHealth / military[index].units[i].currentHealth);
      
        healthElement.attr('id', 'military-health-' + index);
      
        healthElement.append($('<span class="unit-health">')
                             .css({ boxShadow: currentHealth + 'px 0 0 0 #0f0 inset' }));
      
      }
      
    },
    
    
    preventEventDefault: function(e) {
          
      e.preventDefault();
      
    }
    
  };

}());

ONLINGA.Gamepad.init();