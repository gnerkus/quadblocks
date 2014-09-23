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
            },

            setDamage: function (damage) {
                this.publicState.target.value = damage;
            }
        },

        behaviour: {
            'target': {
                action: 'damage',
                value: null
            }
        },

        handler: function (instruction) {
            return;
        }
    };

    return state;
}());

module.exports = BulletBehaviour;