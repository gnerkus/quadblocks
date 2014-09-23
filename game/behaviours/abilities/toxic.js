'use strict';

var ToxicBehaviour  = (function () {

    var state = {
        name: 'toxic',

        attribs: {

        },

        updateMethods: {

        },

        methods: {
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
            
        }
    };

    return state;
}());

module.exports = ToxicBehaviour;