import { _GoImage } from "../client/imageutil/GoImage";

import { _Block } from "./Block";
import { _BlockProperties } from "./BlockProperties";
import { _Effects } from "./Effects";

export class _AirBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._hasModel = false;
    }
}
export class _SnowyDirtBlock extends _Block {
    constructor(proto: number, prop: _BlockProperties) {
        super(prop);
        if(proto >= 480){
            this._states = 2;
        }
    }
}
export class _GrassBlock extends _SnowyDirtBlock {
    public static _grassBuffer: number[] = new Array(65536);

    constructor(proto: number, prop: _BlockProperties) {
        super(proto, prop);

        /*
        this._textureCallback = function (img: _GoImage) {
            const w = img._rect._dx();
            const h = img._rect._dy();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    const i = img._pixOffset(x, y);
                    img._pixels[i + 0] = Math.floor(img._pixels[i + 0] * 0.4);
                    img._pixels[i + 1] = Math.floor(img._pixels[i + 1] * 0.8);
                    img._pixels[i + 2] = Math.floor(img._pixels[i + 2] * 0.3);
                }
            }
        };*/
    }
    public _textureName() {
        return "grass_block_top";
    }

    public getGrassColor(temperature: number, humidity: number) {
        humidity = humidity * temperature;
        const i = Math.floor((1 - temperature) * 255);
        const j = Math.floor((1 - humidity) * 255);
        const k = (j << 8) | i;

        return k > _GrassBlock._grassBuffer.length ? -65281 : _GrassBlock._grassBuffer[k];
    }
}
export class _StoneBlock extends _Block {

}

export class _SaplingBlock extends _Block {
    public _tree: _Tree;
    constructor(proto: number, tree: _Tree, prop: _BlockProperties) {
        super(prop);
        if(proto >= 480){
            this._states = 2;
        }
        this._tree = tree;
    }
}
export class _EmptyDropsBlock extends _Block {

}
export class _SandBlock extends _Block {
    public _color: number;
    constructor(color: number, prop: _BlockProperties) {
        super(prop);
        this._color = color;

    }
}
export class _GravelBlock extends _Block {

}
export class _OreBlock extends _Block {

}
export class _RotatedPillarBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        //this._setStateExponent(2);
        this._states = 3;


    }
}
export class _LogBlock extends _RotatedPillarBlock {
    public _matColorDuplicate: number;
    constructor(matColorDup: number, prop: _BlockProperties) {
        super(prop);
        this._matColorDuplicate = matColorDup;

    }
}
export class _Tree {

}
export class _OakTree extends _Tree {

}
export class _SpruceTree extends _Tree {

}
export class _BirchTree extends _Tree {

}
export class _JungleTree extends _Tree {

}
export class _AcaciaTree extends _Tree {

}
export class _DarkOakTree extends _Tree {

}

export enum _Fluids {
    _WATER,
    _LAVA
}
export class _FlowingFluidBlock extends _Block {
    public _fluidType: _Fluids;

    constructor(proto: number, fluidType: _Fluids, prop: _BlockProperties) {
        super(prop);
        this._fluidType = fluidType;
        this._states = 16;
    }
}

export class _LeavesBlock extends _Block {
    constructor(proto: number, prop: _BlockProperties) {
        super(prop);
        this._states = 2*7;
        /*
        this._textureCallback = function (img: _GoImage) {
            const w = img._rect._dx();
            const h = img._rect._dy();
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    const i = img._pixOffset(x, y);
                    img._pixels[i + 0] = Math.floor(img._pixels[i + 0] * 0.4);
                    img._pixels[i + 1] = Math.floor(img._pixels[i + 1] * 0.8);
                    img._pixels[i + 2] = Math.floor(img._pixels[i + 2] * 0.3);

                    if (img._pixels[i + 3] < 10) { img._pixels[i + 3] = 255; }
                }
            }
        };*/
    }
}

