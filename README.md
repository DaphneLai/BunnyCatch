# BunnyCatch
Used for CS105 final project. Created with P5.js in Processing IDE.

INSTRUCTIONS
 Welcome to my little game called "Bunny, Catch!" or "Bunny Catch". 
 --
 Home State:
 You'll begin at the home screen. 
 On the home screen, three buttons will sit below the game title. 'Play' starts the actual game, 'i' stand for
 information/instruction screen, and the pink button turns sound on or off. As your mouse hovers over
 a button, the image will change to look like it's concaving. Also, the sound button is there for looks. THERE IS NO SOUND IN THE GAME. 
 sound. When you click play you will enter the game stat where you will be controlling a white patched brown bunny named Gozu Jr. 
 --
 Instructions State:
 This state does the same thing I am doing here but much more concise. In the bottom right corner of the page will be a button
 to return to the home page. Any rectangular button will have full opacity when the mouse hovers over it. Otherwise, the 
 opacity sits at about 20%.
 --
 Play State:
 In this state, there will be a red bar slowly moving at the top of the screen to indicate time remaining. On the top
 left corner of the screen will be your score and how many you have left to collect. The op right corner has a button 
 to exit the game.
 
 Controls:
 Gozu Jr. will be hopping left to right/right to left along the bottom of the canvas. You can change the bunny's 
 direction by using your two arrow keys; left (<) and right (>). Here's the trick, the keys are inverted. Therefore, 
 if you want to move LEFT you hit the (>) key and if you wish to move RIGHT you hit the (<) key. I did this because
 the objective of the game is simple and this rule will make it harder to achieve that goal. 
 
 Game Objective:
 So what is the goal for the game? Simple. There will be three types of falling objects that you can 'catch' by being
 under them as they hit Guzo Jr. 
 There will be five green food pellets; you need to catch 10 overall to win the game.
 In addition will be two carrots and two cookies moving from the top of the canvas to the bottom. 
 If you catch a carrot, you will speed up for a limited amount of time (boost).
 If you catch a cookie, you will become really slow (because cookies are not healthy for bunnies, and Gozu Jr. gets
 a stomachache) for a limited amount of time.
 You will have 30 seconds to clear the game.
 --
 Game Over State:
 When you reach 30 seconds, or collected 10 food pellets, you will be sent to the game over screen that consoles or
 congratulates you respectively. Then, you will be given the option to play again ('sure!'), or return to the home 
 screen ('no.').
 
 That's it! Have fun :D
