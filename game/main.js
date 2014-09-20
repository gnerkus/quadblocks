'use strict';

var GameState = function(game) {

};

//Load images and sounds
GameState.prototype.preload = function() {
	this.game.load.image('bullet', '/assets/spritesheets/bullet.png');
	this.game.load.image('bigBullet', '/assets/spritesheets/bigBullet.png');
	this.game.load.image('player', '/assets/spritesheets/player.png');
	this.game.load.image('enemy', '/assets/spritesheets/enemy.png');
	this.game.load.image('enemyParticle', '/assets/spritesheets/enemyParticle.png');
};

// Setup the example
GameState.prototype.create = function() {
	// Set stage background color
	this.game.stage.backgroundColor = 0x4488cc;

	// Define constants
    this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 20;

    this.SHOT_DELAY_BIG = 500; // milliseconds (10 bullets/second)
    this.BULLET_SPEED_BIG = 125; // pixels/second
    this.NUMBER_OF_BULLETS_BIG = 5;

    this.MAX_SPEED = 250; // pixels/second

    // Create an object representing our gun
    this.gun = this.game.add.sprite(50, this.game.height/2, 'player');
    this.game.physics.enable(this.gun, Phaser.Physics.ARCADE);

    // Set the pivot point to the center of the gun
    this.gun.anchor.setTo(0.5, 0.5);

    // Make the gun collide with the world boundaries
    this.gun.body.collideWorldBounds = true;

    this.enemies = this.game.add.group();
    this.enemies.x = 480;
    this.enemies.y = 240;

    // Create an object pool of bullets
    this.bulletPool = this.game.add.group();
    for (var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
    	// Create each bullet and add it to the group.
    	var bullet = this.game.add.sprite(0, 0, 'bullet');
    	this.bulletPool.add(bullet);

    	// Set its pivot point to the center of the bullet
    	bullet.anchor.setTo(0.5, 0.5);

    	// Enable physics on the bullet
    	this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

    	// Set its initial state to 'dead'
    	bullet.kill();
    }

    // Create an object pool of bullets for the secondary weapon
    this.bigBulletPool = this.game.add.group();
    for (var j = 0; j < this.NUMBER_OF_BULLETS_BIG; j++) {
    	// Create each bullet and add it to the group.
    	var bigBullet = this.game.add.sprite(0, 0, 'bigBullet');
    	this.bigBulletPool.add(bigBullet);

    	// Set its pivot point to the center of the bullet
    	bigBullet.anchor.setTo(0.5, 0.5);

    	// Enable physics on the bullet
    	this.game.physics.enable(bigBullet, Phaser.Physics.ARCADE);

    	// Set its initial state to 'dead'
    	bigBullet.kill();
    }

    // Simulate a pointer click/tap input at the center of the stage when the example begins running
    this.game.input.activePointer.x = this.game.width/2;
    this.game.input.activePointer.y = this.game.height/2;

    // Capture certain keys to prevent their default actions in the browser.
    // This is only necessary because this is an HTML5 game. Games on other
    // platforms may not need code like this.
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.A,
        Phaser.Keyboard.D,
        Phaser.Keyboard.W,
        Phaser.Keyboard.S,
        Phaser.Keyboard.F
    ]);

    // Show FPS
    this.game.time.advancedTiming = true;
    this.fpsText = this.game.add.text(
    	20, 20, '', { font: '16px Arial', fill: '#ffffff' }
    );

    this.game.time.events.loop(Phaser.Timer.SECOND, this.spawnEnemy, this);
};

GameState.prototype.shootBullet = function() {
	// Enforce a short delay between shots by recording the time that each
	// bullet is shot and testing if the amount of time since the last shot
	// is more than the required delay .
	if (this.lastBulletShotAt === undefined) { 
		this.lastBulletShotAt = 0; 
	}
	if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) { 
		return; 
	}
	this.lastBulletShotAt = this.game.time.now;

	// Get a dead bullet from the pool
	var bullet = this.bulletPool.getFirstDead();

	// If there aren't any bullets available then don't shoot
	if (bullet === null || bullet === undefined) {
		return;
	}

	// Revive the bullet
	// This makes the bullet 'alive'
	bullet.revive();

	// Bullets should kill themselves when they leave the world.
	bullet.checkWorldBounds = true;
	bullet.outOfBoundsKill = true;

	// Set the bullet position to the gun position
	bullet.reset(this.gun.x, this.gun.y);
	bullet.rotation = this.gun.rotation;

	// Shoot it in the right direction
	bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
	bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
};

