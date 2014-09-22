'use strict';

// BasePrefab is the parent prefab class from which other prefabs are defined
// @animationConfig defines the animations for the prefab
var BasePrefab = function (game, x, y, sprite, animationConfig) {

	x = x || 0;
	y = y || 0;
	sprite = sprite || null;
    animationConfig = animationConfig || { 'moving': [0] };

    // Ensure the animationConfig consists of arrays
    for (var config in animationConfig) {
    	if (!Array.isArray(animationConfig[config])) {
    		console.log(animationConfig);
    		console.log('Animation config is now well-defined. Using default config.');
    		animationConfig = { 'moving': [0]};
    		break;
    	}
    }

	// Call super class constructor
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.anchor.setTo(0.5, 0.5);

    // Give the prefab a physics body
    this.game.physics.arcade.enable(this);


    /* Define animations
     The animationConfig is of the form:
    
      {
	    'right': [0, 1, 2],
	    'down': [3, 4, 5]
      }
     */
    for (var configObj in animationConfig) {
    	this.animations.add(configObj, animationConfig[configObj]);
    }

    // Play the starting animation.
    // I assume there is a config named 'right' until I can find
    // a way to set the first item in the config
    this.animations.play('right');
    
    // State object -- [configurable]
    this.state = {};
    
    // Public interface to the prefab's state
    this.publicState = {};

    // A list of the components the prefab contains -- [configurable]
    this.behaviours = [];

    // A list of methods to be called for each update call -- [configurable]
    this.behaviourMethods = [];
};

BasePrefab.prototype = Object.create(Phaser.Sprite.prototype);
BasePrefab.prototype.constructor = BasePrefab;

BasePrefab.prototype.update = function () {
	// Call each behaviour's update methods, updating the prefab's state as a consequence
	for (var index in this.behaviourMethods) {
		this[this.behaviourMethods[index]].call(this);
	}
};

BasePrefab.prototype.addBehaviour = function (behaviourObject) {
	// Add the behaviourObject to the list of behaviours
	this.components.push(behaviourObject.name);

	// Add behaviour attributes to the prefab's state
	this.state[behaviourObject.name] = Object.create(behaviourObject.attribs);

	// Add behaviour attributes to the prefab's publicState
    for (var behaviourIdx in behaviourObject.behaviour) {
    	var behaviour = Object.create(behaviourObject.behavour[behaviourIdx]);
    	this.publicState[behaviourIdx] = behaviour;
    }

    // Add behaviour methods to the prefab
    for (var methodIdx in behaviourObject.methods) {
    	var method = behaviourObject.methods[methodIdx];
    	this[methodIdx] = method.bind(this);
    }

    // Add behaviour update methods to the prefab
    for (var updateIdx in behaviourObject.updateMethods) {
    	var updateMethod = behaviourObject.updateMethods[updateIdx];
    	this[updateIdx] = updateMethod.bind(this);
    	this.behaviourMethods.push(updateIdx);
    }

    // Define collision handler
    this['handle' + behaviourObject.name] = behaviourObject.handler.bind(this);
};

BasePrefab.prototype.getBehaviour = function () {
	return this.behaviour;
};

BasePrefab.prototype.changeState = function (behaviour) {
	for (var behaviourIdx in behaviour) {
		if (this.behaviours.indexOf(behaviourIdx) >= 0) {
			this['handle' + behaviourIdx](behaviour[behaviourIdx]);
		}
	}
};

module.exports = BasePrefab;