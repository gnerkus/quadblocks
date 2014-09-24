'use strict';

var TriggerBehaviour  = (function () {

    var state = {
        name: 'trigger',

        attribs: {

        },

        updateMethods: {

        },

        methods: {
            setTrigger: function () {
                this.publicState.turret.target = this;
            }
        },

        behaviour: {
            'turret': {
                activate: true,
                target: null
            }
        },

        handler: function (instruction) {
        }
    };

    return state;
}());

module.exports = TriggerBehaviour;