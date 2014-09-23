'use strict';

var TargetBehaviour  = (function () {

    var state = {
        name: 'target',

        attribs: {

        },

        updateMethods: {

        },

        methods: {

        },

        behaviour: {

        },

        handler: function (instruction) {
        	this[instruction.action](instruction.value);
        }
    };

    return state;
}());

module.exports = TargetBehaviour;