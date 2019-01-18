const basePath = '/assets/';
module.exports = {
    SPRITE_ATLAS_ID: "MASTER SPRITESHEET",
    SPRITE_ATLAS_IMAGE: basePath + 'eldritch-night-spritesheet.png',
    SPRITE_ATLAS_JSON: basePath + 'eldritch-night-spritesheet.json',
    BASE_PATH: basePath,
    TILES: {
        PLATFORM: {
            LEFT: "platform-left.png",
            RIGHT: "platform-right.png",
            CENTER: "platform-center.png",
        },
        GROUND: {
            LEFT: "ground-left.png",
            RIGHT: "ground-right.png",
            CENTER: "ground-center.png"
        },
        UNDERPASS: {
            CENTER: "underpass-center.png",
            TOP_LEFT: "underpass-top-left.png",
            TOP_RIGHT: "underpass-top-right.png",
            BOTTOM_LEFT: "underpass-bottom-left.png",
            BOTTOM_RIGHT: "underpass-bottom-right.png"
        }
    }
};

