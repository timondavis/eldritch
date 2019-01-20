import '../style/style.scss';

let Phaser = require('phaser');
let LoadingScene = require('./Game/Scene/Loading.scene');
let PlatformScene = require('./Game/Scene/Platform.scene');

let loadingScene = new LoadingScene('Loading');
let platformScene  = new PlatformScene('Platform');

console.log(loadingScene);


let game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [loadingScene, platformScene],
    pixelArt: true,
    backgroundColor: '9955cc',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700, x: 0 },
            debug: true
        }
    }
});



