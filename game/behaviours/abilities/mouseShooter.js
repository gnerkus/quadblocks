/*
1. In Play state, check for click.
2. In the if block listening for the click, create a signal object.
For example, if the left button is clicked
{
	mouse: 'left'
}
3. Call the mouseClickListener for the player-controlled object and 
pass the signal object to it.
4. In the mouseShooter behaviour, the mouseClickListener method uses the 
signal data to instruct the player prefab to shoot the corresponding bullet.

TODO
=====================================
+ The setPrimaryBullet function should check if the type argument exists in
    the bulletTypes object of the prefab's mouseShooter state.
 */

'use strict';

var MouseShooterBehaviour = (function () {
    var state = {
        name: 'mouseShooter',

        attribs: {
            lastBulletShotAt: 0,
            primaryPool: null,
        	secondaryPool: null,
            primaryBullet: null,
            secondaryBullet: null,
            bulletTypes: {
                'smallBullet': null,
                'bigBullet': null
            }
        },

        updateMethods: {
            keepAim: function () {
                this.rotation = this.game.physics.arcade.angleToPointer(this);
            }
        },

        methods: {
            mouseClickListener: function (mouseClickSignal) {
            	/*
            	The mouseClickSignal looks like this:
            	{
	                {
	                    mouse: 'left',
	                }
            	}
            	In this example the left mouse button was clicked.

                In the play state, when the left button is clicked, a signal is sent to
                the prefab's mouseClickListener like this:
                player.mouseClickListener({mouse: 'left'});

                'left' always shoots the primary weapon; 'right' the secondary. The controls
                are not configurable.
            	 */
                
                if (mouseClickSignal.mouse === 'left') {
                    this.shootPrimary();
                } else {
                    this.shootSecondary();
                }
            },

            addBulletType: function (typeConfig) {
                /*
                The type config should look like this:

                {
                    name: 'medium',
                    class: MediumBullet
                }
                 */
                this.state.mouseShooter.bulletTypes[typeConfig.name] = typeConfig.class;
            },

            setPrimaryBullet: function (type) {
                this.state.mouseShooter.primaryBullet = this.state.mouseShooter.bulletTypes[type];
            },

            setSecondaryBullet: function (type) {
                this.state.mouseShooter.secondaryBullet = this.state.mouseShooter.bulletTypes[type];
            },

            shootPrimary: function () {
                /*
                Primary bullet should have been configured at this time.
                 */
                var PrimaryBullet = this.state.mouseShooter.primaryBullet;

                if (this.state.mouseShooter.lastBulletShotAt === undefined) {
                    this.lastBulletShotAt = 0;
                }
                if (this.game.time.now - this.lastBulletShotAt < PrimaryBullet.gunProperties.shotDelay) {
                    return;
                }
                this.lastBulletShotAt = this.game.time.now;
                
                // Get a dead bullet from the pool.
                var bullet = this.state.mouseShooter.primaryPool.getFirstDead();

                // If there aren't any bullets available then don't shoot
                if (bullet === null || bullet === undefined) {
                    return;
                }
                
                // Revive the bullet; make it alive.
                bullet.revive();

                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;

                // Set the bullet position to the shooter's position
                bullet.fireBullet(this.x, this.y, this.rotation);
            },

            shootSecondary: function () {
                /*
                Secondary bullet should have been configured at this time.
                 */
                var SecondaryBullet = this.state.mouseShooter.secondaryBullet;

                if (this.state.mouseShooter.lastBulletShotAt === undefined) {
                    this.lastBulletShotAt = 0;
                }
                if (this.game.time.now - this.lastBulletShotAt < SecondaryBullet.gunProperties.shotDelay) {
                    return;
                }
                this.lastBulletShotAt = this.game.time.now;
                
                // Get a dead bullet from the pool.
                var bullet = this.state.mouseShooter.secondaryPool.getFirstDead();

                // If there aren't any bullets available then don't shoot
                if (bullet === null || bullet === undefined) {
                    return;
                }
                
                // Revive the bullet; make it alive.
                bullet.revive();

                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;

                // Set the bullet position to the shooter's position
                bullet.fireBullet(this.body.x, this.body.y, this.rotation);
            },

            createPrimaryBulletPool: function () {
                var PrimaryBullet = this.state.mouseShooter.primaryBullet;
                this.state.mouseShooter.primaryPool = this.game.add.group();
                
                for (var i = 0; i < PrimaryBullet.gunProperties.bulletCount; i++) {
                    var bullet = new PrimaryBullet(this.game, 0, 0);
                    this.state.mouseShooter.primaryPool.add(bullet);
                    bullet.anchor.setTo(0.5, 0.5);
                    bullet.kill();
                }
            },

            createSecondaryBulletPool: function () {
                var SecondaryBullet = this.state.mouseShooter.secondaryBullet;
                this.state.mouseShooter.secondaryPool = this.game.add.group();
                
                for (var i = 0; i < SecondaryBullet.gunProperties.bulletCount; i++) {
                    var bullet = new SecondaryBullet(this.game, 0, 0);
                    this.state.mouseShooter.secondaryPool.add(bullet);
                    bullet.anchor.setTo(0.5, 0.5);
                    bullet.kill();
                }
            }
        },

        behaviour: {
            
        },

        handler: function (instruction) {
            return;
        }
    };

    return state;
}());

module.exports = MouseShooterBehaviour;


