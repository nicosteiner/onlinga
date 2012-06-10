if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.globalTick = (function() {

  // private variables

  var moveActiveTroups = false;
  
  // google code
  
  var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
       window.webkitRequestAnimationFrame ||
       window.mozRequestAnimationFrame ||
       window.oRequestAnimationFrame ||
       window.msRequestAnimationFrame ||
       function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
         window.setTimeout(callback, 1000/60);
       };
  })();

  // public methods
  
  return {

    init: function() {
    
      ONLINGA.globalTick.update();
    
    },
    
    update: function() {
    
      // handle all commands
      /*
      if (ONLINGA.global.commandMoveTroups) {
      
        ONLINGA.troups.move(ONLINGA.global.commandMoveTroups);
      
      }
      
      if (ONLINGA.global.commandMoveGamepad) {
      
        ONLINGA.gamepad.move(ONLINGA.global.commandMoveGamepad);
      
      }
      
      if (ONLINGA.global.commandPositionGamepad !== false) {
      
        ONLINGA.gamepad.positionGamepad(ONLINGA.global.commandPositionGamepad);
      
      }
    
      if (ONLINGA.global.commandToggleOpacity.length !== 0) {
      
        ONLINGA.utils.toggleOpacity(ONLINGA.global.commandToggleOpacity);
      
      }
      */
      requestAnimFrame(ONLINGA.globalTick.update);
    
    }
    
  }

})();