export class _SpongeBlock extends _Block {

}
export class _WetSpongeBlock extends _SpongeBlock {

}
export class _GlassBlock extends _Block {

}
export class _DispenserBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _NoteBlock extends _Block {
    constructor(proto: number, prop: _BlockProperties) {
        super(prop);
        this._states = 16*2*25;
    }
}
export class _PoweredRailBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _DetectorRailBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _DirectionalBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6;
    }
}
export class _PistonBlock extends _DirectionalBlock {
    public _isSticky: boolean;
    constructor(sticky: boolean, prop: _BlockProperties) {
        super(prop);
        this._isSticky = sticky;
        this._states *= 2;
    }
}


export class _BlockWeb extends _Block {

}
export class _BlockPistonExtension extends _DirectionalBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states *= 2*2;
    }
}
export class _MovingPistonBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _FlowerBlock extends _Block {
    constructor(effect: _Effects, duration: number, prop: _BlockProperties) {
        super(prop);

    }
}
export class _WitherRoseBlock extends _Block {
    constructor(effect: _Effects, prop: _BlockProperties) {
        super(prop);
    }
}
export class _MushroomBlock extends _Block {

}
export class _TNTBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _BookshelfBlock extends _Block {

}

export class _TorchBlock extends _Block {

}
export class _WallTorchBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}

export class _FireBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 16*2*2*2*2*2;
    }
}
export class _MobSpawnerBlock extends _Block {

}
export class _StairsBlock extends _Block {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
        this._states = 4*2*5*2;
    }
}

export class _ChestBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*3*2;
    }
}
export class _RedstoneWireBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(3, 4)*16;
    }
}

export class _WorkbenchBlock extends _Block {

}
export class _CropsBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 8;
    }
}
export class _FarmlandBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 8;
    }
}
export class _AbstractFurnaceBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _FurnaceBlock extends _AbstractFurnaceBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}

export class _StandingSignBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 16*2;
    }
}
export class _DoorBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*2*2*2;
    }
}
export class _LadderBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _RailBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 10;
    }
}


export class _WallSignBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _LeverBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 3*4*2;
    }
}
export enum _PressureSensitivity {
    _MOBS,
    _EVERYTHING
}
export class _PressurePlateBlock extends _Block {
    public _sensitivity: _PressureSensitivity;

    constructor(sensitivity: _PressureSensitivity, prop: _BlockProperties) {
        super(prop);
        this._sensitivity = sensitivity;
        this._states = 2;
    }

}

export class _RedstoneOreBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _RedstoneTorchBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _WallRedstoneTorchBlock extends _RedstoneTorchBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _AbstractButtonBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*3;
    }
}
export class _StoneButtonBlock extends _AbstractButtonBlock {

}
export class _SnowLayerBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 8;
    }
}
export class _IceBlock extends _Block {

}
export class _SnowBlock extends _Block {
    public _textureName() {
        return "snow";
    }
}
export class _CactusBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 16;
    }
}

export class _ClayBlock extends _Block {

}
export class _SugarCaneBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 16;
    }
}
export class _JukeboxBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}

export class _FenceBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(2, 4)*2;
    }
}
export class _PumpkinBlock extends _Block {

}
export class _NetherrackBlock extends _Block {

}
export class _SoulSandBlock extends _Block {

}

export class _GlowstoneBlock extends _Block {

}
export class _PortalBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _CarvedPumpkinBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _CakeBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 7;
    }
}
export class _RedstoneDiodeBlock extends _Block {

}
export class _RepeaterBlock extends _RedstoneDiodeBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*4*2*2;
    }
}
export class _TrapDoorBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*2*2*2;
    }
}
export class _SilverfishBlock extends _Block {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _HugeMushroomBlock extends _Block {
    public _parent: _Block | null;
    constructor(parent: _Block | null, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
        this._states = Math.pow(2, 6);
    }

}
export class _PaneBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(2, 4)*2;
    }
}

