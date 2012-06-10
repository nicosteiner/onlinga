if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.main = (function() {

  // private variables

  // var a = 'bla';

  // public methods
  
  return {

    init: function() {
    
      ONLINGA.gamepad.init();
      
      /*
    
      $(window).resize(function() {
        
        ONLINGA.main.updateWrapper();
        
      });
      
      ONLINGA.main.updateWrapper();
      
      ONLINGA.main.initButtons();
    
      ONLINGA.main.initMouseListener();
      
      ONLINGA.globalTick.init();
      
      ONLINGA.gamepad.init();
      
      ONLINGA.troups.init();
    
      ONLINGA.gamepad.centerGamepad();
      
      */
      
    }
    
    /*
    
    initMouseListener: function() {
    
      $('#wrapper').mousedown(function(e) {
      
        ONLINGA.global.mouseDownPosition = {
          
          pageX: e.pageX - ONLINGA.global.wrapperOffset.left,
          
          pageY: e.pageY - ONLINGA.global.wrapperOffset.top
          
        }
        
        ONLINGA.global.mouseLastPosition = {
          
          pageX: e.pageX - ONLINGA.global.wrapperOffset.left,
          
          pageY: e.pageY - ONLINGA.global.wrapperOffset.top
          
        }
    
        ONLINGA.global.leftMouseClick = true;
    
      });
    
      $('#wrapper').mouseup(function(e) {
      
        ONLINGA.global.mouseUpPosition = {
        
          pageX: e.pageX - ONLINGA.global.wrapperOffset.left,
          
          pageY: e.pageY - ONLINGA.global.wrapperOffset.top
          
        }
        
        if (ONLINGA.global.mouseDownPosition.pageX === ONLINGA.global.mouseUpPosition.pageX &&
            ONLINGA.global.mouseDownPosition.pageY === ONLINGA.global.mouseUpPosition.pageY) {
        
          // interprete this as a click
        
        } else {
        
          // in this case gamepad was moved
        
        }
    
        ONLINGA.global.leftMouseClick = false;
    
      });
    
      $('#wrapper').mousemove(function(e) {
      
        var gamepadLeft, gamepadTop;
      
        var moveGamepadLeft, moveGamepadTop;

        var surfacePositionvar, troupAtSurfacePosition, troupData;
      
        if (ONLINGA.global.leftMouseClick === true) {
          
          gamepadLeft = parseInt($('#gamepad').css('left').replace('px', ''));
        
          gamepadTop = parseInt($('#gamepad').css('top').replace('px', ''));
        
          moveGamepadLeft = e.pageX - ONLINGA.global.wrapperOffset.left - ONLINGA.global.mouseLastPosition.pageX;
          
          moveGamepadTop = e.pageY - ONLINGA.global.wrapperOffset.top - ONLINGA.global.mouseLastPosition.pageY;

          ONLINGA.global.mouseLastPosition = {
          
            pageX: e.pageX - ONLINGA.global.wrapperOffset.left,
            
            pageY: e.pageY - ONLINGA.global.wrapperOffset.top
          
          }
          
          gamepadLeft = gamepadLeft + moveGamepadLeft;
          
          gamepadTop = gamepadTop + moveGamepadTop;
          
          if (gamepadLeft > 0) {
          
            gamepadLeft = 0;
            
          } else {

            if (gamepadLeft < -1 * (ONLINGA.global.battleFieldWidth * ONLINGA.global.battleFieldRaster) + ONLINGA.global.wrapperWidth) {
            
              gamepadLeft = -1 * (ONLINGA.global.battleFieldWidth * ONLINGA.global.battleFieldRaster) + ONLINGA.global.wrapperWidth;
              
            }
          
          }
        
          if (gamepadTop > 0) {
          
            gamepadTop = 0;
            
          } else {
          
            if (gamepadTop < -1 * (ONLINGA.global.battleFieldHeight * ONLINGA.global.battleFieldRaster) + ONLINGA.global.wrapperHeight) {
            
              gamepadTop = -1 * (ONLINGA.global.battleFieldHeight * ONLINGA.global.battleFieldRaster) + ONLINGA.global.wrapperHeight;
              
            }
          
          }
        
          // triggers positioning in global tick context
        
          ONLINGA.global.commandPositionGamepad = {
          
            left: gamepadLeft,
            
            top: gamepadTop
            
          };
        
        } else {
        
          surfacePosition = ONLINGA.gamepad.getSurfacePosition(e.pageX, e.pageY);
          
          troupAtSurfacePosition = ONLINGA.troups.getTroupAtSurfacePosition(surfacePosition.x, surfacePosition.y);
          
          if (troupAtSurfacePosition) {
          
            troupData = ONLINGA.troups.getTroupData(troupAtSurfacePosition);
          
            $('#troup-info .headline').addClass('hidden');
            
            $('#troup-info #' + troupData.type).removeClass('hidden');
          
            $('#troup-info-count').text(troupData.count);
          
            $('#troup-info-state').text(troupData.state);
          
            $('#troup-info').css({
            
              display: 'block',
              
              left: troupData.position[0] + ONLINGA.global.battleFieldRaster - 10 + 'px',
              
              top: troupData.position[1] - ONLINGA.global.battleFieldRaster - 10 + 'px'
              
            });
            
          } else {
          
            $('#troup-info').css({
              
              display: 'none'
              
            });
          
          }
          
        }
        
      });
      
      $(document.body).mouseup(function(e) {
      
        if (e.target === document.body) {
        
          // mouse pointer is outside of gamepad
          
          ONLINGA.global.leftMouseClick = false;
        
        }
      
      });
      
    },
    
    updateWrapper: function() {
    
      var documentWidth = $(window).width();
    
      var documentHeight = $(window).height();
    
      if (documentWidth > 1280) {
      
        $('#wrapper').css({
        
          width: '1280px',
          
          left: ((documentWidth - 1280) / 2) + 'px'
          
        });
        
      } else {
      
        $('#wrapper').css({
        
          width: documentWidth + 'px',
        
          left: '0'
          
        });
      
      }  
      
      if (documentHeight > 900) {
      
        $('#wrapper').css({
        
          height: '900px',
          
          top: ((documentHeight - 900) / 2) + 'px'
          
        });
        
      } else {
      
        $('#wrapper').css({
        
          height: documentHeight + 'px',
        
          top: '0'
          
        });
      
      }
    
      ONLINGA.global.wrapperWidth = $('#wrapper').width();
      
      ONLINGA.global.wrapperHeight = $('#wrapper').height();
      
      ONLINGA.global.wrapperOffset = $('#wrapper').offset();

    },
    
    initButtons: function() {
    
      $('#move-left').click(function() {
  
        if (ONLINGA.global.commandMoveTroups === false) {
  
          var activeTroupSurfacePosition = ONLINGA.troups.getActiveTroupSurfacePosition();
          
          var surfaceTargetProperty = ONLINGA.gamepad.getSurfaceProperty(activeTroupSurfacePosition[0] - 1, activeTroupSurfacePosition[1]);
  
          // if there are no stones
        
          if (surfaceTargetProperty !== false && surfaceTargetProperty !== 1) {
        
            ONLINGA.gamepad.hideActiveTroupMarker();

            ONLINGA.global.commandMoveTroups = 'left';
            
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1], false);
            
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0] - 1, activeTroupSurfacePosition[1], true);
            
            ONLINGA.troups.setActiveTroupSurfacePosition(activeTroupSurfacePosition[0] - 1, activeTroupSurfacePosition[1]);
            
          } else {
          
            // play "way blocked" sound
          
          }
          
        }
  
      });
      
      $('#move-right').click(function() {

        if (ONLINGA.global.commandMoveTroups === false) {
    
          var activeTroupSurfacePosition = ONLINGA.troups.getActiveTroupSurfacePosition();
          
          var surfaceTargetProperty = ONLINGA.gamepad.getSurfaceProperty(activeTroupSurfacePosition[0] + 1, activeTroupSurfacePosition[1]);
  
          // if there are no stones
        
          if (surfaceTargetProperty !== false && surfaceTargetProperty !== 1) {
        
            ONLINGA.gamepad.hideActiveTroupMarker();
    
            ONLINGA.global.commandMoveTroups = 'right';
          
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1], false);
            
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0] + 1, activeTroupSurfacePosition[1], true);
            
            ONLINGA.troups.setActiveTroupSurfacePosition(activeTroupSurfacePosition[0] + 1, activeTroupSurfacePosition[1]);
            
          } else {
          
            // play "way blocked" sound
          
          }
          
        }
  
      });
      
      $('#move-up').click(function() {
  
        if (ONLINGA.global.commandMoveTroups === false) {
  
          var activeTroupSurfacePosition = ONLINGA.troups.getActiveTroupSurfacePosition();
          
          var surfaceTargetProperty = ONLINGA.gamepad.getSurfaceProperty(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1] - 1);
  
          // if there are no stones
        
          if (surfaceTargetProperty !== false && surfaceTargetProperty !== 1) {
        
            ONLINGA.gamepad.hideActiveTroupMarker();
    
            ONLINGA.global.commandMoveTroups = 'up';
          
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1], false);
            
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1] - 1, true);
            
            ONLINGA.troups.setActiveTroupSurfacePosition(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1] - 1);
            
          } else {
          
            // play "way blocked" sound
          
          }
          
        }
  
      });
      
      $('#move-down').click(function() {
  
        if (ONLINGA.global.commandMoveTroups === false) {
  
          var activeTroupSurfacePosition = ONLINGA.troups.getActiveTroupSurfacePosition();
          
          var surfaceTargetProperty = ONLINGA.gamepad.getSurfaceProperty(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1] + 1);
  
          // if there are no stones
        
          if (surfaceTargetProperty !== false && surfaceTargetProperty !== 1) {
        
            ONLINGA.gamepad.hideActiveTroupMarker();
    
            ONLINGA.global.commandMoveTroups = 'down';
          
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1], false);
            
            ONLINGA.gamepad.changeTreeTileOpacity(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1] + 1, true);
            
            ONLINGA.troups.setActiveTroupSurfacePosition(activeTroupSurfacePosition[0], activeTroupSurfacePosition[1] + 1);
            
          } else {
          
            // play "way blocked" sound
          
          }
          
        }
  
      });
      
    }
    */
    
  }

})();

ONLINGA.main.init();