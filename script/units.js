ONLINGA.Units = ONLINGA.Units || {};

ONLINGA.Units.Unit = function() {};

ONLINGA.Units.Unit.prototype = {

  type: null,

  attack: 1,

  defense: 1,

  damage: 1,

  currentHealth: 1,

  maxHealth: 1,

  remainingMoves: 1,

  maxMoves: 1,

  attackRange: 1,

  attackPercentageForRange: [100],

  getAttack: function() {

    return this.attack;

  },

  getType: function() {

    return this.type;

  },

  getDefense: function() {

    return this.defense;

  },

  getDamage: function() {

    return this.damage;

  },

  getCurrentHealth: function() {

    return this.currentHealth;

  },

  getRemainingMoves: function() {

    return this.remainingMoves;

  },

  getMaxMoves: function() {

    return this.maxMoves;

  },

  getAttackRange: function() {

    return this.attackRange;

  },

  heal: function(healingPoints) {

    // ToDo: Add testing if healingPoints is type int

    if (healingPoints + this.currentHealth >= this.maxHealth) {

      this.currentHealth = this.maxHealth;

    } else {

      this.currentHealth = this.currentHealth + healingPoints;

    }

  },

  reduceHealth: function(damagePoints) {

    if (this.currentHealth - damagePoints <= 0) {

      // Unit is dead, units with currentHealth = 0 will be removed from ONLINGA.CombatManager.

      this.currentHealth = 0;

    } else {

      this.currentHealth = this.currentHealth - damagePoints;

    }

  },

  isDead: function() {

    if (this.currentHealth > 0) {

      return false;

    }

    return true;

  },

  resetCurrentMovesToMax: function() {

    this.currentMoves = this.maxMoves;

  }
  
};

// Knight

ONLINGA.Units.Knight = function() {};

ONLINGA.Units.Knight.prototype = new ONLINGA.Units.Unit();

ONLINGA.Units.Knight.prototype.constructor = ONLINGA.Units.Knight;

ONLINGA.Units.Knight.prototype.type = "knight";

ONLINGA.Units.Knight.prototype.attack = 4;

ONLINGA.Units.Knight.prototype.defense = 4;

ONLINGA.Units.Knight.prototype.damage = 2;

ONLINGA.Units.Knight.prototype.maxHealth = 4;

ONLINGA.Units.Knight.prototype.currentHealth = 4;

// Rider

ONLINGA.Units.Rider = function() {};

ONLINGA.Units.Rider.prototype = new ONLINGA.Units.Unit();

ONLINGA.Units.Rider.prototype.constructor = ONLINGA.Units.Rider;

ONLINGA.Units.Rider.prototype.type = "rider";

ONLINGA.Units.Rider.prototype.attack = 6;

ONLINGA.Units.Rider.prototype.defense = 4;

ONLINGA.Units.Rider.prototype.damage = 3;

ONLINGA.Units.Rider.prototype.maxHealth = 6;

ONLINGA.Units.Rider.prototype.currentHealth = 6;

ONLINGA.Units.Rider.prototype.remainingMoves = 3;

ONLINGA.Units.Rider.prototype.maxMoves = 4;

//Archer

ONLINGA.Units.Archer = function() {};

ONLINGA.Units.Archer.prototype = new ONLINGA.Units.Unit();

ONLINGA.Units.Archer.prototype.constructor = ONLINGA.Units.Archer;

ONLINGA.Units.Archer.prototype.type = "archer";

ONLINGA.Units.Archer.prototype.attack = 4;

ONLINGA.Units.Archer.prototype.defense = 2;

ONLINGA.Units.Archer.prototype.damage = 2;

ONLINGA.Units.Archer.prototype.maxHealth = 2;

ONLINGA.Units.Archer.prototype.currentHealth = 2;

ONLINGA.Units.Archer.prototype.remainingMoves = 2;

ONLINGA.Units.Archer.prototype.maxMoves = 3;

