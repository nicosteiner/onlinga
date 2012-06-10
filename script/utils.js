if (typeof ONLINGA === 'undefined') { ONLINGA = {}; }

ONLINGA.utils = {
  /*
  toggleOpacityValue: 1,
    
  toggleOpacityOrientation: -1,

  findIdealSpreading: function (params, spreadings) {
  
    var i = 0, j = 0;
    
    var idealSpread = [];
    
    var minDistance = params.dimension[0] / (params.count / params.accuracy);
    
    var distance, distanceTemp;
    
    var idealspread;
    
    var rasterx = minDistance;
    
    var rastery = minDistance;

    var spreadx, spready, spreadxTemp, spreadyTemp;
    
    if (spreadings) {
      
      // try 10 times to find an indeal spread
      
      for (i; i < 10; i += 1) {
      
        j = 0;
        
        idealspread = true;
        
        distanceTemp = 0;
        
        if (params.raster) {
        
          spreadx = $.random(parseInt(params.dimension[0] / rasterx)) * parseInt(rasterx);

          spready = $.random(parseInt(params.dimension[1] / rastery)) * parseInt(rastery);
          
        } else {
        
          spreadx = $.random(params.dimension[0]);
        
          spready = $.random(params.dimension[1]);
        
        }  
    
        for (j; j < spreadings.length; j += 1) {
        
          // calculate distance with pythagoras
        
          distance = Math.sqrt(Math.pow(spreadings[j][0] - spreadx, 2) + Math.pow(spreadings[j][1] - spready, 2));

          if (distance < minDistance) {
          
            idealspread = false;
          
            // store best result for the case, that no ideal spread is found
          
            if (distance > distanceTemp) {
            
              distanceTemp = distance;
              
              spreadxTemp = spreadx;
              
              spreadyTemp = spready;
            
            }
          
          }
        
        }
        
        if (idealspread) {
        
          idealSpread.push(spreadx);
          idealSpread.push(spready);
          
          return idealSpread;
        
        }
        
      }

    }

    // fallback when no ideal spread is found
    
    idealSpread.push(spreadxTemp);
    idealSpread.push(spreadyTemp);
    
    return idealSpread;
    
  },
  
  naturalSpreading: function (params) {
  
    var spreadings = [];
    
    var i = 0;
    
    for (i; i < params.count; i += 1) {
    
      // try 10 times to find ideal spread
    
      var idealSpreading = ONLINGA.utils.findIdealSpreading(params, spreadings);
    
      spreadings.push(idealSpreading);
  
    }
    
    return spreadings;
    
  },
  
  getFirstKey: function (assoarray) {
  
    for (key in assoarray) {
    
      return key;
      
    }
    
  },
  
  getArraySize: function (assoarray) {
  
    var keys = [];
    
    var currentKey, i;
    
    for (currentKey in assoarray) {
    
      keys.push(currentKey);
    
    }
    
    return keys.length;
    
  },
  
  getNextKey: function (assoarray, key) {
  
    var keys = [];
    
    var currentKey, i;
    
    for (currentKey in assoarray) {
    
      keys.push(currentKey);
    
    }
    
    i = 0;
    
    for (i; i < keys.length; i += 1) {
    
      if (keys[i] === key) {
      
        return keys[i + 1];
      
      }
    
    }
    
    return false;
    
  },
  
  toggleOpacity: function(elementArray) {
  
    var i = 0;
    
    ONLINGA.utils.toggleOpacityValue = ONLINGA.utils.toggleOpacityValue + ONLINGA.utils.toggleOpacityOrientation * 0.02;
    
    if (ONLINGA.utils.toggleOpacityValue <= 0.3 || ONLINGA.utils.toggleOpacityValue >= 1) {
    
      ONLINGA.utils.toggleOpacityOrientation = ONLINGA.utils.toggleOpacityOrientation * -1;
    
    }
    
    for (i; i < elementArray.length; i++) {
    
      elementArray[i].css('opacity', ONLINGA.utils.toggleOpacityValue);
    
    }
    
  }
  */
};
