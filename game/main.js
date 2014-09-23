'use strict';

var Player = require('./prefabs/characters/player');
var Enemy = require('./prefabs/characters/enemy');

var GameState = function(game) {

};

//Load images and sounds
GameState.prototype.preload = function() {
    this.game.load.spritesheet('smallBullet', '/assets/spritesheets/bullet.png', 8, 8);
    this.game.load.spritesheet('bigBullet', '/assets/spritesheets/bigBullet.png', 16, 16);
    this.game.load.spritesheet('player', '/assets/spritesheets/player.png', 48, 48);
    this.game.load.spritesheet('enemy', '/assets/spritesheets/enemy.png', 64, 64);
    this.game.load.image('enemyParticle', '/assets/spritesheets/enemyParticle.png');
};

// Setup the example
GameState.prototype.create = function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    // Set stage background color
    this.game.stage.backgroundColor = 0x4488cc;

    this.gun = new Player(this.game, 50, this.game.height/2, 'player');
    this.game.add.existing(this.gun);

    this.gun.body.collideWorldBounds = true;

    this.enemies = this.game.add.group();
    this.enemies.x = 480;
    this.enemies.y = 240;

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

// This method spawns enemies
GameState.prototype.spawnEnemy = function () {
    var enemy = this.game.add.sprite(0, 0, 'enemy');
    this.game.physics.enable(enemy, Phaser.Physics.ARCADE);
    enemy.health = 100;
    enemy.body.velocity.x = -100;
    enemy.body.velocity.y = -50;
    this.enemies.add(enemy);

    // var enemy = new Enemy(this.game, 0, 0, 'enemy');
    // enemy.setTarget(this.gun);
    // this.enemies.add(enemy);
};

// The update() method is called every frame
GameState.prototype.update = function() {
    // collision handlers
    this.game.physics.arcade.overlap(this.enemies, this.gun.state.primaryPool, this.shareBehaviours, null, this);

    if (this.game.time.fps !== 0) {
        this.fpsText.setText(this.game.time.fps + ' FPS');
    }

    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
        // this.player.shootPrimary();
        this.gun.shootPrimary();
    }

    if (this.leftInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.gun.keySignalListener({direction: {x: -1, y: 0}});
    } else if (this.rightInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.gun.keySignalListener({direction: {x: 1, y: 0}});
    } else {
        // Stop the player from moving horizontally
        this.gun.body.velocity.x = 0;
    }

    if (this.upInputIsActive()) {
        // If the LEFT key is down, set the player velocity to move left
        this.gun.keySignalListener({direction: {x: 0, y: -1}});
    } else if (this.downInputIsActive()) {
        // If the RIGHT key is down, set the player velocity to move right
        this.gun.keySignalListener({direction: {x: 0, y: 1}});
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

GameState.prototype.shareBehaviours = function (enemy, bullet) {
    enemy.changeState(bullet.getPublicState);
};

var game = new Phaser.Game(848, 450, Phaser.AUTO, 'game');
game.state.add('game', GameState, true);

