'use strict';

/**
 * The Bullet behaviour simply moves an object forwards at an angle.
 * However, it also provides other properties like bouncing and gravity.
 */

var BulletBehaviour = (function () {
    var state = {
        name: 'bullet',

        attribs: {
            maxSpeed: 480,
            gravity: 0,
            startX: 0,
            startY: 0
        },

        updateMethods: {
            
        },

        methods: {
            bulletInit: function () {
                // Enable physics
                if (!this.body) {
                    this.game.physics.arcade.enable(this);
                }
            },

            bulletSetMaxSpeed: function (speed) {
                this.bullet.maxSpeed = speed;
            },

            bulletSetEnabled: function (x, y, angle) {
                this.reset(x, y);
                this.checkWorldBounds = true;
                this.outOfBoundsKill = true;
                this.bullet.startX = this.body.position.x;
                this.bullet.startY = this.body.position.y;
                this.angle = angle;

                this.game.physics.arcade.velocityFromAngle(this.angle, this.bullet.maxSpeed, this.body.velocity);
            },

            bulletDistanceTravelled: function () {
                return this.game.math.distance(this.bullet.startX, this.bullet.startY, this.body.position.x, this.body.position.y);
            },

            bulletSetGravity: function (x, y) {
                if (!this.body.allowGravity) {
                    this.body.allowGravity = true;
                }

                this.body.gravity.x = x;
                this.body.gravity.y = y;
            }

        }

    };

    return state;
}());

module.exports = BulletBehaviour;