export class _GlassPaneBlock extends _PaneBlock {

}

export class _MelonBlock extends _Block {

}
export class _StemBlock extends _Block {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
        this._states = 8;
    }
}
export class _AttachedStemBlock extends _Block {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
        this._states = 4;
    }
}
export class _VineBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(2, 5);
    }
}
export class _FenceGateBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*2*2;
    }
}
export class _MyceliumBlock extends _SnowyDirtBlock {

}
export class _LilyPadBlock extends _Block {

}
export class _NetherWartBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _EnchantmentTableBlock extends _Block {

}
export class _BrewingStandBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(2, 3);
    }
}
export class _CauldronBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}

export class _EndPortalBlock extends _Block {

}
export class _EndPortalFrameBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _DragonEggBlock extends _Block {

}
export class _RedstoneLampBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}

export class _CocoaBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*3;
    }
}
export class _EnderChestBlock extends _ChestBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _TripWireBlock extends _Block {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
        this._states = 2*2*2*Math.pow(2, 4);
    }
}
export class _TripWireHookBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*2;
    }
}
export class _CommandBlockBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _BeaconBlock extends _Block {

}
export class _WallBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(2, 5)*2;
    }
}
export class _FlowerPotBlock extends _Block {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _CarrotBlock extends _CropsBlock {

}
export class _PotatoBlock extends _CropsBlock {

}
export class _WoodButtonBlock extends _AbstractButtonBlock {

}

export class _SkullBlock extends _Block {
    public static _Types = {
        _SKELETON: 0,
        _WITHER: 1,
        _ZOMBIE: 2,
        _PLAYER: 3,
        _CREEPER: 4,
        _DRAGON: 5,
    };
    public _stype: number;
    constructor(stype: number, prop: _BlockProperties) {
        super(prop);
        this._stype = stype;
        this._states = 16;
    }
}
export class _WallSkullBlock extends _SkullBlock {
    constructor(stype: number, prop: _BlockProperties) {
        super(stype, prop);
        this._states = 4;
    }
}

export class _WitherSkullBlock extends _SkullBlock {
    constructor(prop: _BlockProperties) {
        super(_SkullBlock._Types._WITHER, prop);
    }
}
export class _WitherWallSkullBlock extends _WallSkullBlock {
    constructor(prop: _BlockProperties) {
        super(_SkullBlock._Types._WITHER, prop);
    }
}
export class _PlayerSkullBlock extends _SkullBlock {
    constructor(prop: _BlockProperties) {
        super(_SkullBlock._Types._PLAYER, prop);
    }
}
export class _PlayerWallSkullBlock extends _WallSkullBlock {
    constructor(prop: _BlockProperties) {
        super(_SkullBlock._Types._PLAYER, prop);
    }
}

export class _BlockAnvil extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _TrappedChestBlock extends _ChestBlock {

}
export class _WeightedPressurePlateBlock extends _PressurePlateBlock {
    constructor(sensitivity: number, prop: _BlockProperties) {
        super(sensitivity, prop);
        this._states = 16;
    }
}

export class _BlockRedstoneComparator extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*2;
    }
}

export class _BlockDaylightDetector extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 16*2;
    }
}
export class _BlockRedstone extends _Block {
    
}
export class _BlockHopper extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 5*2;
    }
}



export class _BlockDropper extends _DispenserBlock {

}
export class _StainedGlassPaneBlock extends _PaneBlock {
    public _dyeColor: number;
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(prop);
        this._dyeColor = dyeColor;
    }
}
export class _StainedGlassBlock extends _Block {
    public _dyeColor: number;
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(prop);
        this._dyeColor = dyeColor;
    }
}

export class _SlimeBlock extends _Block {

}
export class _BarrierBlock extends _Block {

}

