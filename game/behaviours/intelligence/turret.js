'use strict';

var TurretBehaviour  = (function () {

    var state = {
        name: 'turret',

        attribs: {
            radarSize: 1,
            radar: null,
            action: null
        },

        updateMethods: {

        },

        methods: {
            createRadar: function (spriteKey) {
                var radar = this.game.add.sprite(this.x, this.y, spriteKey);
                radar.anchor.setTo(0.5, 0.5);
                radar.scale.setTo(this.state.turret.radarSize, this.state.turret.radarSize);
                this.game.physics.arcade.enable(radar);

                this.state.turret.radar = radar;
                this.state.turret.radar.turret = this;
            },

            setRadarSize: function (scale) {
                this.state.turret.radarSize = scale;
            },

            triggerAction: function (isActive, targetEntity) {
                this[this.state.turret.action](isActive, targetEntity);
            },

            setTurretAction: function (action) {
                this.state.turret.action = action;
            }
        },

        behaviour: {

        },

        handler: function (instruction) {
            var activate = instruction.activate;
            var target = instruction.target;

            this.triggerAction(activate, target);
        }
    };

    return state;
}());

module.exports = TurretBehaviour;