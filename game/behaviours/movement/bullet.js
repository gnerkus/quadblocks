'use strict';

var BulletBehaviour = (function () {
    var state = {
        name: 'bullet',

        attribs: {
            
        },

        updateMethods: {
            
        },

        methods: {
            fireBullet: function (x, y, rotation) {
                this.reset(x, y);
                this.rotation = rotation;
                this.body.velocity.x = Math.cos(this.rotation) * this.bulletProperties.speed;
                this.body.velocity.y = Math.sin(this.rotation) * this.bulletProperties.speed;
            }
        },

        behaviour: {
            'target': {
                
            }
        },

        handler: function (instruction) {
            return;
        }
    };

    return state;
}());

module.exports = BulletBehaviour;