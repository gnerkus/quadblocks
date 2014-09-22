/*
1. In Play state, check for keypress.
2. In the if block listening for the keypress, create a signal object.
For example, is the key pressed is "D" (Phaser.Keyboard.D)
{
	direction: 0
}
3. Call the keyboardMovementListener for the player-controlled object and 
pass the signal object to it.
4. In the keyboardMovement behaviour, the keyboardListener method uses the 
signal data to move the player prefab according to the configured controls.

 */



/*
Keyboard control behaviour
================================================================================

## How it works: ##
+ This should be added to the prefab
+ This offers a function, 'configureContols', that takes a config of this form:

{
	'right': 'D',
	'down': 'S',
	'left': 'A',
	'up': 'W'
}
  The config function then modifies the 'controller' part of the prefab's state and creates a hash of this form:

  {
	'right': Phaser.Keyboard.D,
	'down': Phaser.Keyboard.S,
	'left': Phaser.Keyboard.A,
	'up': Phaser.Keyboard.W,
  }

+ The behaviour object contains an update function that checks for keyboard input signals. An example call looks like this:

if (this.game.input.keyboard.isDown(this.state.controller.right)) {}

The update function modifies the prefab's position according to the input received.

# The config function is called in the 'Play' state.
 */

'use strict';

var KeyboardMovementBehaviour = (function () {
    var state = {
        name: 'keyboardMovement',

        attribs: {
        	speed: 48,
            right: 'D',
            down: 'S',
            left: 'A',
            up: 'W'
        },

        updateMethods: {
            
        },

        methods: {
            configureMovementControls: function (config) {
                /*
                The config object looks like this:
                {
	                speed: 96,
	                right: 'RIGHT',
	                down: 'DOWN',
	                left: 'LEFT',
	                up: 'UP'
                }
                In this example the player uses the arrow controls for movement and has a speed of 96.
                 */
                this.state.keyboardMovement.right = config.right || 'D';
                this.state.keyboardMovement.down = config.down || 'S';
                this.state.keyboardMovement.left = config.left || 'A';
                this.state.keyboardMovement.up = config.up || 'W';
                this.state.keyboardMovement.speed = config.speed || 48;
            },

            keySignalListener: function (keypressSignal) {
            	/*
            	The keypressSignal looks like this:
            	{
	                direction: {
	                    x: 0,
	                    y: 1
	                }
            	}
            	In this example the signal instructs the player to move downwards.
            	 */
                this.body.velocity.x = keypressSignal.direction.x * this.state.keyboardMovement.speed;
                this.body.velocity.y = keypressSignal.direction.y * this.state.keyboardMovement.speed;
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

module.exports = KeyboardMovementBehaviour;