ONLINGA.Units.Archer.prototype.attackRange = 1;

ONLINGA.Units.Archer.prototype.attackPercentageForRange = [100, 75];


/*ONLINGA.AbstractAssault = function() {

}

// At distant assaults, the attacker can not be hurt (is that really true? archer against archer)

ONLINGA.DistanceAssault = function(attacker, defender) {

}*/

ONLINGA.Units.CombatManager = {

  combatTurns: 5,

  processCloseAttack: function(attackingArmy, defendingArmy) {

    var totalAttackPoints = attackingArmy.units.length * attackingArmy.units[0].getAttack(),
        totalDefensePoints = defendingArmy.units.length * defendingArmy.units[0].getDefense(), //add field defense and position deduction
        totalCombatPoints = totalAttackPoints + totalDefensePoints,
        randomResult, i, damagePoints;

    for (i = 0; i < ONLINGA.Units.CombatManager.combatTurns; i += 1) {

      randomResult = Math.ceil((Math.random() * totalCombatPoints));

      if (randomResult <= totalAttackPoints) {

        // attacker wins round.

        damagePoints = attackingArmy.units[0].getDamage();

        ONLINGA.Units.CombatManager.handleCombatTurnLooser(defendingArmy, damagePoints, defendingArmy.position, ONLINGA.Units.CombatManager.handleVictory);

      } else {

        // defender wins round.

        damagePoints = defendingArmy.units[0].getDamage();

        ONLINGA.Units.CombatManager.handleCombatTurnLooser(attackingArmy, damagePoints, attackingArmy.position, ONLINGA.Units.CombatManager.handleDefeat);

      }

      if (attackingArmy.units.length === 0 || defendingArmy.units.length === 0) {

        // One army is destroyed, no need to fight any further.

        return;

      }

    }

  },
  
  handleCombatTurnLooser: function(loosers, damagePoints, newPosition, handleDead) {

    var looser = loosers.units[loosers.units.length-1]; // get the last unit from units array

    looser.reduceHealth(damagePoints);

    ONLINGA.Gamepad.showAttackHits(damagePoints); //ToDo: function needs delay and info which army got hit.
    
    if (looser.isDead()) {

      loosers.units.pop(); // Remove the last unit from units array
   
      ONLINGA.Gamepad.renderSingleArmy(loosers.index);

      if (loosers.units.length === 0) {

        // all units from the army are dead

        handleDead(newPosition, loosers.index);
      
        // remove loosers from ONLINGA.Gamepad.military

        ONLINGA.Gamepad.removeMilitaryByIndex(loosers.index);
        
        return;

      }

    }      

  },
  
  handleDefeat: function(newPosition, index) {
  
    // remove highlighted hexaeders
    
    ONLINGA.Gamepad.removeExistingTargetHighlightings();
  
    // and give feedback to user

    ONLINGA.Gamepad.showHintAtPosition('DEFEATED!', newPosition.x, newPosition.y);
    
  },
  
  handleVictory: function(newPosition, index) {
  
    // move attacking military to enemy position
    
    ONLINGA.Gamepad.moveMilitaryToPosition(newPosition.x, newPosition.y)
    
    // and give feedback to user

    ONLINGA.Gamepad.showHintAtPosition('VICTORY!', newPosition.x, newPosition.y);
    
  },  
  
};

ONLINGA.Units.Factory = {

  createKnights: function(amount) {

    var knights = [],
        i;

    for (i = 0; i < amount; i += 1) {

      knights.push(new ONLINGA.Units.Knight());

    }

    return knights;
    
  },

  createRiders: function(amount) {

    var riders = [],
        i;

    for (i = 0; i < amount; i += 1) {

      riders.push(new ONLINGA.Units.Rider());

    }

    return riders;
    
  },

  createArchers: function(amount) {

    var archers = [],
        i;

    for (i = 0; i < amount; i += 1) {

      archers.push(new ONLINGA.Units.Archer());

    }

    return archers;
    
  }
  
};