PRIMARY TASKS
=============================================================================

+ Encapsulate 'player-follow' functionality in a behaviour
+ Create an enemy prefab. The prefab should have the 'player-follow' behaviour.
+ Encapsulate 'target' functionality in a behaviour. The target  behaviour defines an object that can be attacked.
+ Add target attributes to the 'bullet' and 'follow' behaviours' publicStates.
+ Add the 'target' behaviour to the player prefab.
+ Add collision handlers for player-enemy and bullet-enemy to the Play state.
+ Test (the player should receive damage on collision with enemies. Enemies should receive damage from bullets).


SECONDARY TASKS
-------------------------------------------------------------------------------------------
+ The player should be able to fire secondary bullets when right-click is engaged.
+ The rate of fire for the primary weapon should be higher than that of the secondary weapon.
+ Enemies should be spawned randomly from four different locations and should move towards the player.




## COMPLETED TASKS ##

**scratching the game mechanic

1 The player should be able to shoot when left-click is engaged.
2 The player should move when WASD keys are pressed.
3 Create images for:
    - The player (a white square 48x48).
    - The bullet for the primary weapon (a small green square 8x8)
    - The bullet for the secondary weapon (a small blue square 16x16)
    - An enemy (a red square 64x64)
    - Enemy particles (a small red square 8x8)
4 Enemies should explode into particles when shot.
5 Encapsulate the movement functionality into a behaviour object.
6 Encapsulate the shooting functionality into a behaviour object.
7 Create a prefab for the player.
8 Encapsulate the bullet functionality into a behaviour object.
9 Create a prefab for the bullet.
10 Add the movement and shooting behaviours to the player prefab.
11 Test (the player movement should be controlled via keyboard. The player must always face the cursor. The player should be able to shoot in the direction it's facing).