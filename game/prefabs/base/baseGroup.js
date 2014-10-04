'use strict';

var BaseGroup = function (game, parent) {
    Phaser.Group.call(this, game, parent);

};

BaseGroup.prototype = Object.create(Phaser.Group.prototype);
BaseGroup.prototype.constructor = BaseGroup;

BaseGroup.prototype.addBehaviour = function (behaviourObject) {
	// Add the behaviourObject to the list of behaviours
	this.behaviours.push(behaviourObject.name);

	// Add behaviour attributes to the prefab's state
	this[behaviourObject.name] = behaviourObject.attribs;

    // Add behaviour methods to the prefab
    for (var methodIdx in behaviourObject.methods) {
    	var method = behaviourObject.methods[methodIdx];
    	this[behaviourObject.name][methodIdx] = method.bind(this);
    }

};

module.exports = BaseGroup;