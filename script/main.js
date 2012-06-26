if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.Main = (function() {

  // private variables

  // var a = 'bla';

  // public methods
  
  return {

    init: function() {
    
      $(window).resize(function() {
        
        ONLINGA.Main.updateWrapper();
        
      });
      
      ONLINGA.Main.updateWrapper();
    
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
    
      ONLINGA.Main.wrapperWidth = $('#wrapper').width();
      
      ONLINGA.Main.wrapperHeight = $('#wrapper').height();
      
      ONLINGA.Main.wrapperOffset = $('#wrapper').offset();

    }
    
  }

}());

ONLINGA.Main.init();