GameState.prototype.shootBigBullet = function() {
	// Enforce a short delay between shots by recording the time that each
	// bullet is shot and testing if the amount of time since the last shot
	// is more than the required delay .
	if (this.lastBigBulletShotAt === undefined) { 
		this.lastBigBulletShotAt = 0; 
	}
	if (this.game.time.now - this.lastBigBulletShotAt < this.SHOT_DELAY_BIG) { 
		return; 
	}
	this.lastBigBulletShotAt = this.game.time.now;

	// Get a dead bullet from the pool
	var bullet = this.bigBulletPool.getFirstDead();

	// If there aren't any bullets available then don't shoot
	if (bullet === null || bullet === undefined) {
		return;
	}

	// Revive the bullet
	// This makes the bullet 'alive'
	bullet.revive();

	// Bullets should kill themselves when they leave the world.
	bullet.checkWorldBounds = true;
	bullet.outOfBoundsKill = true;

	// Set the bullet position to the gun position
	bullet.reset(this.gun.x, this.gun.y);
	bullet.rotation = this.gun.rotation;

	// Shoot it in the right direction
	bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED_BIG;
	bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED_BIG;
};

// This method spawns enemies
GameState.prototype.spawnEnemy = function () {
	var enemy = this.game.add.sprite(0, 0, 'enemy');
	this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
	enemy.health = 100;
	enemy.body.velocity.x = -100;
	enemy.body.velocity.y = -50;
	this.enemies.add(enemy);
};

GameState.prototype.shootEnemy = function (bullet, enemy) {
	bullet.kill();
	enemy.damage(20);
};

GameState.prototype.bigShootEnemy = function (bullet, enemy) {
	bullet.kill();

	var emitter = this.game.add.emitter(enemy.body.x, enemy.body.y, 200);
	emitter.makeParticles('enemyParticle');
	emitter.start(true, 1000, 0, 0);

	enemy.damage(100);
};

// The update() method is called every frame
GameState.prototype.update = function() {
    this.game.physics.arcade.overlap(this.bulletPool, this.enemies, this.shootEnemy, null, this);

    this.game.physics.arcade.overlap(this.bigBulletPool, this.enemies, this.bigShootEnemy, null, this);

	if (this.game.time.fps !== 0) {
		this.fpsText.setText(this.game.time.fps + ' FPS');
	}

	// Aim the gun at the pointer.
	// All this function does is calculate the angle using
	// Math.atan2(yPointer-yGun, xPointer-xGun)
	this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);

	// Shoot a bullet
	if (this.game.input.activePointer.isDown) {
		this.shootBullet();
	}

	if (this.input.keyboard.isDown(Phaser.Keyboard.F)) {
		this.shootBigBullet();
	}

	if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.gun.body.velocity.x = -this.MAX_SPEED;
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.gun.body.velocity.x = this.MAX_SPEED;
    } else {
        // Stop the player from moving horizontally
        this.gun.body.velocity.x = 0;
    }

    if (this.upInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.gun.body.velocity.y = -this.MAX_SPEED;
    } else if (this.downInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.gun.body.velocity.y = this.MAX_SPEED;
    } else {
        // Stop the player from moving horizontally
        this.gun.body.velocity.y = 0;
    }
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.leftInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.A);
    
    return isActive;
};

// This function should return true when the player activates the "go right" control
// In this case, either holding the right arrow or tapping or clicking on the right
// side of the screen.
GameState.prototype.rightInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.D);
    
    return isActive;
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.upInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.W);
    
    return isActive;
};

// This function should return true when the player activates the "go left" control
// In this case, either holding the right arrow or tapping or clicking on the left
// side of the screen.
GameState.prototype.downInputIsActive = function() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.S);
    
    return isActive;
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);