export class _SeaLanternBlock extends _Block {

}
export class _HayBlock extends _RotatedPillarBlock {

}
export class _BlockCarpet extends _Block {
    public _dyeColor: number;
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(prop);
        this._dyeColor = dyeColor;
    }
}

export class _BlockPackedIce extends _Block {

}
export class _BushBlock extends _Block {

}
export class _DoublePlantBlock extends _BushBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _BlockTallFlower extends _DoublePlantBlock {

}
export class _BlockShearableDoublePlant extends _DoublePlantBlock {
    public _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _SlabBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 3*2;
    }
}
export class _BedBlock extends _Block {
    public _dyeColor: number;
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(prop);
        this._dyeColor = dyeColor;
        this._states = 4*2*2;
    }
}


export class _SeaGrassBlock extends _BushBlock {

}
export class _TallSeaGrassBlock extends _DoublePlantBlock {

}
export class _DeadBushBlock extends _BushBlock {

}

export class _GrassBushBlock extends _BushBlock {

}
export class _FernBushBlock extends _BushBlock {

}
export class _BannerBlock extends _Block {
    public _dyeColor: number;
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(prop);
        this._dyeColor = dyeColor;
        this._states = 16;
    }
}
export class _WallBannerBlock extends _BannerBlock {
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(dyeColor, prop);
        this._states = 4;
    }
}
export class _EndRodBlock extends _DirectionalBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _ChorusPlantBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = Math.pow(2, 6);
    }
}
export class _ChorusFlowerBlock extends _Block {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
        this._states = 6;
    }
}
export class _BeetrootBlock extends _CropsBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _GrassPathBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);

    }
}
export class _EndGatewayBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);

    }
}
export class _FrostedIceBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _MagmaBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);

    }
}
export class _StructureVoidBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);

    }
}
export class _ObserverBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _ShulkerBoxBlock extends _Block {
    _dyeColor: number;
    constructor(dyeColor: number, prop: _BlockProperties) {
        super(prop);
        this._dyeColor = dyeColor;
        this._states = 6;
    }
}
export class _GlazedTerracottaBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _ConcretePowderBlock extends _Block {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _KelpTopBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 26;
    }
}
export class _KelpBlock extends _Block {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._states = 1;
        this._parent = parent;
    }
}
export class _TurtleEggBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 3*4;
    }
}
export class _CoralBlock extends _Block {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _AbstractCoralPlantBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _DeadCoralPlantBlock extends _AbstractCoralPlantBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _CoralPlantBlock extends _AbstractCoralPlantBlock {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _DeadCoralFanBlock extends _AbstractCoralPlantBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _CoralFanBlock extends _DeadCoralFanBlock {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}

export class _DeadCoralWallFanBlock extends _DeadCoralFanBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _CoralWallFanBlock extends _DeadCoralWallFanBlock {
    _parent: _Block;
    constructor(parent: _Block, prop: _BlockProperties) {
        super(prop);
        this._parent = parent;
    }
}
export class _SeaPickleBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2;
    }
}
export class _BreakableBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _ConduitBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _BambooSaplingBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _BambooBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2*3*2;
    }
}
export class _BubbleColumnBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _ScaffoldingBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 8*2*2;
    }
}
export class _LoomBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _BarrelBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 6*2;
    }
}
export class _SmokerBlock extends _AbstractFurnaceBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _BlastFurnaceBlock extends _AbstractFurnaceBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _CartographyTableBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _FletchingTableBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _GrindstoneBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 3*4;
    }
}
export class _LecternBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*2*2;
    }
}
export class _SmithingTableBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
    }
}
export class _StonecutterBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _BellBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4*4;
    }
}
export class _LanternBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2;
    }
}
export class _CampfireBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 2*2*2*4;
    }
}
export class _SweetBerryBushBlock extends _BushBlock {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}

export class _StructureBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _JigsawBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 4;
    }
}
export class _ComposterBlock extends _Block {
    constructor(prop: _BlockProperties) {
        super(prop);
        this._states = 9;
    }
}