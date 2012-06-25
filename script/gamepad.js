if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.Unit = function() {

}

ONLINGA.Unit.prototype.type = null;

ONLINGA.Unit.prototype.attack = 1;

ONLINGA.Unit.prototype.defense = 1;

ONLINGA.Unit.prototype.damage = 1;

ONLINGA.Unit.prototype.currentHealth = 1;

ONLINGA.Unit.prototype.maxHealth = 1;

ONLINGA.Unit.prototype.remainingMoves = 1;

ONLINGA.Unit.prototype.maxMoves = 1;

ONLINGA.Unit.prototype.attackRange = 1;

ONLINGA.Unit.prototype.attackPercentageForRange = [100];

ONLINGA.Unit.prototype.getAttack = function() {

  return this.attack;

}

ONLINGA.Unit.prototype.getType = function() {

  return this.type;

}

ONLINGA.Unit.prototype.getDefense = function() {

  return this.defense;

}

ONLINGA.Unit.prototype.getDamage = function() {

  return this.damage;

}

ONLINGA.Unit.prototype.getCurrentHealth = function() {

  return this.currentHealth;

}

ONLINGA.Unit.prototype.getRemainingMoves = function() {

  return this.remainingMoves;

}

ONLINGA.Unit.prototype.getMaxMoves = function() {

  return this.maxMoves;

}

ONLINGA.Unit.prototype.getAttackRange = function() {

  return this.attackRange;

}

ONLINGA.Unit.prototype.heal = function(healingPoints) {

  // ToDo: Add testing if healingPoints is type int

  if (healingPoints + this.currentHealth >= this.maxHealth) {

    this.currentHealth = this.maxHealth;

  } else {

    this.currentHealth = this.currentHealth + healingPoints;

  }

}

ONLINGA.Unit.prototype.reduceHealth = function(damagePoints) {

  if (this.currentHealth - damagePoints <= 0) {

    // Unit is dead, units with currentHealth = 0 will be removed from ONLINGA.CombatManager.

    this.currentHealth = 0;

  } else {

    this.currentHealth = this.currentHealth - damagePoints;

  }

}

ONLINGA.Unit.prototype.isDead = function() {

	if (this.currentHealth > 0) {

    return false;

  }

  return true;

}

ONLINGA.Unit.prototype.resetCurrentMovesToMax = function() {

  this.currentMoves = this.maxMoves;

}

ONLINGA.Knight = function() {

}

ONLINGA.Knight.prototype = new ONLINGA.Unit();

ONLINGA.Knight.prototype.constructor = ONLINGA.Knight;

ONLINGA.Knight.prototype.type = "knight";

ONLINGA.Knight.prototype.attack = 4;

ONLINGA.Knight.prototype.defense = 4;

ONLINGA.Knight.prototype.damage = 2;

ONLINGA.Knight.prototype.maxHealth = 4;

ONLINGA.Knight.prototype.currentHealth = 4;

/*ONLINGA.AbstractAssault = function() {

}

// At distant assaults, the attacker can not be hurt (is that really true? archer against archer)

ONLINGA.DistanceAssault = function(attacker, defender) {

}*/

ONLINGA.CombatManager = function() {

}

ONLINGA.CombatManager.prototype.combatTurns = 5;

ONLINGA.CombatManager.prototype.processCloseAttack = function(attackingArmy, defendingArmy) {

    var totalAttackPoints = attackingArmy.units.length * attackingArmy.units[0].getAttack(),
        totalDefensePoints = defendingArmy.units.length * defendingArmy.units[0].getDefense(), //add field defense and position deduction
        totalCombatPoints = totalAttackPoints + totalDefensePoints,
        randomResult;

    for (var i = 0; i < this.combatTurns; i++) {

      randomResult = Math.ceil((Math.random() * totalCombatPoints));

      if (randomResult <= totalAttackPoints) {

        // attacker wins round.

        var damagePoints = attackingArmy.units[0].getDamage();

        this.handleCombatTurnLooser(defendingArmy, damagePoints);

      } else {

        // defender wins round.

        var damagePoints = defendingArmy.units[0].getDamage();

        this.handleCombatTurnLooser(attackingArmy, damagePoints);

      }

      if (attackingArmy.units.length === 0 || defendingArmy.units.length === 0) {

        // One army is destroyed, no need to fight any further.

        return;

      }

    }

}

