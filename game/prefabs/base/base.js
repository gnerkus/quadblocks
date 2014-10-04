'use strict';

// BasePrefab is the parent prefab class from which other prefabs are defined
// @animationConfig defines the animations for the prefab
var BasePrefab = function (game, x, y, sprite) {

    Phaser.Sprite.call(this, game, x, y, sprite);
    this.anchor.setTo(0.5, 0.5);
   
    // A list of the components the prefab contains -- [configurable]
    this.behaviours = [];

    // A list of methods to be called for each update call -- [configurable]
    this.updateMethods = [];

};

BasePrefab.prototype = Object.create(Phaser.Sprite.prototype);
BasePrefab.prototype.constructor = BasePrefab;

BasePrefab.prototype.update = function () {
	
};

BasePrefab.prototype.addBehaviour = function (behaviourObject) {
	// Add the behaviourObject to the list of behaviours
	this.behaviours.push(behaviourObject.name);

	// Add behaviour attributes to the prefab's state
	this[behaviourObject.name] = behaviourObject.attribs;

    // Add behaviour methods to the prefab
    for (var methodIdx in behaviourObject.methods) {
    	var method = behaviourObject.methods[methodIdx];
    	this[methodIdx] = method.bind(this);
    }

};

module.exports = BasePrefab;