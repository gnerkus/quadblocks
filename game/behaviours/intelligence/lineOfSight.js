'use strict';

/**
 * The Line-Of-Sight behaviour allows the ability to check if two objects can 
 * 'see' each other. More precisely, it will check if there are any obstacles
 * blocking a line between the two objects
 */

var LineOfSightBehaviour = (function () {
	var state = {
		name: 'lineOfSight',

		attribs: {
			obstacles: [], // the obstacles that can block the line-of-sight
            range: 48, // the maximum distance in pixels that line-of-sight can reach
            coneOfView: 360, // the angle of the cone of view
            target: null,
            cone: null
		},

		updateMethods: {
            
		},

		methods: {
			lineOfSightMoveCone: function () {
            	this.lineOfSight.cone.position.x = this.body.center.x;
            	this.lineOfSight.cone.position.y = this.body.center.y;
            },

            lineOfSightInit: function () {
                this.lineOfSightCreateCone();
            },

            lineOfSightRegisterTarget: function (target) {
            	this.lineOfSight.target = target;
            },

            lineOfSightCreateCone: function () {
            	this.lineOfSight.cone = null;
            	/*var x = this.x;
            	var y = this.y;

            	if (this.parent instanceof Phaser.Group) {
                    x = this.parent.x;
                    y = this.parent.y;
            	}*/

			    this.lineOfSight.cone = this.game.add.sprite(this.body.center.x, this.body.center.y, 'radar');
			    this.lineOfSight.cone.anchor.setTo(0.5, 0.5);
            },

            lineOfSightCanSeeTarget: function () {
                return this.lineOfSight.cone.overlap(this.lineOfSight.target);
            },

            lineOfSightSetRange: function (range) {
                this.lineOfSight.range = range;
                this.lineOfSightCreateCone();
            }
		}
	};

	return state;
}());

module.exports = LineOfSightBehaviour;