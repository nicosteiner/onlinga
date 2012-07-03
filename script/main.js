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
    
      ONLINGA.Main.loadImages();
    
      ONLINGA.Main.createAudioTags();
    
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

    },
    
    loadImages: function() {
    
      var imageStack = [
        'img/gamepad/lake-big.png',
        'img/gamepad/lake-small.png',
        'img/gamepad/meadow-1.gif',
        'img/gamepad/meadow-2.gif',
        'img/gamepad/meadow-3.gif',
        'img/gamepad/fallow-big-1.png',
        'img/gamepad/fallow-big-2.png',
        'img/gamepad/fallow-medium-1.png',
        'img/gamepad/hill-1.png',
        'img/gamepad/hill-2.png',
        'img/gamepad/hexaeder.png',
        'img/units/player-1/knight-1.png',
        'img/units/player-1/knight-2.png',
        'img/units/player-1/knight-3.png',
        'img/units/player-1/knight-4.png',
        'img/units/player-1/knight-5.png',
        'img/units/player-1/knight-6.png',
        'img/units/player-2/knight-1.png',
        'img/units/player-2/knight-2.png',
        'img/units/player-2/knight-3.png',
        'img/units/player-2/knight-4.png',
        'img/units/player-2/knight-5.png',
        'img/units/player-2/knight-6.png',
        'img/units/player-1/archer-1.png',
        'img/units/player-1/archer-2.png',
        'img/units/player-1/archer-3.png',
        'img/units/player-1/archer-4.png',
        'img/units/player-1/archer-5.png',
        'img/units/player-1/archer-6.png',
        'img/units/player-2/archer-1.png',
        'img/units/player-2/archer-2.png',
        'img/units/player-2/archer-3.png',
        'img/units/player-2/archer-4.png',
        'img/units/player-2/archer-5.png',
        'img/units/player-2/archer-6.png',
        'img/units/player-1/rider-1.png',
        'img/units/player-1/rider-2.png',
        'img/units/player-1/rider-3.png',
        'img/units/player-1/rider-4.png',
        'img/units/player-1/rider-5.png',
        'img/units/player-1/rider-6.png',
        'img/units/player-2/rider-1.png',
        'img/units/player-2/rider-2.png',
        'img/units/player-2/rider-3.png',
        'img/units/player-2/rider-4.png',
        'img/units/player-2/rider-5.png',
        'img/units/player-2/rider-6.png'
      ];
      
      ONLINGA.Main.loadImagesRecursive(imageStack, imageStack.length);
    
    },
    
    loadImagesRecursive: function(imageStack, numberAllImages) {
    
      var image = new Image();
      
      if (imageStack.length) {
      
        // load first image from stack
      
        image.src = imageStack[0];
        
        image.onload = function() {
        
          // console.log(image.src.substring(image.src.lastIndexOf('/') + 1, image.src.lastIndexOf('.')));
        
          // remove loaded image from stack
        
          imageStack.shift();
        
          // update progress bar
          
          $('#preloader .progress .bar').css({
          
            width: (500 / numberAllImages) * (numberAllImages - imageStack.length + 1)
            
          });
        
          // next iteration with remainding stack
        
          ONLINGA.Main.loadImagesRecursive(imageStack, numberAllImages);
        
        };
      
      } else {
      
        ONLINGA.Gamepad.renderSurface();
                            
        ONLINGA.Gamepad.initEvents();

        return true;
        
      }
    
    },
    
    createAudioTags: function() {
    
      var audioStack = [
        'sounds/swoosh.ogg',
        'sounds/skweak.ogg',  // http://opengameart.org/content/skweaks
        'sounds/punsh.ogg'    // http://soundbible.com/995-Jab.html
      ], i;
      
      for (i = 0; i < audioStack.length; i += 1) {
      
        $('body').append($('<audio>')
                           .attr({
                             preload: 'auto',
                             id: 'audio-' + audioStack[i].substring(audioStack[i].lastIndexOf('/') + 1, audioStack[i].lastIndexOf('.'))
                           })
                           /*.append($('<source>')
                             .attr({
                               src: audioStack[i] + '.mp3',
                               type: 'audio/mpeg; codecs="mp3"',
                             }))*/
                           .append($('<source>')
                             .attr({
                               src: audioStack[i],
                               type: 'audio/ogg; codecs="vorbis"',
                             })));
                             
      }
    
    }
    
  }

}());

ONLINGA.Main.init();