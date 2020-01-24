import { _SoundEvent } from "../audio/SoundEvent";
import { _SoundEvents } from "../audio/SoundEvents";

export class _SoundType {
    _volume: number;
    _pitch: number;
    _breakSound: _SoundEvent;
    _stepSound: _SoundEvent;
    _placeSound: _SoundEvent;
    _hitSound: _SoundEvent;
    _fallSound: _SoundEvent;
    public constructor(volume: number, pitch: number, breakSound: _SoundEvent, stepSound: _SoundEvent, placeSound: _SoundEvent, hitSound: _SoundEvent, fallSound: _SoundEvent){
        this._volume = volume
        this._pitch = pitch
        this._breakSound = breakSound
        this._stepSound = stepSound
        this._placeSound = placeSound
        this._hitSound = hitSound
        this._fallSound = fallSound
    }
    
    public static _WOOD = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_WOOD_BREAK, _SoundEvents._BLOCK_WOOD_STEP, _SoundEvents._BLOCK_WOOD_PLACE, _SoundEvents._BLOCK_WOOD_HIT, _SoundEvents._BLOCK_WOOD_FALL);
    public static _GROUND = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_GRAVEL_BREAK, _SoundEvents._BLOCK_GRAVEL_STEP, _SoundEvents._BLOCK_GRAVEL_PLACE, _SoundEvents._BLOCK_GRAVEL_HIT, _SoundEvents._BLOCK_GRAVEL_FALL);
    public static _PLANT = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_GRASS_BREAK, _SoundEvents._BLOCK_GRASS_STEP, _SoundEvents._BLOCK_GRASS_PLACE, _SoundEvents._BLOCK_GRASS_HIT, _SoundEvents._BLOCK_GRASS_FALL);
    public static _STONE = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_STONE_BREAK, _SoundEvents._BLOCK_STONE_STEP, _SoundEvents._BLOCK_STONE_PLACE, _SoundEvents._BLOCK_STONE_HIT, _SoundEvents._BLOCK_STONE_FALL);
    public static _METAL = new _SoundType(1.0, 1.5, _SoundEvents._BLOCK_METAL_BREAK, _SoundEvents._BLOCK_METAL_STEP, _SoundEvents._BLOCK_METAL_PLACE, _SoundEvents._BLOCK_METAL_HIT, _SoundEvents._BLOCK_METAL_FALL);
    public static _GLASS = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_GLASS_BREAK, _SoundEvents._BLOCK_GLASS_STEP, _SoundEvents._BLOCK_GLASS_PLACE, _SoundEvents._BLOCK_GLASS_HIT, _SoundEvents._BLOCK_GLASS_FALL);
    public static _CLOTH = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_WOOL_BREAK, _SoundEvents._BLOCK_WOOL_STEP, _SoundEvents._BLOCK_WOOL_PLACE, _SoundEvents._BLOCK_WOOL_HIT, _SoundEvents._BLOCK_WOOL_FALL);
    public static _SAND = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_SAND_BREAK, _SoundEvents._BLOCK_SAND_STEP, _SoundEvents._BLOCK_SAND_PLACE, _SoundEvents._BLOCK_SAND_HIT, _SoundEvents._BLOCK_SAND_FALL);
    public static _SNOW = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_SNOW_BREAK, _SoundEvents._BLOCK_SNOW_STEP, _SoundEvents._BLOCK_SNOW_PLACE, _SoundEvents._BLOCK_SNOW_HIT, _SoundEvents._BLOCK_SNOW_FALL);
    public static _LADDER = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_LADDER_BREAK, _SoundEvents._BLOCK_LADDER_STEP, _SoundEvents._BLOCK_LADDER_PLACE, _SoundEvents._BLOCK_LADDER_HIT, _SoundEvents._BLOCK_LADDER_FALL);
    public static _ANVIL = new _SoundType(0.3, 1.0, _SoundEvents._BLOCK_ANVIL_BREAK, _SoundEvents._BLOCK_ANVIL_STEP, _SoundEvents._BLOCK_ANVIL_PLACE, _SoundEvents._BLOCK_ANVIL_HIT, _SoundEvents._BLOCK_ANVIL_FALL);
    public static _SLIME = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_SLIME_BLOCK_BREAK, _SoundEvents._BLOCK_SLIME_BLOCK_STEP, _SoundEvents._BLOCK_SLIME_BLOCK_PLACE, _SoundEvents._BLOCK_SLIME_BLOCK_HIT, _SoundEvents._BLOCK_SLIME_BLOCK_FALL);
    public static _WET_GRASS = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_WET_GRASS_BREAK, _SoundEvents._BLOCK_WET_GRASS_STEP, _SoundEvents._BLOCK_WET_GRASS_PLACE, _SoundEvents._BLOCK_WET_GRASS_HIT, _SoundEvents._BLOCK_WET_GRASS_FALL);
    public static _CORAL = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_CORAL_BLOCK_BREAK, _SoundEvents._BLOCK_CORAL_BLOCK_STEP, _SoundEvents._BLOCK_CORAL_BLOCK_PLACE, _SoundEvents._BLOCK_CORAL_BLOCK_HIT, _SoundEvents._BLOCK_CORAL_BLOCK_FALL);
    public static _BAMBOO = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_BAMBOO_BREAK, _SoundEvents._BLOCK_BAMBOO_STEP, _SoundEvents._BLOCK_BAMBOO_PLACE, _SoundEvents._BLOCK_BAMBOO_HIT, _SoundEvents._BLOCK_BAMBOO_FALL);
    public static _BAMBOO_SAPLING = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_BAMBOO_SAPLING_BREAK, _SoundEvents._BLOCK_BAMBOO_STEP, _SoundEvents._BLOCK_BAMBOO_SAPLING_PLACE, _SoundEvents._BLOCK_BAMBOO_SAPLING_HIT, _SoundEvents._BLOCK_BAMBOO_FALL);
    public static _SCAFFOLDING = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_SCAFFOLDING_BREAK, _SoundEvents._BLOCK_SCAFFOLDING_STEP, _SoundEvents._BLOCK_SCAFFOLDING_PLACE, _SoundEvents._BLOCK_SCAFFOLDING_HIT, _SoundEvents._BLOCK_SCAFFOLDING_FALL);
    public static _SWEET_BERRY_BUSH = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_SWEET_BERRY_BUSH_BREAK, _SoundEvents._BLOCK_GRASS_STEP, _SoundEvents._BLOCK_SWEET_BERRY_BUSH_PLACE, _SoundEvents._BLOCK_GRASS_HIT, _SoundEvents._BLOCK_GRASS_FALL);
    public static _CROP = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_CROP_BREAK, _SoundEvents._BLOCK_GRASS_STEP, _SoundEvents._ITEM_CROP_PLANT, _SoundEvents._BLOCK_GRASS_HIT, _SoundEvents._BLOCK_GRASS_FALL);
    public static _STEM = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_WOOD_BREAK, _SoundEvents._BLOCK_WOOD_STEP, _SoundEvents._ITEM_CROP_PLANT, _SoundEvents._BLOCK_WOOD_HIT, _SoundEvents._BLOCK_WOOD_FALL);
    public static _NETHER_WART = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_NETHER_WART_BREAK, _SoundEvents._BLOCK_STONE_STEP, _SoundEvents._ITEM_NETHER_WART_PLANT, _SoundEvents._BLOCK_STONE_HIT, _SoundEvents._BLOCK_STONE_FALL);
    public static _LANTERN = new _SoundType(1.0, 1.0, _SoundEvents._BLOCK_LANTERN_BREAK, _SoundEvents._BLOCK_LANTERN_STEP, _SoundEvents._BLOCK_LANTERN_PLACE, _SoundEvents._BLOCK_LANTERN_HIT, _SoundEvents._BLOCK_LANTERN_FALL);
    

}
