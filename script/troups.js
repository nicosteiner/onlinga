if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.troups = (function() {

  // private variables

  var moveSteps = 0;
  
  var troupData = new Object();
  
  var activeTroup = false;
  
  var movesLeft = null;

  // public methods
  
  return {

    init: function() {
    
      // create own troups
      
      // surface position starting at [0, 0]
      
      ONLINGA.troups.createTroupCharacters({
        name: 'own-1',
        type: 'own',
        state: 'motiviert',
        count: 12,
        surfacePosition: [1, 8]
      });
    
      ONLINGA.troups.createTroupCharacters({
        name: 'own-2',
        type: 'own',
        state: 'motiviert',
        count: 12,
        surfacePosition: [3, 8]
      });
    
      ONLINGA.troups.createTroupCharacters({
        name: 'own-3',
        type: 'own',
        state: 'motiviert',
        count: 12,
        surfacePosition: [5, 8]
      });
    
      // create enemy troups
      
      ONLINGA.troups.createTroupCharacters({
        name: 'enemy-1',
        type: 'enemy',
        state: 'motiviert',
        count: 8,
        surfacePosition: [4, 2]
      });
    
      ONLINGA.troups.createTroupCharacters({
        name: 'enemy-2',
        type: 'enemy',
        state: 'motiviert',
        count: 8,
        surfacePosition: [6, 2]
      });
    
      ONLINGA.troups.createTroupCharacters({
        name: 'enemy-3',
        type: 'enemy',
        state: 'motiviert',
        count: 8,
        surfacePosition: [8, 2]
      });
    
      ONLINGA.troups.selectActiveTroup();
    
    },
    
    getActiveTroupSurfacePosition: function() {
    
      return troupData[ONLINGA.global.activeTroup].surfacePosition;
    
    },
    
    setActiveTroupSurfacePosition: function(x, y) {
    
      troupData[ONLINGA.global.activeTroup].surfacePosition = [x, y];
    
    },
    
    getActiveTroupType: function() {
    
      return troupData[ONLINGA.global.activeTroup].type;
    
    },
    
    isTroupSurfacePosition: function(x, y) {
    
      var key;
      
      for (key in troupData) {
      
        if (troupData[key].surfacePosition[0] === x && troupData[key].surfacePosition[1] === y) {
        
          return troupData[key];
          
        }
      
      }
      
      return false;
    
    },
    
    selectActiveTroup: function() {
    
      var key, position, arraySize;
    
      var i;
    
      if (movesLeft === 0 || movesLeft === null) {
    
        if (!ONLINGA.global.activeTroup) {
        
          ONLINGA.global.activeTroup = ONLINGA.utils.getFirstKey(troupData);
        
        } else {
        
          position = 1;
          
          arraySize = ONLINGA.utils.getArraySize(troupData);
          
          for (key in troupData) {
          
            if (key === ONLINGA.global.activeTroup) {

              if (position === arraySize) {
              
                // when last element matches, go back to first
              
                ONLINGA.global.activeTroup = ONLINGA.utils.getFirstKey(troupData);
              
              } else {
              
                // when it's not last element, select the next one
              
                ONLINGA.global.activeTroup = ONLINGA.utils.getNextKey(troupData, key);
              
              }
            
              break;
              
            }
            
            position += 1;
          
          }
        
        }
        
        movesLeft = troupData[ONLINGA.global.activeTroup].moves;

        // for performance reasons store dom active character elements in array
        
        i = 0;
        
        ONLINGA.troups.activeCharacterElements = [];
        
        for (i; i < troupData[ONLINGA.global.activeTroup].character.length; i += 1) {
            
          ONLINGA.troups.activeCharacterElements.push($('#character-' + ONLINGA.global.activeTroup + '-' + i));

        }
        
      }
      
    },
    
    getActiveTroupPosition: function() {
    
      return {
      
        x: troupData[ONLINGA.global.activeTroup].position[0],
        
        y: troupData[ONLINGA.global.activeTroup].position[1]
        
      }
      
    },
    
    getTroupAtSurfacePosition: function(x, y) {
    
      var i = 0;
      
      for (key in troupData) {
      
        if (troupData[key].surfacePosition[0] === x && troupData[key].surfacePosition[1] === y) {
        
          return key;
        
        }
      
      }
      
    },
    
    getTroupData: function(troupName) {
    
      return {
      
        count: troupData[troupName].count,
        
        type: troupData[troupName].type,
        
        state: troupData[troupName].state,
        
        position: troupData[troupName].position
    
      }
    
    },
    
    createTroupCharacters: function(params) {
    
      var i;
      var x, y, characterPositions;
      
      // store data in troup array
      
      troupData[params.name] = {
      
        count: params.count,
      
        surfacePosition: params.surfacePosition,
        
        position: [params.surfacePosition[0] * ONLINGA.global.battleFieldRaster, params.surfacePosition[1] * ONLINGA.global.battleFieldRaster],
        
        type: params.type,
        
        state: params.state,
        
        moves: 2,
        
        character: []
      
      };
    
      // find for 'count' characters natural spreaded positions
    
      characterPositions = ONLINGA.utils.naturalSpreading({
      
        dimension: [ONLINGA.global.battleFieldRaster, ONLINGA.global.battleFieldRaster],
        
        count: params.count,
        
        accuracy: 1.4,
        
        raster: true
        
      });
      
      i = 0;
      
      for (i; i < params.count; i += 1) {
    
        x = troupData[params.name].position[0] + characterPositions[i][0];
        
        y = troupData[params.name].position[1] + characterPositions[i][1];
        
        // besser data attributes für character-1?
    
        $('#gamepad').append('<div id="character-' + params.name + '-' + i + '" class="character character-' + params.name.split('-')[0] + ' c-down-1"></div>');
        
        $('#character-' + params.name + '-' + i).css({
        
          left: x + 'px',
          
          top: y + 'px',
          
          zIndex: y
          
        });
        
        troupData[params.name].character.push({
        
          left: x,
          
          internalLeft: x,
          
          top: y,
          
          internalTop: y,
          
          animStep: 1
          
        });
      
      }
    
    },
    
    removeAnimClass: function(element) {
    
      element.removeClass('c-up-1');
      element.removeClass('c-up-2');
      element.removeClass('c-up-3');
      element.removeClass('c-left-1');
      element.removeClass('c-left-2');
      element.removeClass('c-left-3');
      element.removeClass('c-right-1');
      element.removeClass('c-right-2');
      element.removeClass('c-right-3');
      element.removeClass('c-down-1');
      element.removeClass('c-down-2');
      element.removeClass('c-down-3');
    
    },
    
    stopMoving: function() {
    
      ONLINGA.global.commandMoveTroups = false;
      
      moveSteps = 0;
    
      movesLeft -= 1;
    
      ONLINGA.troups.selectActiveTroup();
  
      ONLINGA.gamepad.centerGamepad();
        
    },
    
    animationFinished: function(direction) {

      if (direction === 'left' || direction === 'right') {
      
        orientation = direction === 'left' ? -1 : 1;

        // correct troup position
      
        troupData[ONLINGA.global.activeTroup].position[0] += orientation * ONLINGA.global.battleFieldRaster;
      
        // correct character left property
      
        i = 0;
      
        for (i; i < troupData[ONLINGA.global.activeTroup].character.length; i += 1) {
        
          offset = $('#character-' + ONLINGA.global.activeTroup + '-' + i).position();
        
          troupData[ONLINGA.global.activeTroup].character[i].left = offset.left;
      
        }
      
        ONLINGA.troups.stopMoving();
          
      }
  
      if (direction === 'up' || direction === 'down') {
      
        orientation = direction === 'up' ? -1 : 1;
        
        // correct troup position
      
        troupData[ONLINGA.global.activeTroup].position[1] += orientation * ONLINGA.global.battleFieldRaster;
      
        // correct character top property
      
        i = 0;
      
        for (i; i < troupData[ONLINGA.global.activeTroup].character.length; i += 1) {
        
          offset = $('#character-' + ONLINGA.global.activeTroup + '-' + i).position();
        
          troupData[ONLINGA.global.activeTroup].character[i].top = offset.top;
      
        }
      
        ONLINGA.troups.stopMoving();
            
      }
        
    },
        
    move: function(direction) {
    
      var i, offset, orientation;
      
      var activeCharacterElement;
      
      var animationTest;
      
      var animationFinished;
    
      if (ONLINGA.global.activeTroup !== false) {
    
        if (direction === 'left' || direction === 'right') {
        
          orientation = direction === 'left' ? -1 : 1;
        
          // twice the dimension
        
          if (moveSteps <= ONLINGA.global.battleFieldRaster * 2) {
          
            // reset animation finished flag
            
            animationFinished = null;
          
            i = 0;
          
            for (i; i < troupData[ONLINGA.global.activeTroup].character.length; i += 1) {
            
              activeCharacterElement = ONLINGA.troups.activeCharacterElements[i];
            
              offset = activeCharacterElement.position();
              
              // position
              
              var animationTest = false;
              
              if (direction === 'left' &&
                  offset.left < troupData[ONLINGA.global.activeTroup].position[0] + moveSteps * 2) {
              
                if (animationFinished === null) {
              
                  animationFinished = true;
                  
                }
              
                animationTest = true;
              
              }
              
              if (direction === 'right' &&
                  offset.left > troupData[ONLINGA.global.activeTroup].position[0] + ONLINGA.global.battleFieldRaster - moveSteps * 2) {
              
                if (animationFinished === null) {
              
                  animationFinished = true;
                  
                }
              
                animationTest = true;
              
              }
              
              if (animationTest &&
                  Math.abs(offset.left - troupData[ONLINGA.global.activeTroup].character[i].left) < ONLINGA.global.battleFieldRaster) {
              
                animationFinished = false;
              
                ONLINGA.troups.removeAnimClass(activeCharacterElement);
              
                // change animation class every 7th step
              
                if (offset.left % 7 === 0) {
                
                  troupData[ONLINGA.global.activeTroup].character[i].animStep += 1;
                  
                  if (troupData[ONLINGA.global.activeTroup].character[i].animStep > 3) {
                  
                    troupData[ONLINGA.global.activeTroup].character[i].animStep = 1;
                  
                  }
                  
                }

                activeCharacterElement.addClass('c-' + direction + '-' + troupData[ONLINGA.global.activeTroup].character[i].animStep);
              
                troupData[ONLINGA.global.activeTroup].character[i].internalLeft += orientation * 1.5;
              
                activeCharacterElement.css('left', parseInt(troupData[ONLINGA.global.activeTroup].character[i].internalLeft) + 'px');
                
              }
        
            }
            
            if (animationFinished !== true) {
            
              moveSteps += 1;
              
            } else {
            
              ONLINGA.troups.animationFinished(direction);
            
            }
          
          } else {

            ONLINGA.troups.animationFinished(direction);
          
          }
          
        }
        
        if (direction === 'up' || direction === 'down') {
        
          orientation = direction === 'up' ? -1 : 1;
        
          // twice the dimension
        
          if (moveSteps <= ONLINGA.global.battleFieldRaster * 2) {
          
            // reset animation finished flag
            
            animationFinished = null;
            
            i = 0;
          
            for (i; i < troupData[ONLINGA.global.activeTroup].character.length; i += 1) {
            
              activeCharacterElement = ONLINGA.troups.activeCharacterElements[i];
            
              offset = activeCharacterElement.position();
              
              // position
              
              var animationTest = false;
              
              if (direction === 'up' &&
                  offset.top < troupData[ONLINGA.global.activeTroup].position[1] + moveSteps * 2) {
              
                if (animationFinished === null) {
              
                  animationFinished = true;
                  
                }
                
                animationTest = true;
              
              }
              
              if (direction === 'down' &&
                  offset.top > troupData[ONLINGA.global.activeTroup].position[1] + ONLINGA.global.battleFieldRaster - moveSteps * 2) {
              
                if (animationFinished === null) {
              
                  animationFinished = true;
                  
                }
              
                animationTest = true;
              
              }
              
              if (animationTest &&
                  Math.abs(offset.top - troupData[ONLINGA.global.activeTroup].character[i].top) < ONLINGA.global.battleFieldRaster) {
              
                animationFinished = false;
              
                ONLINGA.troups.removeAnimClass(activeCharacterElement);
              
                // change animation class every 7th step
              
                if (offset.top % 7 === 0) {
                
                  troupData[ONLINGA.global.activeTroup].character[i].animStep += 1;
                  
                  if (troupData[ONLINGA.global.activeTroup].character[i].animStep > 3) {
                  
                    troupData[ONLINGA.global.activeTroup].character[i].animStep = 1;
                  
                  }
                  
                }

                activeCharacterElement.addClass('c-' + direction + '-' + troupData[ONLINGA.global.activeTroup].character[i].animStep);
              
                troupData[ONLINGA.global.activeTroup].character[i].internalTop += orientation * 1.5;
                
                activeCharacterElement.css({
                
                  top: troupData[ONLINGA.global.activeTroup].character[i].internalTop,
                  
                  zIndex: troupData[ONLINGA.global.activeTroup].character[i].internalTop
                  
                });
              
              }
        
            }
            
            if (animationFinished !== true) {
            
              moveSteps += 1;
              
            } else {
            
              ONLINGA.troups.animationFinished(direction);
            
            }
          
          } else {

            ONLINGA.troups.animationFinished(direction);
          
          }
          
        }
        
      }
      
    }
    
  }

})();