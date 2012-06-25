if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.main = (function() {

  // private variables

  // var a = 'bla';

  // public methods
  
  return {

    init: function() {
    
      ONLINGA.gamepad.init();
      
      $(window).resize(function() {
        
        ONLINGA.main.updateWrapper();
        
      });
      
      ONLINGA.main.updateWrapper();
    
    },

    updateWrapper: function() {
    
      var documentWidth = $(window).width(),
    
          documentHeight = $(window).height(),
    
          maxWidth = 560,
          
          maxHeight = 470;
    
      if (documentWidth > maxWidth) {
      
        $('#wrapper').css({
        
          width: maxWidth + 'px',
          
          left: ((documentWidth - maxWidth) / 2) + 'px'
          
        });
        
      } else {
      
        $('#wrapper').css({
        
          width: documentWidth + 'px',
        
          left: '0'
          
        });
      
      }  
      
      if (documentHeight > maxHeight) {
      
        $('#wrapper').css({
        
          height: maxHeight + 'px',
          
          top: ((documentHeight - maxHeight) / 2) + 'px'
          
        });
        
      } else {
      
        $('#wrapper').css({
        
          height: documentHeight + 'px',
        
          top: '0'
          
        });
      
      }
    
      ONLINGA.main.wrapperWidth = $('#wrapper').width();
      
      ONLINGA.main.wrapperHeight = $('#wrapper').height();
      
      ONLINGA.main.wrapperOffset = $('#wrapper').offset();

    }
    
  }

})();

ONLINGA.main.init();