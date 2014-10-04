'use strict';

// The Player object extends the BasePrefab object
var BasePrefab = require('./../base/base');
// The bullet the gun uses
var MPBullet = require('./../projectiles/mpBullet');

var MPGun = function (game, x, y) {
	// Call super class constructor
    BasePrefab.call(this, game, x, y, 'bigBullet');

    this.player = null;

    this.bulletPool = null;
    this.lastBulletShotAt = 0;
    this.shotDelay = 250;
    this.ammoCount = 50;
    this.powerPerShot = 1;
    this.bulletType = MPBullet;

    this.createBulletPool();

};

MPGun.prototype = Object.create(BasePrefab.prototype);
MPGun.prototype.constructor = MPGun;

MPGun.prototype.update = function () {
	this.x = this.player.x;
	this.y = this.player.y;

	this.rotation = this.player.rotation;
};

MPGun.prototype.shoot = function () {
    if (this.lastBulletShotAt === undefined) {
        this.lastBulletShotAt = 0;
    }
    if (this.game.time.now - this.lastBulletShotAt < this.shotDelay) {
        return;
    }
    this.lastBulletShotAt = this.game.time.now;

    if (this.player.power < this.powerPerShot) {
    	return;
    }
    
    // Get a dead bullet from the pool.
    var bullet = this.bulletPool.getFirstDead();

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) {
        return;
    }
    
    // Revive the bullet; make it alive.
    bullet.revive();
    bullet.bulletSetEnabled(this.x + this.width, this.y + this.height/2, this.angle);

    this.player.power -= this.powerPerShot;
};

MPGun.prototype.createBulletPool = function () {
    var Bullet = this.bulletType;
    this.bulletPool = this.game.add.group();

    for (var i = 0; i < this.ammoCount; i++) {
        var bullet = new Bullet(this.game, 0, 0);
        this.bulletPool.add(bullet);
        bullet.anchor.setTo(0.5, 0.5);
        bullet.kill();
    }
};

module.exports = MPGun;