ONLINGA.CombatManager.prototype.handleCombatTurnLooser = function(loosers, damagePoints) {

  looser = loosers.units[loosers.units.length-1]; // get the last unit from units array

  looser.reduceHealth(damagePoints);
  
  if (looser.isDead()) {

    loosers.units.pop(); // Remove the last unit from units array
 
    // ToDo: Give feedback to user

    if (loosers.units.length === 0) {

      // all units from the army are dead

      // ToDo: Remove loosers from ONLINGA.gamepad.military and give feedback to user

      return;

    }

    // ToDo: Change looser image to image with one unit less

  }      

}

ONLINGA.createKnights = function(amount) {

  var knights = [];

  for (var i = 0; i < amount; i++) {

    knights.push(new ONLINGA.Knight())

  }

  return knights;
  
}

ONLINGA.gamepad = (function() {

  // private variables

  var underground = [],
      surface = [],
      props = [],
      combatManager = new ONLINGA.CombatManager(),
      military = [],
      militaryPositions = [],
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
          
          quantity: 1,

          units: ONLINGA.createKnights(1),
          
          orientation: 1
          
        }, {
        
          position: { x: 5, y: 2 },
          
          player: 2,
          
          type: 'knight',
          
          quantity: 2,

          units: ONLINGA.createKnights(2),
          
          orientation: 1
          
        }, {
        
          position: { x: 6, y: 2 },
          
          player: 2,
          
          type: 'archer',
          
          quantity: 3,

          units: ONLINGA.createKnights(3),
          
          orientation: 1
          
        }, {
        
          position: { x: 8, y: 3 },
          
          player: 1,
          
          type: 'rider',
          
          quantity: 2,

          units: ONLINGA.createKnights(2),
          
          orientation: 1
          
        }, {
        
          position: { x: 4, y: 4 },
          
          player: 2,
          
          type: 'knight',
          
          quantity: 5,

          units: ONLINGA.createKnights(5),
          
          orientation: 1
          
        }, {
        
          position: { x: 1, y: 4 },
          
          player: 1,
          
          type: 'rider',
          
          units: ONLINGA.createKnights(3),

          quantity: 3,
       
          orientation: 1
          
        }, {
        
          position: { x: 4, y: 3 },
          
          player: 1,
          
          type: 'knight',
          
          quantity: 5,

          units: ONLINGA.createKnights(5),
          
          orientation: 1
          
        }
        
      ];
      
      // will be set with values afterwards
      
      militaryPositions = [
      
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                      
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                      
      ];
      
      // specials
      // ========
      
      // ? = castle building
      // ? = river
      // ? = bridge
    
      // troups were positioned dynamically
      
      // some initial vars
      
      ONLINGA.gamepad.range = false;
      
      ONLINGA.gamepad.loadImages();
    
    },
    
    loadImages: function() {
    
      var imageStack = [
        'img/tiles/lake-big.png',
        'img/tiles/lake-small.png',
        'img/tiles/meadow-1.gif',
        'img/tiles/meadow-2.gif',
        'img/tiles/meadow-3.gif',
        'img/tiles/fallow-big-1.png',
        'img/tiles/fallow-big-2.png',
        'img/tiles/fallow-medium-1.png',
        'img/tiles/hill-1.png',
        'img/tiles/hill-2.png',
        'img/tiles/hexaeder.png',
        'img/player-1/knight-1.png',
        'img/player-1/knight-2.png',
        'img/player-1/knight-3.png',
        'img/player-1/knight-4.png',
        'img/player-1/knight-5.png',
        'img/player-1/knight-6.png',
        'img/player-2/knight-1.png',
        'img/player-2/knight-2.png',
        'img/player-2/knight-3.png',
        'img/player-2/knight-4.png',
        'img/player-2/knight-5.png',
        'img/player-2/knight-6.png',
        'img/player-1/archer-1.png',
        'img/player-1/archer-2.png',
        'img/player-1/archer-3.png',
        'img/player-1/archer-4.png',
        'img/player-1/archer-5.png',
        'img/player-1/archer-6.png',
        'img/player-2/archer-1.png',
        'img/player-2/archer-2.png',
        'img/player-2/archer-3.png',
        'img/player-2/archer-4.png',
        'img/player-2/archer-5.png',
        'img/player-2/archer-6.png',
        'img/player-1/rider-1.png',
        'img/player-1/rider-2.png',
        'img/player-1/rider-3.png',
        'img/player-1/rider-4.png',
        'img/player-1/rider-5.png',
        'img/player-1/rider-6.png',
        'img/player-2/rider-1.png',
        'img/player-2/rider-2.png',
        'img/player-2/rider-3.png',
        'img/player-2/rider-4.png',
        'img/player-2/rider-5.png',
        'img/player-2/rider-6.png'
      ];
      
      ONLINGA.gamepad.loadImagesRecursive(imageStack, imageStack.length);
    
    },
    
    loadImagesRecursive: function(imageStack, numberAllImages) {
    
      var image = new Image();
      
      if (imageStack.length) {
      
        image.src = imageStack[0];
        
        image.onload = function() {
        
          // console.log(image.src.substring(image.src.lastIndexOf('/') + 1, image.src.lastIndexOf('.')));
        
          imageStack.shift();
        
          // update progress bar
          
          $('#preloader .progress .bar').css({
          
            width: (500 / numberAllImages) * (numberAllImages - imageStack.length + 1)
            
          });
        
          ONLINGA.gamepad.loadImagesRecursive(imageStack, numberAllImages);
        
        };
      
      } else {
      
        ONLINGA.gamepad.renderSurface();
                            
        ONLINGA.gamepad.initEvents();

        return true;
        
      }
    
    },
    
    renderSurface: function() {
    
      // for performance reasons remove preloader from dom
      
      $('#preloader').remove();
      
      $('#gamepad').removeClass('hidden');
    
      // for performance reasons grass and stones were rendered as canvas

      ONLINGA.gamepad.renderBackground();
    
      ONLINGA.gamepad.renderMilitary();

      ONLINGA.gamepad.renderObjects();

    },
    
    initEvents: function() {
    
      $('#wrapper').click(function(e) {
        
        ONLINGA.gamepad.processClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        
      });
    
    },
    
    processClick: function(x, y) {
    console.log(x);
    console.log(y);
      // get target hexaeder
      
      var i, j, offset;
      
      for (i = 0; i < underground.length; i += 1) {
    
        for (j = 0; j < underground[i].length; j += 1) {
        
          offset = j % 2 === 0 ? 36 : 0;
          
          if (x > j * 54 + 5 &&
              x < j * 54 + 73 - 5 &&
              y > i * 72 + offset &&
              y < i * 72 + offset + 73) {
            
            ONLINGA.gamepad.processClickAtTile(j, i);
            
            break;
            
          }
          
        }
        
      }
      
    },
    
    processClickAtTile: function(x, y) {

      var offsetY, i, j, validTarget, validClick, possibleEnemy, surfaceData;
    
      // the main logic can be found here
    
      // check the mode of selection (selected / not selected)
      
      if (ONLINGA.gamepad.validTargets) {
    
        // yes, currently something is selected
    
        if (ONLINGA.gamepad.selectedMilitary && ONLINGA.gamepad.selectedMilitary.position.x === x && ONLINGA.gamepad.selectedMilitary.position.y === y) {
      
          // if the active military group is clicked, undo selection completely
      
          ONLINGA.gamepad.deselectAll();
          
        } else {

          // if an other tile is clicked...
          
          // check if it is a valid target for the military
        
          validClick = false;
        
          validTarget = false;
        
          for (i = 0; i < ONLINGA.gamepad.validTargets.length; i += 1) {
          
            // at the beginning of a new range validTargets[i] is undefined
          
            if (ONLINGA.gamepad.validTargets[i]) {
          
              for (j = 0; j < ONLINGA.gamepad.validTargets[i].length; j += 1) {
              
                if (ONLINGA.gamepad.validTargets[i][j].x === x && ONLINGA.gamepad.validTargets[i][j].y === y) {
                
                  validClick = true;
                
                  // you can only move with a distance of 1
                
                  if (i === 1) {
                  
                    validTarget = ONLINGA.gamepad.validTargets[i][j];
                    
                    ONLINGA.gamepad.range = ONLINGA.gamepad.validTargets.length - i - 1;
                    
                  }
                  
                  break;
                
                }
                
              }
              
            }
          
          }
          
          if (validTarget) {
          
            // calculate target action
            
            // check for attacking enemy
            
            possibleEnemy = ONLINGA.gamepad.getMilitaryAtPosition(x, y);
            
            surfaceData = ONLINGA.gamepad.getSurfaceDataAtPosition(x, y);
            
            if (possibleEnemy && possibleEnemy.player === 2) {
            
              // attack     

              combatManager.processCloseAttack(ONLINGA.gamepad.selectedMilitary, possibleEnemy);

              ONLINGA.gamepad.showAttackHits(1);
            
            } else {
            
              // deal with surface data later
              
              ONLINGA.gamepad.moveMilitaryToPosition(x, y);
            
            }
      
          } else {
          
            if (!validClick) {
            
              // no valid target/click (click outside of range)
            
              ONLINGA.gamepad.deselectAll();
              
            }
          
          }
        
        }
        
      } else {
      
        // there is nothing selected
    
        // check if there is own military at clicked tile
        
        ONLINGA.gamepad.selectedMilitary = ONLINGA.gamepad.getMilitaryAtPosition(x, y);
        
        if (ONLINGA.gamepad.selectedMilitary && ONLINGA.gamepad.selectedMilitary.player === 1) {
      
          // yes, there is own military
          
          // highlight military and valid targets
      
          if (!ONLINGA.gamepad.militaryHighlightElement) {
        
            ONLINGA.gamepad.militaryHighlightElement = $('.highlight').first().clone().appendTo('#gamepad');

            ONLINGA.gamepad.militaryHighlightElement.addClass('pulse');
            
          }
          
          offsetY = x % 2 === 0 ? 36 : 0;
          
          $(ONLINGA.gamepad.militaryHighlightElement).css({
          
            left: x * 54 + 1,
            
            top: y * 72 + offsetY + 1,
            
            display: 'block'
            
          });
          
          ONLINGA.gamepad.highlightTargetHexaeders(ONLINGA.gamepad.range);
          
        }
            
      }
      
    },
    
    deselectAll: function() {
    
      // deselect targets
      
      ONLINGA.gamepad.removeExistingTargetHighlightings();
    
      // deselect military
      
      ONLINGA.gamepad.deselectMilitary();
    
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
      
      xOrientation = x - ONLINGA.gamepad.selectedMilitary.position.x;
      
      yOrientation = y - ONLINGA.gamepad.selectedMilitary.position.y - (x % 2);
      
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
        
        militaryElement = $('#military-tile-' + ONLINGA.gamepad.selectedMilitary.index);
        
        militaryBackground = militaryElement.css('background-image');

        regExpPattern = new RegExp(ONLINGA.gamepad.selectedMilitary.type + '-' + ONLINGA.gamepad.selectedMilitary.orientation, 'gi');
        
        militaryBackground = militaryBackground.replace(regExpPattern, ONLINGA.gamepad.selectedMilitary.type + '-' + orientation);
      
        militaryElement.css({
          
          'background-image': militaryBackground
          
        });
      
        // set new orientation after that
        
        ONLINGA.gamepad.selectedMilitary.orientation = orientation;
        
      }
      
    },
    
    setMilitaryPosition: function(x, y) {
    
      var militaryElement, offsetY;
    
      ONLINGA.gamepad.selectedMilitary.position.x = x;
      
      ONLINGA.gamepad.selectedMilitary.position.y = y;
      
      militaryElement = $('#military-tile-' + ONLINGA.gamepad.selectedMilitary.index);
    
      offsetY = ONLINGA.gamepad.selectedMilitary.position.x % 2 === 0 ? 36 : 0;

      militaryElement.css({
      
        left: ONLINGA.gamepad.selectedMilitary.position.x * 54,
        
        top: ONLINGA.gamepad.selectedMilitary.position.y * 72 + offsetY,
        
        display: 'block'
        
      });
    
    },
    
    moveMilitaryToPosition: function(x, y) {
    
      var treeElement;
    
      if (ONLINGA.gamepad.selectedMilitary) {
      
        treeElement = ONLINGA.gamepad.getTreeElementAtPosition(ONLINGA.gamepad.selectedMilitary.position.x, ONLINGA.gamepad.selectedMilitary.position.y);
        
        if (treeElement) {
        
          treeElement.removeClass('transparent');
        
        }
      
        treeElement = ONLINGA.gamepad.getTreeElementAtPosition(x, y);
        
        if (treeElement) {
        
          treeElement.addClass('transparent');
        
          // if this is the case, show a hint "defence bonus"
          
          ONLINGA.gamepad.showHintAtPosition('DEFENCE BONUS', x, y);
          
        }
      
        ONLINGA.gamepad.setMilitaryOrientation(x, y);
      
        ONLINGA.gamepad.setMilitaryPosition(x, y);
      
        // still moves left?
        
        if (ONLINGA.gamepad.range !== 0) {
        
          ONLINGA.gamepad.highlightTargetHexaeders(ONLINGA.gamepad.range);
        
        } else {
        
          ONLINGA.gamepad.range = false;
        
          ONLINGA.gamepad.deselectAll();
          
          // end of moves reached
          
          // switch player ...
          
        }
      
      }
      
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
                .animate( { marginTop: '-=6px', opacity: 0 }, 500, function() {
                $('#hint').css({ marginTop: '0', display: 'none' });
      });
          
    },
    
    highlightTargetHexaeders: function(range) {
    
      if (range === false) {
    
        // calculate range by type of military
        
        if (ONLINGA.gamepad.selectedMilitary) {
        
          if (ONLINGA.gamepad.selectedMilitary.type === 'knight') {
          
            range = 1;
          
          } else if (ONLINGA.gamepad.selectedMilitary.type === 'archer') {
        
            range = 2;
          
          } else if (ONLINGA.gamepad.selectedMilitary.type === 'rider') {
          
            range = 3;
          
          }
          
          // remove existing highlightings
          
          ONLINGA.gamepad.removeExistingTargetHighlightings();
          
          // highlight targets in range
          
          ONLINGA.gamepad.highlightTargetsInRange(range);
         
        }
        
      } else {
      
        // remove existing highlightings
        
        ONLINGA.gamepad.removeExistingTargetHighlightings();
        
        // highlight targets in range
        
        ONLINGA.gamepad.highlightTargetsInRange(range);
       
      }
    
    },
    
    removeExistingTargetHighlightings: function() {
    
      var existingHighlightings, i;
      
      existingHighlightings = $('#gamepad .highlight.target');
    
      for (i = 0; i < existingHighlightings.length; i += 1) {
      
        $(existingHighlightings[i]).remove();
      
      }
      
      delete ONLINGA.gamepad.validTargets;
    
    },
    
    deselectMilitary: function() {

      if (ONLINGA.gamepad.militaryHighlightElement) {
    
        $(ONLINGA.gamepad.militaryHighlightElement).css({
          
          display: 'none'
          
        });
        
      }
      
      ONLINGA.gamepad.selectedMilitary = false;
      
    },
    
    highlightTargetsInRangeSub: function(range) {
    
      var i, x, y;
    
      ONLINGA.gamepad.validTargets[range] = [];
      
      for (i = 0; i < ONLINGA.gamepad.validTargets[range - 1].length; i += 1) {
    
        x = ONLINGA.gamepad.validTargets[range - 1][i].x;
    
        y = ONLINGA.gamepad.validTargets[range - 1][i].y;
    
        ONLINGA.gamepad.highlightTargetHexaeder(x - 1, y - x % 2, range);
      
        ONLINGA.gamepad.highlightTargetHexaeder(x, y - 1, range);
      
        ONLINGA.gamepad.highlightTargetHexaeder(x + 1, y - x % 2, range);
      
        ONLINGA.gamepad.highlightTargetHexaeder(x - 1, y + (1 - x % 2), range);
      
        ONLINGA.gamepad.highlightTargetHexaeder(x + 1, y + (1 - x % 2), range);
      
        ONLINGA.gamepad.highlightTargetHexaeder(x, y + 1, range);
    
      }
    
    },
    
    highlightTargetsInRange: function(range) {
    
      var x, y, i;
      
      x = ONLINGA.gamepad.selectedMilitary.position.x;
    
      y = ONLINGA.gamepad.selectedMilitary.position.y;
    
      // highlight range 1 in every case
      
      ONLINGA.gamepad.validTargets = [];
      
      ONLINGA.gamepad.validTargets[1] = [];
      
      ONLINGA.gamepad.highlightTargetHexaeder(x - 1, y - x % 2, 1);
    
      ONLINGA.gamepad.highlightTargetHexaeder(x, y - 1, 1);
    
      ONLINGA.gamepad.highlightTargetHexaeder(x + 1, y - x % 2, 1);
    
      ONLINGA.gamepad.highlightTargetHexaeder(x - 1, y + (1 - x % 2), 1);
    
      ONLINGA.gamepad.highlightTargetHexaeder(x + 1, y + (1 - x % 2), 1);
    
      ONLINGA.gamepad.highlightTargetHexaeder(x, y + 1, 1);
    
      if (range > 1) {
    
        for (i = 2; i <= range; i += 1) {
        
          ONLINGA.gamepad.highlightTargetsInRangeSub(i);
        
        }
        
      }
    
    },
    
    isAlreadyValidTarget: function(x, y, range) {
    
      var i, j;
    
      // targets with range = 1 are always new
    
      if (range > 1) {
      
        for (i = 0; i <= range; i += 1) {
        
          // at the beginning of a new range validTargets[i] is undefined
        
          if (ONLINGA.gamepad.validTargets[i]) {
        
            for (j = 0; j < ONLINGA.gamepad.validTargets[i].length; j += 1) {
            
              if (ONLINGA.gamepad.validTargets[i][j].x === x && ONLINGA.gamepad.validTargets[i][j].y === y) {
              
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

      highlightElement = $('.highlight').first().clone().appendTo('#gamepad');

      highlightElement.addClass('target');
      
      // check if hexaeder is valid target (no lake/canyon)
      
      if (typeof surface[y] !== 'undefined' && typeof surface[y][x] !== 'undefined' && surface[y][x] !== 1 && surface[y][x] !== 4) {
      
        // check if there is an own military target
        // if not, highlight the hexaeder

        if (!ONLINGA.gamepad.isAlreadyValidTarget(x, y, range)) {
        
          militaryTarget = ONLINGA.gamepad.getMilitaryAtPosition(x, y);
          
          if (!militaryTarget || militaryTarget.player === 2) {
          
            offsetY = x % 2 === 0 ? 36 : 0;
            
            $(highlightElement).css({
            
              left: x * 54 + 1,
              
              top: y * 72 + offsetY + 1,
                    
              display: 'block'
              
            });
            
            ONLINGA.gamepad.validTargets[range].push({
            
              x: x,
              
              y: y
              
            });
            
          }
          
          // if it is an enemy military, highlight hexaeder red
          
          if (militaryTarget && militaryTarget.player === 2) {
          
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
      
        if (military[i].position.x === x && military[i].position.y === y) {
        
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
          
      meadowImage[0].src = 'img/tiles/meadow-1.gif';

      meadowImage[1] = new Image();
          
      meadowImage[1].src = 'img/tiles/meadow-2.gif';

      meadowImage[2] = new Image();
          
      meadowImage[2].src = 'img/tiles/meadow-3.gif';

      hexagonImage = new Image();

      hexagonImage.src = 'img/tiles/hexaeder.png';

      fallowImage[0] = new Image();

      fallowImage[0].src = 'img/tiles/fallow-medium-1.png';
      
      fallowImage[1] = new Image();
      
      fallowImage[1].src = 'img/tiles/fallow-big-1.png';
      
      fallowImage[2] = new Image();
      
      fallowImage[2].src = 'img/tiles/fallow-big-2.png';
        
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
      
      lakeSmallImage.src = 'img/tiles/lake-small.png';

      lakeBigImage = new Image();
      
      lakeBigImage.src = 'img/tiles/lake-big.png';
      
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
            
            treeElement.mousedown(ONLINGA.gamepad.preventEventDefault);

            treeElement.attr('id', 'tree-tile-' + i + '-' + j).css({
            
              left: j * 54 + offsetX,
              
              top: i * 72 + 10 + offsetY,
              
              display: 'block'
              
            });
            
            if (militaryPositions[i][j] !== 0) {
            
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
            
            hillElement.mousedown(ONLINGA.gamepad.preventEventDefault);

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
    
      var i, militaryElement, offsetY;
    
      for (i = 0; i < military.length; i += 1) {
    
        // add index
        
        military[i].index = i;
    
        militaryElement = $('.military').first().clone().appendTo('#gamepad');
        
        militaryElement.addClass('military');
        militaryElement.addClass(military[i].type + '-' + military[i].player + '-' + military[i].quantity);
        
        offsetY = military[i].position.x % 2 === 0 ? 36 : 0;

        militaryPositions[military[i].position.y][military[i].position.x] = 1;
        
        // prevent military element from beeing draged while moving the gamepad
        
        militaryElement.mousedown(ONLINGA.gamepad.preventEventDefault);

        militaryElement.attr('id', 'military-tile-' + i).css({
        
          left: military[i].position.x * 54,
          
          top: military[i].position.y * 72 + offsetY,
          
          display: 'block'
          
        });
        
      }
    
    },

    preventEventDefault: function(e) {
          
      e.preventDefault();
      
    }
    
  };

}());
