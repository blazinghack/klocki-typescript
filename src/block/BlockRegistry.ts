import { _TextureManager } from "../client/txt/TextureManager";

import { _MaterialColor } from "./MaterialColor";
import { _Block } from "./Block";
import { _AcaciaTree, _BirchTree,  _BlockAnvil, _AttachedStemBlock, _BarrierBlock, _BeaconBlock, _BrewingStandBlock as _BrewingStandBlock, _WoodButtonBlock, _BlockCarpet, _CarrotBlock, _CauldronBlock as _CauldronBlock, _CocoaBlock as _CocoaBlock, _CommandBlockBlock,  _BlockDaylightDetector, _DeadBushBlock, _DispenserBlock,  _DragonEggBlock as _DragonEggBlock, _BlockDropper, _EmptyDropsBlock, _EnchantmentTableBlock as _EnchantmentTableBlock, _EnderChestBlock as _EnderChestBlock, _EndPortalBlock as _EndPortalBlock, _EndPortalFrameBlock as _EndPortalFrameBlock,  _FenceGateBlock, _FlowerPotBlock, _FlowingFluidBlock, _GlassBlock, _GlassPaneBlock, _GravelBlock, _HayBlock, _BlockHopper, _HugeMushroomBlock,  _LeavesBlock,  _LilyPadBlock as _LilyPadBlock, _LogBlock, _MelonBlock, _MyceliumBlock, _NetherWartBlock as _NetherWartBlock, _NoteBlock, _OreBlock, _BlockPackedIce, _PaneBlock, _PistonBlock, _BlockPistonExtension, _PotatoBlock,  _WeightedPressurePlateBlock, _DetectorRailBlock, _PoweredRailBlock, _BlockRedstone, _BlockRedstoneComparator, _RedstoneLampBlock as _RedstoneLampBlock, _RotatedPillarBlock, _SandBlock, _SeaLanternBlock, _BlockShearableDoublePlant, _SilverfishBlock, _SkullBlock, _PlayerSkullBlock, _PlayerWallSkullBlock, _WallSkullBlock, _WitherSkullBlock, _WitherWallSkullBlock, _SlabBlock, _SlimeBlock, _SpongeBlock, _StainedGlassPaneBlock,  _StemBlock, _BlockTallFlower, _TrapDoorBlock,  _TripWireBlock as _TripWireBlock, _TripWireHookBlock as _TripWireHookBlock, _VineBlock, _WallBlock, _BlockWeb, _WetSpongeBlock,  _DarkOakTree, _Fluids, _JungleTree, _OakTree, _PressureSensitivity, _SpruceTree, _SaplingBlock, _AirBlock, _StoneBlock, _GrassBlock, _SnowyDirtBlock, _BedBlock, _SeaGrassBlock, _TallSeaGrassBlock, _GrassBushBlock, _FernBushBlock, _MovingPistonBlock, _FlowerBlock, _WitherRoseBlock, _TNTBlock, _BookshelfBlock, _TorchBlock, _WallTorchBlock, _MushroomBlock, _FireBlock, _MobSpawnerBlock, _StairsBlock, _ChestBlock, _RedstoneWireBlock, _TrappedChestBlock, _WorkbenchBlock, _CropsBlock, _FarmlandBlock, _FurnaceBlock, _StandingSignBlock, _DoorBlock, _LadderBlock, _RailBlock, _WallSignBlock, _LeverBlock, _PressurePlateBlock, _RedstoneOreBlock, _RedstoneTorchBlock, _WallRedstoneTorchBlock, _SnowLayerBlock, _IceBlock, _SnowBlock, _CactusBlock, _ClayBlock, _JukeboxBlock, _StoneButtonBlock, _SugarCaneBlock, _FenceBlock, _PumpkinBlock, _SoulSandBlock, _GlowstoneBlock, _PortalBlock as _NetherPortalBlock, _CarvedPumpkinBlock, _CakeBlock, _RedstoneDiodeBlock, _RepeaterBlock, _StainedGlassBlock, _BannerBlock, _WallBannerBlock, _EndRodBlock, _ChorusPlantBlock, _ChorusFlowerBlock, _BeetrootBlock, _GrassPathBlock, _EndGatewayBlock, _FrostedIceBlock, _MagmaBlock, _StructureVoidBlock, _ObserverBlock, _ShulkerBoxBlock, _GlazedTerracottaBlock, _ConcretePowderBlock, _KelpTopBlock, _KelpBlock, _TurtleEggBlock, _CoralBlock, _DeadCoralPlantBlock, _DeadCoralFanBlock, _CoralFanBlock, _DeadCoralWallFanBlock, _CoralWallFanBlock, _SeaPickleBlock, _BreakableBlock, _ConduitBlock, _BambooSaplingBlock, _BambooBlock, _BubbleColumnBlock, _ScaffoldingBlock, _LoomBlock, _BarrelBlock, _SmokerBlock, _BlastFurnaceBlock, _CartographyTableBlock, _FletchingTableBlock, _GrindstoneBlock, _LecternBlock, _SmithingTableBlock, _StonecutterBlock, _BellBlock, _LanternBlock, _CampfireBlock, _SweetBerryBushBlock, _StructureBlock, _JigsawBlock, _ComposterBlock, _CoralPlantBlock } from "./Blocks";
import { _Material } from "./Material";
import { _BlockProperties } from "./BlockProperties";
import { _LegacyBlockDataMap } from "./LegacyBlockDataMap";
import { _SoundType } from "./SoundType";
import { _BlockModel } from "./model/Model";
import { _ModelRegistry } from "./model/ModelRegistry";
import { _BlocksHelper } from "./BlocksHelper";
import { _DyeColor } from "./DyeColor";
import { _Effects } from "./Effects";

export class _BlockRegistry {
    public _blocksByLegacyId: _LegacyBlockDataMap[];
    public _blocksByNameOrder: _Block[];
    public _blocksByName: Map<string, _Block>;
    public _currentNameOrderIndex: number;
    public _textureManager: _TextureManager | null;
    public _modelRegistry: _ModelRegistry;
    public _helper!: _BlocksHelper;
    public _globalPalette: _Block[];
    public _currentGlobalPaletteIndex: number;
    public _globalPaletteOpaque: Uint8Array;
    public _globalPaletteSize: number;

    constructor(textureManager: _TextureManager | null, models: _ModelRegistry) {
        this._textureManager = textureManager;
        this._blocksByLegacyId = Array(256);
        this._blocksByNameOrder = Array(1024*16);
        this._blocksByName = new Map<string, _Block>();
        this._currentNameOrderIndex = 0;
        this._modelRegistry = models;
        this._globalPaletteSize = 1024*16;
        this._globalPalette = new Array(this._globalPaletteSize);
        this._globalPaletteOpaque = new Uint8Array(this._globalPaletteSize);
        this._currentGlobalPaletteIndex = 0;
    }

    public _registerBlock(legacyId: number, legacyData: number, name: string, blockTypeInstance: _Block): void {
        blockTypeInstance._name = name;
        this._blocksByName.set(name, blockTypeInstance);
        this._blocksByNameOrder[this._currentNameOrderIndex++] = blockTypeInstance;

        if(legacyId >= 0){
            let legacyBDM: _LegacyBlockDataMap = this._blocksByLegacyId[legacyId];
            if (legacyBDM === undefined) {
                legacyBDM = new _LegacyBlockDataMap();
                this._blocksByLegacyId[legacyId] = legacyBDM;
                legacyBDM._fillAll(name, blockTypeInstance);
            }
            legacyBDM._byData[legacyData] = blockTypeInstance;
            legacyBDM._names[legacyData] = name;
            legacyBDM._opaque = blockTypeInstance._prop._opaque;
        }

        if (this._textureManager !== null) {
            blockTypeInstance._loadModelTexture(this._textureManager);
        }

    }
    public _postRegister() {
        for (let i = 0; i < this._currentNameOrderIndex; i++) {
            const b = this._blocksByNameOrder[i];
            this._modelRegistry._loadModel("block/" + b._name).then(function(model: _BlockModel) {
                b._model = model;
            });
        }
        //this._makeGlobalPalette();

        //this._helper = new _BlocksHelper(this);
    }
    public _makeGlobalPalette(stated: boolean){
        if(stated){
            for (let i = 0; i < this._currentNameOrderIndex; i++) {
                const block = this._blocksByNameOrder[i];
                block._baseStateId = this._currentGlobalPaletteIndex;
                for(let state = 0; state < block._states; state++){
                    const gi = this._currentGlobalPaletteIndex;
                    this._globalPalette[gi] = block;
                    this._globalPaletteOpaque[gi] = block._opaque ? 1 : 0;

                    this._currentGlobalPaletteIndex++;
                }
            }
        }else{

        }
    }
    public _byLegacyId(id: number) {
        if (id < 0 || id >= 256) {
            return null;
        }

        return this._blocksByLegacyId[id];
    }
    public _byStateId(id: number) {
        if (id < 0 || id >= this._currentGlobalPaletteIndex) {
            return null;
        }

        return this._globalPalette[id];
    }
    
    public _registerBlocks(proto: number) {
        const registry = this;
        const h = new _BlocksHelper();
        this._helper = h;
        const register = function (legacyId: number, legacyData: number, name: string, blockTypeInstance: _Block) {
            registry._registerBlock(legacyId, legacyData, name, blockTypeInstance);
            return blockTypeInstance;
        };
        const blockAir = new _AirBlock(_BlockProperties._create(_Material._AIR, _MaterialColor._AIR)._setTranslucent());
        h._AIR = register(0, 0, "air", blockAir);
        const blockStone = new _StoneBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(1.5, 6));
        h._STONE = register(1, 0, "stone", blockStone);
        h._GRANITE = register(1, 1, "granite", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._DIRT)._hardnessAndResistance(1.5, 6)));
        h._POLISHED_GRANITE = register(1, 2, "polished_granite", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._DIRT)._hardnessAndResistance(1.5, 6)));
        h._DIORITE = register(1, 3, "diorite", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(1.5, 6)));
        h._POLISHED_DIORITE = register(1, 4, "polished_diorite", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(1.5, 6)));
        h._ANDESITE = register(1, 5, "andesite", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(1.5, 6)));
        h._POLISHED_ANDESITE = register(1, 6, "polished_andesite", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(1.5, 6)));
        h._GRASS_BLOCK = register(2, 0, "grass_block", new _GrassBlock(proto, _BlockProperties._create(_Material._GRASS)._needsRandomTick()._hardnessAndResistance(0.6)._sound(_SoundType._PLANT)));
        h._DIRT = register(3, 0, "dirt", new _Block(_BlockProperties._create(_Material._GROUND, _MaterialColor._DIRT)._hardnessAndResistance(0.5)._sound(_SoundType._GROUND)));
        register(3, 1, "coarse_dirt", new _Block(_BlockProperties._create(_Material._GROUND, _MaterialColor._DIRT)._hardnessAndResistance(0.5)._sound(_SoundType._GROUND)));
        register(3, 2, "podzol", new _SnowyDirtBlock(proto, _BlockProperties._create(_Material._GROUND, _MaterialColor._OBSIDIAN)._hardnessAndResistance(0.5)._sound(_SoundType._GROUND)));
        const block2 = new _Block(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(2, 6));
        register(4, 0, "cobblestone", block2);

        const block3 = new _Block(_BlockProperties._create(_Material._WOOD, _MaterialColor._WOOD)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD));
        const block4 = new _Block(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD));
        const block5 = new _Block(_BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD));
        const block6 = new _Block(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD));
        const block7 = new _Block(_BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD));
        const block8 = new _Block(_BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD));
        register(5, 0, "oak_planks", block3);
        register(5, 1, "spruce_planks", block4);
        register(5, 2, "birch_planks", block5);
        register(5, 3, "jungle_planks", block6);
        register(5, 4, "acacia_planks", block7);
        register(5, 5, "dark_oak_planks", block8);
        const block9 = new _SaplingBlock(proto, new _OakTree(), _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const block10 = new _SaplingBlock(proto, new _SpruceTree(), _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const block11 = new _SaplingBlock(proto, new _BirchTree(), _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const block12 = new _SaplingBlock(proto, new _JungleTree(), _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const block13 = new _SaplingBlock(proto, new _AcaciaTree(), _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const block14 = new _SaplingBlock(proto, new _DarkOakTree(), _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        register(6, 0, "oak_sapling", block9);
        register(6, 1, "spruce_sapling", block10);
        register(6, 2, "birch_sapling", block11);
        register(6, 3, "jungle_sapling", block12);
        register(6, 4, "acacia_sapling", block13);
        register(6, 5, "dark_oak_sapling", block14);
        register(7, 0, "bedrock", new _EmptyDropsBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(-1, 3600000)));
        h._WATER = register(8, 0, "water", new _FlowingFluidBlock(proto, _Fluids._WATER, _BlockProperties._create(_Material._WATER)._setTranslucent()._hardnessAndResistance(100)));
        h._LAVA = register(10, 0, "lava", new _FlowingFluidBlock(proto, _Fluids._LAVA, _BlockProperties._create(_Material._LAVA)._setTranslucent()._needsRandomTick()._hardnessAndResistance(100)._lightValue(15)));
        register(12, 0, "sand", new _SandBlock(14406560, _BlockProperties._create(_Material._SAND, _MaterialColor._SAND)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
        register(12, 1, "red_sand", new _SandBlock(11098145, _BlockProperties._create(_Material._SAND, _MaterialColor._ADOBE)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
        register(13, 0, "gravel", new _GravelBlock(_BlockProperties._create(_Material._SAND, _MaterialColor._STONE)._hardnessAndResistance(0.6)._sound(_SoundType._GROUND)));
        register(14, 0, "gold_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3, 3)));
        register(15, 0, "iron_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3, 3)));
        register(16, 0, "coal_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3, 3)));
        register(17, 0, "oak_log", new _LogBlock(_MaterialColor._WOOD, _BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2)._sound(_SoundType._WOOD)));
        register(17, 1, "spruce_log", new _LogBlock(_MaterialColor._OBSIDIAN, _BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2)._sound(_SoundType._WOOD)));
        register(17, 2, "birch_log", new _LogBlock(_MaterialColor._SAND, _BlockProperties._create(_Material._WOOD, _MaterialColor._QUARTZ)._hardnessAndResistance(2)._sound(_SoundType._WOOD)));
        register(17, 3, "jungle_log", new _LogBlock(_MaterialColor._DIRT, _BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2)._sound(_SoundType._WOOD)));
        register(162, 0, "acacia_log", new _LogBlock(_MaterialColor._ADOBE, _BlockProperties._create(_Material._WOOD, _MaterialColor._STONE)._hardnessAndResistance(2)._sound(_SoundType._WOOD)));
        register(162, 1, "dark_oak_log", new _LogBlock(_MaterialColor._BROWN, _BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2)._sound(_SoundType._WOOD)));

        
        register(-1, -1, "stripped_spruce_log", new _LogBlock(_MaterialColor._OBSIDIAN, _BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_birch_log", new _LogBlock(_MaterialColor._SAND, _BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_jungle_log", new _LogBlock(_MaterialColor._DIRT, _BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_acacia_log", new _LogBlock(_MaterialColor._ADOBE, _BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_dark_oak_log", new _LogBlock(_MaterialColor._BROWN, _BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_oak_log", new _LogBlock(_MaterialColor._WOOD, _BlockProperties._create(_Material._WOOD, _MaterialColor._WOOD)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        
        register(-1, -1, "oak_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._WOOD)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "spruce_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "birch_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "jungle_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "acacia_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "dark_oak_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        
        register(-1, -1, "stripped_oak_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._WOOD)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_spruce_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_birch_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_jungle_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_acacia_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        register(-1, -1, "stripped_dark_oak_wood", new _RotatedPillarBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)));
        
        register(18, 0, "oak_leaves", new _LeavesBlock(proto, _BlockProperties._create(_Material._LEAVES)._hardnessAndResistance(0.2)._needsRandomTick()._sound(_SoundType._PLANT)));
        register(18, 1, "spruce_leaves", new _LeavesBlock(proto, _BlockProperties._create(_Material._LEAVES)._hardnessAndResistance(0.2)._needsRandomTick()._sound(_SoundType._PLANT)));
        register(18, 2, "birch_leaves", new _LeavesBlock(proto, _BlockProperties._create(_Material._LEAVES)._hardnessAndResistance(0.2)._needsRandomTick()._sound(_SoundType._PLANT)));
        register(18, 3, "jungle_leaves", new _LeavesBlock(proto, _BlockProperties._create(_Material._LEAVES)._hardnessAndResistance(0.2)._needsRandomTick()._sound(_SoundType._PLANT)));
        register(161, 0, "acacia_leaves", new _LeavesBlock(proto, _BlockProperties._create(_Material._LEAVES)._hardnessAndResistance(0.2)._needsRandomTick()._sound(_SoundType._PLANT)));
        register(161, 1, "dark_oak_leaves", new _LeavesBlock(proto, _BlockProperties._create(_Material._LEAVES)._hardnessAndResistance(0.2)._needsRandomTick()._sound(_SoundType._PLANT)));

        register(19, 0, "sponge", new _SpongeBlock(_BlockProperties._create(_Material._SPONGE)._hardnessAndResistance(0.6)._sound(_SoundType._PLANT)));
        register(19, 1, "wet_sponge", new _WetSpongeBlock(_BlockProperties._create(_Material._SPONGE)._hardnessAndResistance(0.6)._sound(_SoundType._PLANT)));
        register(20, 0, "glass", new _GlassBlock(_BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(21, 0, "lapis_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3, 3)));
        register(22, 0, "lapis_block", new _Block(_BlockProperties._create(_Material._IRON, _MaterialColor._LAPIS)._hardnessAndResistance(3, 3)));
        register(23, 0, "dispenser", new _DispenserBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.5)));
        const blockSandstone = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(0.8));
        h._SANDSTONE = register(24, 0, "sandstone", blockSandstone);
        register(24, 1, "chiseled_sandstone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(0.8)));
        register(24, 2, "cut_sandstone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(0.8)));
        register(25, 0, "note_block", new _NoteBlock(proto, _BlockProperties._create(_Material._WOOD)._sound(_SoundType._WOOD)._hardnessAndResistance(0.8)));
        
        register(-1, -1, "white_bed", new _BedBlock(_DyeColor._WHITE, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "orange_bed", new _BedBlock(_DyeColor._ORANGE, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "magenta_bed", new _BedBlock(_DyeColor._MAGENTA, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "light_blue_bed", new _BedBlock(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "yellow_bed", new _BedBlock(_DyeColor._YELLOW, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "lime_bed", new _BedBlock(_DyeColor._LIME, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "pink_bed", new _BedBlock(_DyeColor._PINK, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "gray_bed", new _BedBlock(_DyeColor._GRAY, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "light_gray_bed", new _BedBlock(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "cyan_bed", new _BedBlock(_DyeColor._CYAN, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "purple_bed", new _BedBlock(_DyeColor._PURPLE, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "blue_bed", new _BedBlock(_DyeColor._BLUE, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "brown_bed", new _BedBlock(_DyeColor._BROWN, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "green_bed", new _BedBlock(_DyeColor._GREEN, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "red_bed", new _BedBlock(_DyeColor._RED, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        register(-1, -1, "black_bed", new _BedBlock(_DyeColor._BLACK, _BlockProperties._create(_Material._CLOTH)._sound(_SoundType._WOOD)._hardnessAndResistance(0.2)));
        
        register(27, 0, "powered_rail", new _PoweredRailBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.7)._sound(_SoundType._METAL)));
        register(28, 0, "detector_rail", new _DetectorRailBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.7)._sound(_SoundType._METAL)));
        register(29, 0, "sticky_piston", new _PistonBlock(true, _BlockProperties._create(_Material._PISTON)._hardnessAndResistance(0.5)));
        register(30, 0, "cobweb", new _BlockWeb(_BlockProperties._create(_Material._WEB)._setTranslucent()._hardnessAndResistance(4)));
        const blockGrass = new _GrassBushBlock(_BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const blockFern = new _FernBushBlock(_BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const blockDeadBush = new _DeadBushBlock(_BlockProperties._create(_Material._VINE, _MaterialColor._WOOD)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        register(31, 1, "grass", blockGrass);
        register(31, 2, "fern", blockFern);
        register(31, 0, "dead_bush", blockDeadBush);
        if(proto >= 340){
            let block19 = new _SeaGrassBlock(_BlockProperties._create(_Material._SEA_GRASS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS));
            register(-1, -1, "seagrass", block19);
            register(-1, -1, "tall_seagrass", new _TallSeaGrassBlock(_BlockProperties._create(_Material._SEA_GRASS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
        }
        register(33, 0, "piston", new _PistonBlock(false, _BlockProperties._create(_Material._PISTON)._hardnessAndResistance(0.5)));
        register(34, 0, "piston_head", new _BlockPistonExtension(_BlockProperties._create(_Material._PISTON)._hardnessAndResistance(0.5)));
        register(35, 0, "white_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._SNOW)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 1, "orange_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._ADOBE)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 2, "magenta_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._MAGENTA)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 3, "light_blue_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._LIGHT_BLUE)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 4, "yellow_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._YELLOW)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 5, "lime_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._LIME)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 6, "pink_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._PINK)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 7, "gray_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._GRAY)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 8, "light_gray_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._LIGHT_GRAY)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 9, "cyan_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._CYAN)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 10, "purple_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._PURPLE)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 11, "blue_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._BLUE)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 12, "brown_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._BROWN)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 13, "green_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._GREEN)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 14, "red_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._RED)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(35, 15, "black_wool", new _Block(_BlockProperties._create(_Material._CLOTH, _MaterialColor._BLACK)._hardnessAndResistance(0.8)._sound(_SoundType._CLOTH)));
        register(36, 0, "moving_piston", new _MovingPistonBlock(_BlockProperties._create(_Material._PISTON)._hardnessAndResistance(-1.0)._variableOpacity()));

        const dandelion = new _FlowerBlock(_Effects._SATURATION, 7,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const poppy = new _FlowerBlock(_Effects._SPEED, 6,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const blue_orchid = new _FlowerBlock(_Effects._SATURATION, 7, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const allium = new _FlowerBlock(_Effects._FIRE_RESISTANCE, 4,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const azure_bluet = new _FlowerBlock(_Effects._BLINDNESS, 8,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const red_tulip = new _FlowerBlock(_Effects._WEAKNESS, 9,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const orange_tulip = new _FlowerBlock(_Effects._WEAKNESS, 9,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const white_tulip = new _FlowerBlock(_Effects._WEAKNESS, 9, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const pink_tulip = new _FlowerBlock(_Effects._WEAKNESS, 9,_BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        const oxeye_daisy = new _FlowerBlock(_Effects._REGENERATION, 8, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        register(37, 0, "dandelion", dandelion);
        register(38, 0, "poppy", poppy);
        register(38, 1, "blue_orchid", blue_orchid);
        register(38, 2, "allium", allium);
        register(38, 3, "azure_bluet", azure_bluet);
        register(38, 4, "red_tulip", red_tulip);
        register(38, 5, "orange_tulip", orange_tulip);
        register(38, 6, "white_tulip", white_tulip);
        register(38, 7, "pink_tulip", pink_tulip);
        register(38, 8, "oxeye_daisy", oxeye_daisy);
        if(proto >= 480){
            h._CORNFLOWER = register(-1, -1, "cornflower", new _FlowerBlock(_Effects._JUMP_BOOST, 6, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
            h._WITHER_ROSE = register(-1, -1, "wither_rose", new _WitherRoseBlock(_Effects._WITHER, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
            h._LILY_OF_THE_VALLEY = register(-1, -1, "lily_of_the_valley", new _FlowerBlock(_Effects._POISON, 12, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        }
        const block30 = new _MushroomBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)._lightValue(1));
        const block31 = new _MushroomBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT));
        register(39, 0, "brown_mushroom", block30);
        register(40, 0, "red_mushroom", block31);
        register(41, 0, "gold_block", new _Block(_BlockProperties._create(_Material._IRON, _MaterialColor._GOLD)._hardnessAndResistance(3, 6)._sound(_SoundType._METAL)));
        register(42, 0, "iron_block", new _Block(_BlockProperties._create(_Material._IRON, _MaterialColor._IRON)._hardnessAndResistance(5, 6)._sound(_SoundType._METAL)));
        const block32 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._RED)._hardnessAndResistance(2, 6));
        h._BRICKS = register(45, 0, "bricks", block32);
        register(46, 0, "tnt", new _TNTBlock(_BlockProperties._create(_Material._TNT)._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(47, 0, "bookshelf", new _BookshelfBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(1.5)._sound(_SoundType._WOOD)));
        h._MOSSY_COBBLESTONE = register(48, 0, "mossy_cobblestone", new _Block(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(2, 6)));
        register(49, 0, "obsidian", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._BLACK)._hardnessAndResistance(50, 1200)));
        register(50, 0, "torch", new _TorchBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._zeroHardnessAndResistance()._lightValue(14)._sound(_SoundType._WOOD)));
        register(50, 1, "wall_torch", new _WallTorchBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._zeroHardnessAndResistance()._lightValue(14)._sound(_SoundType._WOOD)));
        register(51, 0, "fire", new _FireBlock(_BlockProperties._create(_Material._FIRE, _MaterialColor._TNT)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._lightValue(15)._sound(_SoundType._CLOTH)));
        register(52, 0, "spawner", new _MobSpawnerBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(5)._sound(_SoundType._METAL)));
        //register(53, 0, "oak_stairs", new _BlockStairs(block3._getDefaultState(), BlockProperties.from(block3)));
        register(53, 0, "oak_stairs", new _StairsBlock(block3, _BlockProperties._from(block3._prop)));
        register(54, 0, "chest", new _ChestBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
        register(55, 0, "redstone_wire", new _RedstoneWireBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._zeroHardnessAndResistance()));
        register(56, 0, "diamond_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3, 3)));
        register(57, 0, "diamond_block", new _Block(_BlockProperties._create(_Material._IRON, _MaterialColor._DIAMOND)._hardnessAndResistance(5, 6)._sound(_SoundType._METAL)));
        register(58, 0, "crafting_table", new _WorkbenchBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
        register(59, 0, "wheat", new _CropsBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        const block33 = new _FarmlandBlock(_BlockProperties._create(_Material._GROUND)._needsRandomTick()._hardnessAndResistance(0.6)._sound(_SoundType._GROUND));
        register(60, 0, "farmland", block33);
        register(61, 0, "furnace", new _FurnaceBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.5)._lightValue(13)));
        // no burning furnace
        h._OAK_SIGN = register(63, 0, "oak_sign", new _StandingSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1)._sound(_SoundType._WOOD)));
        if(proto >= 480){
            h._SPRUCE_SIGN = register(-1, -1, "spruce_sign", new _StandingSignBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
            h._BIRCH_SIGN = register(-1, -1, "birch_sign", new _StandingSignBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
            h._ACACIA_SIGN = register(-1, -1, "acacia_sign", new _StandingSignBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
            h._JUNGLE_SIGN = register(-1, -1, "jungle_sign", new _StandingSignBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
            h._DARK_OAK_SIGN = register(-1, -1, "dark_oak_sign", new _StandingSignBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        }
        
        h._OAK_DOOR = register(64, 0, "oak_door", new _DoorBlock(_BlockProperties._create(_Material._WOOD, block3._prop._materialColor)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        h._LADDER = register(65, 0, "ladder", new _LadderBlock(_BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(0.4)._sound(_SoundType._LADDER)));
        h._RAIL = register(66, 0, "rail", new _RailBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.7)._sound(_SoundType._METAL)));
        // register(67, 0, "cobblestone_stairs", new _BlockStairs(block2.getDefaultState(), BlockProperties.from(block2)));
        h._COBBLESTONE_STAIRS = register(67, 0, "cobblestone_stairs", new _StairsBlock(block2, _BlockProperties._from(block2._prop)));
        h._OAK_WALL_SIGN = register(68, 0, "oak_wall_sign", new _WallSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1)._sound(_SoundType._WOOD)));
        if(proto >= 480){
            h._SPRUCE_WALL_SIGN = register(-1, -1, "spruce_wall_sign", new _WallSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)._lootFrom(h._SPRUCE_SIGN!)));
            h._BIRCH_WALL_SIGN = register(-1, -1, "birch_wall_sign", new _WallSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)._lootFrom(h._BIRCH_SIGN!)));
            h._ACACIA_WALL_SIGN = register(-1, -1, "acacia_wall_sign", new _WallSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)._lootFrom(h._ACACIA_SIGN!)));
            h._JUNGLE_WALL_SIGN = register(-1, -1, "jungle_wall_sign", new _WallSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)._lootFrom(h._JUNGLE_SIGN!)));
            h._DARK_OAK_WALL_SIGN = register(-1, -1, "dark_oak_wall_sign", new _WallSignBlock(_BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)._lootFrom(h._DARK_OAK_SIGN!)));
        }
        
        h._LEVER = register(69, 0, "lever", new _LeverBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        h._STONE_PRESSURE_PLATE = register(70, 0, "stone_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._MOBS, _BlockProperties._create(_Material._ROCK)._setTranslucent()._hardnessAndResistance(0.5)));
        h._IRON_DOOR = register(71, 0, "iron_door", new _DoorBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._IRON)._hardnessAndResistance(5)._sound(_SoundType._METAL)));
        register(72, 0, "oak_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._EVERYTHING, _BlockProperties._create(_Material._WOOD, block3._prop._materialColor)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(72, 1, "spruce_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._EVERYTHING, _BlockProperties._create(_Material._WOOD, block4._prop._materialColor)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(72, 2, "birch_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._EVERYTHING, _BlockProperties._create(_Material._WOOD, block5._prop._materialColor)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(72, 3, "jungle_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._EVERYTHING, _BlockProperties._create(_Material._WOOD, block6._prop._materialColor)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(72, 4, "acacia_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._EVERYTHING, _BlockProperties._create(_Material._WOOD, block7._prop._materialColor)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(72, 5, "dark_oak_pressure_plate", new _PressurePlateBlock(_PressureSensitivity._EVERYTHING, _BlockProperties._create(_Material._WOOD, block8._prop._materialColor)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(73, 0, "redstone_ore", new _RedstoneOreBlock(_BlockProperties._create(_Material._ROCK)._needsRandomTick()._lightValue(9)._hardnessAndResistance(3, 3)));
        register(75, 0, "redstone_torch", new _RedstoneTorchBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._zeroHardnessAndResistance()._lightValue(7)._sound(_SoundType._WOOD)));
        register(75, 1, "redstone_wall_torch", new _WallRedstoneTorchBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._zeroHardnessAndResistance()._lightValue(7)._sound(_SoundType._WOOD)._lootFrom(h._REDSTONE_TORCH!)));
        register(77, 0, "stone_button", new _StoneButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)));
        register(78, 0, "snow", new _SnowLayerBlock(_BlockProperties._create(_Material._SNOW)._needsRandomTick()._hardnessAndResistance(0.1)._sound(_SoundType._SNOW)));
        register(79, 0, "ice", new _IceBlock(_BlockProperties._create(_Material._ICE)._slipperiness(0.98)._needsRandomTick()._hardnessAndResistance(0.5)._sound(_SoundType._GLASS)));
        register(80, 0, "snow_block", new _SnowBlock(_BlockProperties._create(_Material._CRAFTED_SNOW)._needsRandomTick()._hardnessAndResistance(0.2)._sound(_SoundType._SNOW)));

        const block34 = new _CactusBlock(_BlockProperties._create(_Material._CACTUS)._needsRandomTick()._hardnessAndResistance(0.4)._sound(_SoundType._CLOTH));
        register(81, 0, "cactus", block34);
        register(82, 0, "clay", new _ClayBlock(_BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0.6)._sound(_SoundType._GROUND)));
        register(83, 0, "sugar_cane", new _SugarCaneBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(84, 0, "jukebox", new _JukeboxBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(2, 6)));
        register(85, 0, "oak_fence", new _FenceBlock(_BlockProperties._create(_Material._WOOD, block3._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        const blockstemgrown = new _PumpkinBlock(_BlockProperties._create(_Material._GOURD, _MaterialColor._ADOBE)._hardnessAndResistance(1)._sound(_SoundType._WOOD));
        register(86, 0, "pumpkin", blockstemgrown);
        register(87, 0, "netherrack", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._hardnessAndResistance(0.4)));
        register(88, 0, "soul_sand", new _SoulSandBlock(_BlockProperties._create(_Material._SAND, _MaterialColor._BROWN)._needsRandomTick()._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
        register(89, 0, "glowstone", new _GlowstoneBlock(_BlockProperties._create(_Material._GLASS, _MaterialColor._SAND)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)._lightValue(15)));
        register(90, 0, "nether_portal", new _NetherPortalBlock(_BlockProperties._create(_Material._PORTAL)._setTranslucent()._needsRandomTick()._hardnessAndResistance(-1)._sound(_SoundType._GLASS)._lightValue(11)));
        register(91, 4, "carved_pumpkin", new _CarvedPumpkinBlock(_BlockProperties._create(_Material._GOURD, _MaterialColor._ADOBE)._hardnessAndResistance(1)._sound(_SoundType._WOOD)));
        register(91, 0, "jack_o_lantern", new _CarvedPumpkinBlock(_BlockProperties._create(_Material._GOURD, _MaterialColor._ADOBE)._hardnessAndResistance(1)._sound(_SoundType._WOOD)._lightValue(15)));
        register(92, 0, "cake", new _CakeBlock(_BlockProperties._create(_Material._CAKE)._hardnessAndResistance(0.5)._sound(_SoundType._CLOTH)));
        register(93, 0, "repeater", new _RepeaterBlock(_BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()._sound(_SoundType._WOOD)));
        // no powered repeater
        
        register(95, 0, "white_stained_glass", new _StainedGlassBlock(_DyeColor._WHITE, _BlockProperties._create(_Material._GLASS, _DyeColor._WHITE)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 1, "orange_stained_glass", new _StainedGlassBlock(_DyeColor._ORANGE, _BlockProperties._create(_Material._GLASS, _DyeColor._ORANGE)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 2, "magenta_stained_glass", new _StainedGlassBlock(_DyeColor._MAGENTA, _BlockProperties._create(_Material._GLASS, _DyeColor._MAGENTA)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 3, "light_blue_stained_glass", new _StainedGlassBlock(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._GLASS, _DyeColor._LIGHT_BLUE)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 4, "yellow_stained_glass", new _StainedGlassBlock(_DyeColor._YELLOW, _BlockProperties._create(_Material._GLASS, _DyeColor._YELLOW)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 5, "lime_stained_glass", new _StainedGlassBlock(_DyeColor._LIME, _BlockProperties._create(_Material._GLASS, _DyeColor._LIME)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 6, "pink_stained_glass", new _StainedGlassBlock(_DyeColor._PINK, _BlockProperties._create(_Material._GLASS, _DyeColor._PINK)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 7, "gray_stained_glass", new _StainedGlassBlock(_DyeColor._GRAY, _BlockProperties._create(_Material._GLASS, _DyeColor._GRAY)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 8, "light_gray_stained_glass", new _StainedGlassBlock(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._GLASS, _DyeColor._LIGHT_GRAY)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 9, "cyan_stained_glass", new _StainedGlassBlock(_DyeColor._CYAN, _BlockProperties._create(_Material._GLASS, _DyeColor._CYAN)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 10, "purple_stained_glass", new _StainedGlassBlock(_DyeColor._PURPLE, _BlockProperties._create(_Material._GLASS, _DyeColor._PURPLE)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 11, "blue_stained_glass", new _StainedGlassBlock(_DyeColor._BLUE, _BlockProperties._create(_Material._GLASS, _DyeColor._BLUE)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 12, "brown_stained_glass", new _StainedGlassBlock(_DyeColor._BROWN, _BlockProperties._create(_Material._GLASS, _DyeColor._BROWN)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 13, "green_stained_glass", new _StainedGlassBlock(_DyeColor._GREEN, _BlockProperties._create(_Material._GLASS, _DyeColor._GREEN)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 14, "red_stained_glass", new _StainedGlassBlock(_DyeColor._RED, _BlockProperties._create(_Material._GLASS, _DyeColor._RED)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(95, 15, "black_stained_glass", new _StainedGlassBlock(_DyeColor._BLACK, _BlockProperties._create(_Material._GLASS, _DyeColor._BLACK)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        

        register(96, 0, "oak_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._WOOD)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(96, 1, "spruce_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(96, 2, "birch_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(96, 3, "jungle_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(96, 4, "acacia_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(96, 5, "dark_oak_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));

        h._STONE_BRICKS = register(98, 0, "stone_bricks", new _Block(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(1.5, 6)));
        h._MOSSY_STONE_BRICKS = register(98, 1, "mossy_stone_bricks", new _Block(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(1.5, 6)));
        h._CRACKED_STONE_BRICKS = register(98, 2, "cracked_stone_bricks", new _Block(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(1.5, 6)));
        h._CHISELED_STONE_BRICKS = register(98, 3, "chiseled_stone_bricks", new _Block(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(1.5, 6)));

        register(97, 0, "infested_stone", new _SilverfishBlock(blockStone, _BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0, 0.75)));
        register(97, 1, "infested_cobblestone", new _SilverfishBlock(block2, _BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0, 0.75)));
        register(97, 2, "infested_stone_bricks", new _SilverfishBlock(h._STONE_BRICKS!, _BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0, 0.75)));
        register(97, 3, "infested_mossy_stone_bricks", new _SilverfishBlock(h._MOSSY_STONE_BRICKS!, _BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0, 0.75)));
        register(97, 4, "infested_cracked_stone_bricks", new _SilverfishBlock(h._CRACKED_STONE_BRICKS, _BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0, 0.75)));
        register(97, 5, "infested_chiseled_stone_bricks", new _SilverfishBlock(h._CHISELED_STONE_BRICKS, _BlockProperties._create(_Material._CLAY)._hardnessAndResistance(0, 0.75)));
        
        const block39 = new _HugeMushroomBlock(block30, _BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(0.2)._sound(_SoundType._WOOD));
        register(99, 0, "brown_mushroom_block", block39);
        const block40 = new _HugeMushroomBlock(block31, _BlockProperties._create(_Material._WOOD, _MaterialColor._RED)._hardnessAndResistance(0.2)._sound(_SoundType._WOOD));
        register(100, 0, "red_mushroom_block", block40);
        register(-1, -1, "mushroom_stem", new _HugeMushroomBlock(null, _BlockProperties._create(_Material._WOOD, _MaterialColor._WHITE_TERRACOTTA)._hardnessAndResistance(0.2)._sound(_SoundType._WOOD)));
        
        register(101, 0, "iron_bars", new _PaneBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._AIR)._hardnessAndResistance(5, 6)._sound(_SoundType._METAL)));
        register(102, 0, "glass_pane", new _GlassPaneBlock(_BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        const blockstemgrown1 = new _MelonBlock(_BlockProperties._create(_Material._GOURD, _MaterialColor._LIME)._hardnessAndResistance(1)._sound(_SoundType._WOOD));
        register(103, 0, "melon", blockstemgrown1);
        register(104, 0, "pumpkin_stem", new _StemBlock(blockstemgrown, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._WOOD)));
        register(105, 0, "melon_stem", new _StemBlock(blockstemgrown1, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._WOOD)));
        
        register(104, 1, "attached_pumpkin_stem", new _AttachedStemBlock(blockstemgrown, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WOOD)));
        register(105, 1, "attached_melon_stem", new _AttachedStemBlock(blockstemgrown1, _BlockProperties._create(_Material._PLANTS)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WOOD)));
        register(106, 0, "vine", new _VineBlock(_BlockProperties._create(_Material._VINE)._setTranslucent()._needsRandomTick()._hardnessAndResistance(0.2)._sound(_SoundType._PLANT)));
        register(107, 0, "oak_fence_gate", new _FenceGateBlock(_BlockProperties._create(_Material._WOOD, block3._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(108, 0, "brick_stairs", new _StairsBlock(block32._getDefaultState(), _BlockProperties._from(block32._prop)));
        register(109, 0, "stone_brick_stairs", new _StairsBlock(h._STONE_BRICKS!._getDefaultState(), _BlockProperties._from(h._STONE_BRICKS!._prop)));
        register(110, 0, "mycelium", new _MyceliumBlock(proto, _BlockProperties._create(_Material._GRASS, _MaterialColor._PURPLE)._needsRandomTick()._hardnessAndResistance(0.6)._sound(_SoundType._PLANT)));
        register(111, 0, "lily_pad", new _LilyPadBlock(_BlockProperties._create(_Material._PLANTS)._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        const block41 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._hardnessAndResistance(2, 6));
        h._NETHER_BRICKS = register(112, 0, "nether_bricks", block41);
        register(113, 0, "nether_brick_fence", new _FenceBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._hardnessAndResistance(2, 6)));
        register(114, 0, "nether_brick_stairs", new _StairsBlock(block41._getDefaultState(), _BlockProperties._from(block41._prop)));
        register(115, 0, "nether_wart", new _NetherWartBlock(_BlockProperties._create(_Material._PLANTS, _MaterialColor._RED)._setTranslucent()._needsRandomTick()));
        register(116, 0, "enchanting_table", new _EnchantmentTableBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._RED)._hardnessAndResistance(5, 1200)));
        register(117, 0, "brewing_stand", new _BrewingStandBlock(_BlockProperties._create(_Material._IRON)._hardnessAndResistance(0.5)._lightValue(1)));
        register(118, 0, "cauldron", new _CauldronBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._STONE)._hardnessAndResistance(2)));
        register(119, 0, "end_portal", new _EndPortalBlock(_BlockProperties._create(_Material._PORTAL, _MaterialColor._BLACK)._setTranslucent()._lightValue(15)._hardnessAndResistance(-1, 3600000)));
        register(120, 0, "end_portal_frame", new _EndPortalFrameBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GREEN)._sound(_SoundType._GLASS)._lightValue(1)._hardnessAndResistance(-1, 3600000)));
        register(121, 0, "end_stone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(3, 9)));
        register(122, 0, "dragon_egg", new _DragonEggBlock(_BlockProperties._create(_Material._DRAGON_EGG, _MaterialColor._BLACK)._hardnessAndResistance(3, 9)._lightValue(1)));
        register(123, 0, "redstone_lamp", new _RedstoneLampBlock(_BlockProperties._create(_Material._REDSTONE_LIGHT)._lightValue(15)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(127, 0, "cocoa", new _CocoaBlock(_BlockProperties._create(_Material._PLANTS)._needsRandomTick()._hardnessAndResistance(0.2, 3)._sound(_SoundType._WOOD)));
        register(128, 0, "sandstone_stairs", new _StairsBlock(blockSandstone._getDefaultState(), _BlockProperties._from(blockSandstone._prop)));
        register(129, 0, "emerald_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3, 3)));
        register(130, 0, "ender_chest", new _EnderChestBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(22.5, 600)._lightValue(7)));
        const blocktripwirehook = new _TripWireHookBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent());
        register(131, 0, "tripwire_hook", blocktripwirehook);
        register(132, 0, "tripwire", new _TripWireBlock(blocktripwirehook, _BlockProperties._create(_Material._CIRCUITS)._setTranslucent()));
        register(133, 0, "emerald_block", new _Block(_BlockProperties._create(_Material._IRON, _MaterialColor._EMERALD)._hardnessAndResistance(5, 6)._sound(_SoundType._METAL)));
        register(134, 0, "spruce_stairs", new _StairsBlock(block4._getDefaultState(), _BlockProperties._from(block4._prop)));
        register(135, 0, "birch_stairs", new _StairsBlock(block5._getDefaultState(), _BlockProperties._from(block5._prop)));
        register(136, 0, "jungle_stairs", new _StairsBlock(block6._getDefaultState(), _BlockProperties._from(block6._prop)));
        register(137, 0, "command_block", new _CommandBlockBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._BROWN)._hardnessAndResistance(-1, 3600000)));
        register(138, 0, "beacon", new _BeaconBlock(_BlockProperties._create(_Material._GLASS, _MaterialColor._DIAMOND)._hardnessAndResistance(3)._lightValue(15)));
        
        register(139, 0, "cobblestone_wall", new _WallBlock(_BlockProperties._from(block2._prop)));
        register(139, 1, "mossy_cobblestone_wall", new _WallBlock(_BlockProperties._from(block2._prop)));
        register(140, 0, "flower_pot", new _FlowerPotBlock(blockAir, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 1, "potted_oak_sapling", new _FlowerPotBlock(block9, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 2, "potted_spruce_sapling", new _FlowerPotBlock(block10, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 3, "potted_birch_sapling", new _FlowerPotBlock(block11, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 4, "potted_jungle_sapling", new _FlowerPotBlock(block12, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 5, "potted_acacia_sapling", new _FlowerPotBlock(block13, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 6, "potted_dark_oak_sapling", new _FlowerPotBlock(block14, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 7, "potted_fern", new _FlowerPotBlock(blockFern, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 8, "potted_dandelion", new _FlowerPotBlock(dandelion, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 9, "potted_poppy", new _FlowerPotBlock(poppy, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 10, "potted_blue_orchid", new _FlowerPotBlock(blue_orchid, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 11, "potted_allium", new _FlowerPotBlock(allium, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 12, "potted_azure_bluet", new _FlowerPotBlock(azure_bluet, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 13, "potted_red_tulip", new _FlowerPotBlock(red_tulip, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 14, "potted_orange_tulip", new _FlowerPotBlock(orange_tulip, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        register(140, 15, "potted_white_tulip", new _FlowerPotBlock(white_tulip, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        
        if(proto >= 340){
            h._PINK_TULIP = register(-1, -1, "potted_pink_tulip", new _FlowerPotBlock(pink_tulip, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
            h._OXEYE_DAISY = register(-1, -1, "potted_oxeye_daisy", new _FlowerPotBlock(oxeye_daisy, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
            h._POTTED_CORNFLOWER = register(-1, -1, "potted_cornflower", new _FlowerPotBlock(h._CORNFLOWER!, _BlockProperties._create(_Material._MISCELLANEOUS)._zeroHardnessAndResistance()));
            h._POTTED_LILY_OF_THE_VALLEY = register(-1, -1, "potted_lily_of_the_valley", new _FlowerPotBlock(h._LILY_OF_THE_VALLEY!, _BlockProperties._create(_Material._MISCELLANEOUS)._zeroHardnessAndResistance()));
            h._POTTED_WITHER_ROSE = register(-1, -1, "potted_wither_rose", new _FlowerPotBlock(h._WITHER_ROSE!, _BlockProperties._create(_Material._MISCELLANEOUS)._zeroHardnessAndResistance()));
            
            h._POTTED_RED_MUSHROOM = register(-1, -1, "potted_red_mushroom", new _FlowerPotBlock(block31, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
            h._POTTED_BROWN_MUSHROOM = register(-1, -1, "potted_brown_mushroom", new _FlowerPotBlock(block30, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
            h._POTTED_DEAD_BUSH = register(-1, -1, "potted_dead_bush", new _FlowerPotBlock(blockDeadBush, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
            h._POTTED_CACTUS = register(-1, -1, "potted_cactus", new _FlowerPotBlock(block34, _BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()));
        }
        register(141, 0, "carrots", new _CarrotBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(142, 0, "potatoes", new _PotatoBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._needsRandomTick()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(143, 0, "oak_button", new _WoodButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(143, 1, "spruce_button", new _WoodButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(143, 2, "birch_button", new _WoodButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(143, 3, "jungle_button", new _WoodButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(143, 4, "acacia_button", new _WoodButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(143, 5, "dark_oak_button", new _WoodButtonBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(144, 0, "skeleton_wall_skull", new _WallSkullBlock(_SkullBlock._Types._SKELETON, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 1, "skeleton_skull", new _SkullBlock(_SkullBlock._Types._SKELETON, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 2, "wither_skeleton_wall_skull", new _WitherWallSkullBlock(_BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 3, "wither_skeleton_skull", new _WitherSkullBlock(_BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 4, "zombie_wall_head", new _WallSkullBlock(_SkullBlock._Types._ZOMBIE, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 5, "zombie_head", new _SkullBlock(_SkullBlock._Types._ZOMBIE, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 6, "player_wall_head", new _PlayerWallSkullBlock(_BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 7, "player_head", new _PlayerSkullBlock(_BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 8, "creeper_wall_head", new _WallSkullBlock(_SkullBlock._Types._CREEPER, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 9, "creeper_head", new _SkullBlock(_SkullBlock._Types._CREEPER, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 10, "dragon_wall_head", new _WallSkullBlock(_SkullBlock._Types._DRAGON, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(144, 11, "dragon_head", new _SkullBlock(_SkullBlock._Types._DRAGON, _BlockProperties._create(_Material._CIRCUITS)._hardnessAndResistance(1)));
        register(145, 0, "anvil", new _BlockAnvil(_BlockProperties._create(_Material._ANVIL, _MaterialColor._IRON)._hardnessAndResistance(5, 1200)._sound(_SoundType._ANVIL)));
        register(145, 1, "chipped_anvil", new _BlockAnvil(_BlockProperties._create(_Material._ANVIL, _MaterialColor._IRON)._hardnessAndResistance(5, 1200)._sound(_SoundType._ANVIL)));
        register(145, 2, "damaged_anvil", new _BlockAnvil(_BlockProperties._create(_Material._ANVIL, _MaterialColor._IRON)._hardnessAndResistance(5, 1200)._sound(_SoundType._ANVIL)));
        register(146, 0, "trapped_chest", new _TrappedChestBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
        register(147, 0, "light_weighted_pressure_plate", new _WeightedPressurePlateBlock(15, _BlockProperties._create(_Material._IRON, _MaterialColor._GOLD)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(148, 0, "heavy_weighted_pressure_plate", new _WeightedPressurePlateBlock(150, _BlockProperties._create(_Material._IRON)._setTranslucent()._hardnessAndResistance(0.5)._sound(_SoundType._WOOD)));
        register(149, 0, "comparator", new _BlockRedstoneComparator(_BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()._sound(_SoundType._WOOD)));
        register(151, 0, "daylight_detector", new _BlockDaylightDetector(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(0.2)._sound(_SoundType._WOOD)));
        register(152, 0, "redstone_block", new _BlockRedstone(_BlockProperties._create(_Material._IRON, _MaterialColor._TNT)._hardnessAndResistance(5, 6)._sound(_SoundType._METAL)));
        register(153, 0, "nether_quartz_ore", new _OreBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._hardnessAndResistance(3, 3)));
        register(154, 0, "hopper", new _BlockHopper(_BlockProperties._create(_Material._IRON, _MaterialColor._STONE)._hardnessAndResistance(3, 4.8)._sound(_SoundType._METAL)));
        const block42 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(0.8));
        register(155, 0, "quartz_block", block42);
        register(155, 1, "chiseled_quartz_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(0.8)));
        register(155, 2, "quartz_pillar", new _RotatedPillarBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(0.8)));
        register(156, 0, "quartz_stairs", new _StairsBlock(block42._getDefaultState(), _BlockProperties._from(block42._prop)));
        register(157, 0, "activator_rail", new _PoweredRailBlock(_BlockProperties._create(_Material._CIRCUITS)._setTranslucent()._hardnessAndResistance(0.7)._sound(_SoundType._METAL)));
        register(158, 0, "dropper", new _BlockDropper(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.5)));
        register(159, 0, "white_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._WHITE_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 1, "orange_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._ORANGE_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 2, "magenta_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._MAGENTA_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 3, "light_blue_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._LIGHT_BLUE_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 4, "yellow_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._YELLOW_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 5, "lime_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._LIME_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 6, "pink_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._PINK_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 7, "gray_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 8, "light_gray_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._LIGHT_GRAY_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 9, "cyan_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._CYAN_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 10, "purple_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._PURPLE_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 11, "blue_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._BLUE_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 12, "brown_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._BROWN_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 13, "green_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GREEN_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 14, "red_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._RED_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(159, 15, "black_terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._BLACK_TERRACOTTA)._hardnessAndResistance(1.25, 4.2)));
        register(160, 0, "white_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._WHITE, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 1, "orange_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._ORANGE, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 2, "magenta_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._MAGENTA, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 3, "light_blue_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 4, "yellow_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._YELLOW, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 5, "lime_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._LIME, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 6, "pink_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._PINK, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 7, "gray_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._GRAY, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 8, "light_gray_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 9, "cyan_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._CYAN, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 10, "purple_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._PURPLE, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 11, "blue_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._BLUE, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 12, "brown_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._BROWN, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 13, "green_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._GREEN, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 14, "red_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._RED, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(160, 15, "black_stained_glass_pane", new _StainedGlassPaneBlock(_DyeColor._BLACK, _BlockProperties._create(_Material._GLASS)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)));
        register(163, 0, "acacia_stairs", new _StairsBlock(block7._getDefaultState(), _BlockProperties._from(block7._prop)));
        register(164, 0, "dark_oak_stairs", new _StairsBlock(block8._getDefaultState(), _BlockProperties._from(block8._prop)));
        register(165, 0, "slime_block", new _SlimeBlock(_BlockProperties._create(_Material._CLAY, _MaterialColor._GRASS)._slipperiness(0.8)._sound(_SoundType._SLIME)));
        register(166, 0, "barrier", new _BarrierBlock(_BlockProperties._create(_Material._BARRIER)._hardnessAndResistance(-1, 3600000.8)));
        register(167, 0, "iron_trapdoor", new _TrapDoorBlock(_BlockProperties._create(_Material._IRON)._hardnessAndResistance(5)._sound(_SoundType._METAL)));
        const block43 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._CYAN)._hardnessAndResistance(1.5, 6));
        h._PRISMARINE = register(168, 0, "prismarine", block43);
        const block44 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._DIAMOND)._hardnessAndResistance(1.5, 6));
        h._PRISMARINE_BRICKS = register(168, 1, "prismarine_bricks", block44);
        const block45 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._DIAMOND)._hardnessAndResistance(1.5, 6));
        h._DARK_PRISMARINE = register(168, 2, "dark_prismarine", block45);
        if(proto >= 340){
            register(-1, -1, "prismarine_stairs", new _StairsBlock(block43._getDefaultState(), _BlockProperties._from(block43._prop)));
            register(-1, -1, "prismarine_brick_stairs", new _StairsBlock(block44._getDefaultState(), _BlockProperties._from(block44._prop)));
            register(-1, -1, "dark_prismarine_stairs", new _StairsBlock(block45._getDefaultState(), _BlockProperties._from(block45._prop)));
            
            register(-1, -1, "prismarine_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._CYAN)._hardnessAndResistance(1.5, 6.0)));
            register(-1, -1, "prismarine_brick_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._DIAMOND)._hardnessAndResistance(1.5, 6.0)));
            register(-1, -1, "dark_prismarine_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._DIAMOND)._hardnessAndResistance(1.5, 6.0)));
        }
        register(169, 0, "sea_lantern", new _SeaLanternBlock(_BlockProperties._create(_Material._GLASS, _MaterialColor._QUARTZ)._hardnessAndResistance(0.3)._sound(_SoundType._GLASS)._lightValue(15)));
        register(170, 0, "hay_block", new _HayBlock(_BlockProperties._create(_Material._GRASS, _MaterialColor._YELLOW)._hardnessAndResistance(0.5)._sound(_SoundType._PLANT)));
        register(171, 0, "white_carpet", new _BlockCarpet(_DyeColor._WHITE, _BlockProperties._create(_Material._CARPET, _MaterialColor._SNOW)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 1, "orange_carpet", new _BlockCarpet(_DyeColor._ORANGE, _BlockProperties._create(_Material._CARPET, _MaterialColor._ADOBE)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 2, "magenta_carpet", new _BlockCarpet(_DyeColor._MAGENTA, _BlockProperties._create(_Material._CARPET, _MaterialColor._MAGENTA)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 3, "light_blue_carpet", new _BlockCarpet(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._CARPET, _MaterialColor._LIGHT_BLUE)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 4, "yellow_carpet", new _BlockCarpet(_DyeColor._YELLOW, _BlockProperties._create(_Material._CARPET, _MaterialColor._YELLOW)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 5, "lime_carpet", new _BlockCarpet(_DyeColor._LIME, _BlockProperties._create(_Material._CARPET, _MaterialColor._LIME)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 6, "pink_carpet", new _BlockCarpet(_DyeColor._PINK, _BlockProperties._create(_Material._CARPET, _MaterialColor._PINK)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 7, "gray_carpet", new _BlockCarpet(_DyeColor._GRAY, _BlockProperties._create(_Material._CARPET, _MaterialColor._GRAY)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 8, "light_gray_carpet", new _BlockCarpet(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._CARPET, _MaterialColor._LIGHT_GRAY)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 9, "cyan_carpet", new _BlockCarpet(_DyeColor._CYAN, _BlockProperties._create(_Material._CARPET, _MaterialColor._CYAN)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 10, "purple_carpet", new _BlockCarpet(_DyeColor._PURPLE, _BlockProperties._create(_Material._CARPET, _MaterialColor._PURPLE)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 11, "blue_carpet", new _BlockCarpet(_DyeColor._BLUE, _BlockProperties._create(_Material._CARPET, _MaterialColor._BLUE)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 12, "brown_carpet", new _BlockCarpet(_DyeColor._BROWN, _BlockProperties._create(_Material._CARPET, _MaterialColor._BROWN)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 13, "green_carpet", new _BlockCarpet(_DyeColor._GREEN, _BlockProperties._create(_Material._CARPET, _MaterialColor._GREEN)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 14, "red_carpet", new _BlockCarpet(_DyeColor._RED, _BlockProperties._create(_Material._CARPET, _MaterialColor._RED)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(171, 15, "black_carpet", new _BlockCarpet(_DyeColor._BLACK, _BlockProperties._create(_Material._CARPET, _MaterialColor._BLACK)._hardnessAndResistance(0.1)._sound(_SoundType._CLOTH)));
        register(172, 0, "terracotta", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(1.25, 4.2)));
        register(173, 0, "coal_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._BLACK)._hardnessAndResistance(5, 6)));
        register(174, 0, "packed_ice", new _BlockPackedIce(_BlockProperties._create(_Material._PACKED_ICE)._slipperiness(0.98)._hardnessAndResistance(0.5)._sound(_SoundType._GLASS)));
        register(175, 0, "sunflower", new _BlockTallFlower(_BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(175, 1, "lilac", new _BlockTallFlower(_BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(175, 4, "rose_bush", new _BlockTallFlower(_BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(175, 5, "peony", new _BlockTallFlower(_BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(175, 2, "tall_grass", new _BlockShearableDoublePlant(blockGrass, _BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        register(175, 3, "large_fern", new _BlockShearableDoublePlant(blockFern, _BlockProperties._create(_Material._VINE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._PLANT)));
        
        register(176, 0, "white_banner", new _BannerBlock(_DyeColor._WHITE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 1, "orange_banner", new _BannerBlock(_DyeColor._ORANGE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 2, "magenta_banner", new _BannerBlock(_DyeColor._MAGENTA, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 3, "light_blue_banner", new _BannerBlock(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 4, "yellow_banner", new _BannerBlock(_DyeColor._YELLOW, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 5, "lime_banner", new _BannerBlock(_DyeColor._LIME, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 6, "pink_banner", new _BannerBlock(_DyeColor._PINK, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 7, "gray_banner", new _BannerBlock(_DyeColor._GRAY, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 8, "light_gray_banner", new _BannerBlock(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 9, "cyan_banner", new _BannerBlock(_DyeColor._CYAN, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 10, "purple_banner", new _BannerBlock(_DyeColor._PURPLE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 11, "blue_banner", new _BannerBlock(_DyeColor._BLUE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 12, "brown_banner", new _BannerBlock(_DyeColor._BROWN, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 13, "green_banner", new _BannerBlock(_DyeColor._GREEN, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 14, "red_banner", new _BannerBlock(_DyeColor._RED, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(176, 15, "black_banner", new _BannerBlock(_DyeColor._BLACK, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 0, "white_wall_banner", new _WallBannerBlock(_DyeColor._WHITE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 1, "orange_wall_banner", new _WallBannerBlock(_DyeColor._ORANGE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 2, "magenta_wall_banner", new _WallBannerBlock(_DyeColor._MAGENTA, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 3, "light_blue_wall_banner", new _WallBannerBlock(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 4, "yellow_wall_banner", new _WallBannerBlock(_DyeColor._YELLOW, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 5, "lime_wall_banner", new _WallBannerBlock(_DyeColor._LIME, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 6, "pink_wall_banner", new _WallBannerBlock(_DyeColor._PINK, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 7, "gray_wall_banner", new _WallBannerBlock(_DyeColor._GRAY, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 8, "light_gray_wall_banner", new _WallBannerBlock(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 9, "cyan_wall_banner", new _WallBannerBlock(_DyeColor._CYAN, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 10, "purple_wall_banner", new _WallBannerBlock(_DyeColor._PURPLE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 11, "blue_wall_banner", new _WallBannerBlock(_DyeColor._BLUE, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 12, "brown_wall_banner", new _WallBannerBlock(_DyeColor._BROWN, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 13, "green_wall_banner", new _WallBannerBlock(_DyeColor._GREEN, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 14, "red_wall_banner", new _WallBannerBlock(_DyeColor._RED, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        register(177, 15, "black_wall_banner", new _WallBannerBlock(_DyeColor._BLACK, _BlockProperties._create(_Material._WOOD)._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
        
        const block46 = new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(0.8));
        h._RED_SANDSTONE = register(179, 0, "red_sandstone", block46);
        h._CHISELED_SANDSTONE = register(179, 1, "chiseled_red_sandstone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(0.8)));
        h._CUT_RED_SANDSTONE = register(179, 2, "cut_red_sandstone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(0.8)));
        register(180, 0, "red_sandstone_stairs", new _StairsBlock(block46._getDefaultState(), _BlockProperties._from(block46._prop)));
        register(126, 0, "oak_slab", new _SlabBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._WOOD)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(126, 1, "spruce_slab", new _SlabBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(126, 2, "birch_slab", new _SlabBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._SAND)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(126, 3, "jungle_slab", new _SlabBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._DIRT)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(126, 4, "acacia_slab", new _SlabBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._ADOBE)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(126, 5, "dark_oak_slab", new _SlabBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._BROWN)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(44, 0, "stone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(2, 6)));
        if(proto >= 480){
            register(-1, -1, "smooth_stone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(2, 6)));
        }
        register(44, 1, "sandstone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(2, 6)));
        if(proto >= 480){
            register(-1, -1, "cut_sandstone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(2, 6)));
        }
        register(44, 2, "petrified_oak_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._WOOD)._hardnessAndResistance(2, 6)));
        register(44, 3, "cobblestone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(2, 6)));
        register(44, 4, "brick_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._RED)._hardnessAndResistance(2, 6)));
        register(44, 5, "stone_brick_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(2, 6)));
        register(44, 6, "nether_brick_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._hardnessAndResistance(2, 6)));
        register(44, 7, "quartz_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(2, 6)));
        register(44, 8, "red_sandstone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(2, 6)));
        if(proto >= 480){
            register(-1, -1, "cut_red_sandstone_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(2, 6)));
        }
        register(-1, -1, "purpur_slab", new _SlabBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._MAGENTA)._hardnessAndResistance(2.0, 6.0)));
        
        h._SMOOTH_STONE = register(-1, -1, "smooth_stone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._STONE)._hardnessAndResistance(2.0, 6.0)));
        h._SMOOTH_SANDSTONE = register(-1, -1, "smooth_sandstone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(2.0, 6.0)));
        h._SMOOTH_QUARTZ = register(-1, -1, "smooth_quartz", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._QUARTZ)._hardnessAndResistance(2.0, 6.0)));
        h._SMOOTH_RED_SANDSTONE = register(-1, -1, "smooth_red_sandstone", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._ADOBE)._hardnessAndResistance(2.0, 6.0)));
        
        register(107, 1, "spruce_fence_gate", new _FenceGateBlock(_BlockProperties._create(_Material._WOOD, block4._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(107, 2, "birch_fence_gate", new _FenceGateBlock(_BlockProperties._create(_Material._WOOD, block5._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(107, 3, "jungle_fence_gate", new _FenceGateBlock(_BlockProperties._create(_Material._WOOD, block6._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(107, 4, "acacia_fence_gate", new _FenceGateBlock(_BlockProperties._create(_Material._WOOD, block7._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(107, 5, "dark_oak_fence_gate", new _FenceGateBlock(_BlockProperties._create(_Material._WOOD, block8._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        
        register(85, 1, "spruce_fence", new _FenceBlock(_BlockProperties._create(_Material._WOOD, block4._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(85, 2, "birch_fence", new _FenceBlock(_BlockProperties._create(_Material._WOOD, block5._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(85, 3, "jungle_fence", new _FenceBlock(_BlockProperties._create(_Material._WOOD, block6._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(85, 4, "acacia_fence", new _FenceBlock(_BlockProperties._create(_Material._WOOD, block7._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        register(85, 5, "dark_oak_fence", new _FenceBlock(_BlockProperties._create(_Material._WOOD, block8._prop._materialColor)._hardnessAndResistance(2, 3)._sound(_SoundType._WOOD)));
        
        register(64, 1, "spruce_door", new _DoorBlock(_BlockProperties._create(_Material._WOOD, block4._prop._materialColor)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(64, 2, "birch_door", new _DoorBlock(_BlockProperties._create(_Material._WOOD, block5._prop._materialColor)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(64, 3, "jungle_door", new _DoorBlock(_BlockProperties._create(_Material._WOOD, block6._prop._materialColor)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(64, 4, "acacia_door", new _DoorBlock(_BlockProperties._create(_Material._WOOD, block7._prop._materialColor)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        register(64, 5, "dark_oak_door", new _DoorBlock(_BlockProperties._create(_Material._WOOD, block8._prop._materialColor)._hardnessAndResistance(3)._sound(_SoundType._WOOD)));
        
        if(proto >= 107){
            h._END_ROD = register(-1, -1, "end_rod", new _EndRodBlock(_BlockProperties._create(_Material._CIRCUITS)._zeroHardnessAndResistance()._lightValue(14)._sound(_SoundType._WOOD)));
            
            h._CHORUS_PLANT = register(-1, -1, "chorus_plant", new _ChorusPlantBlock(_BlockProperties._create(_Material._PLANTS, _MaterialColor._PURPLE)._hardnessAndResistance(0.4)._sound(_SoundType._WOOD)));
            h._CHORUS_FLOWER = register(-1, -1, "chorus_flower", new _ChorusFlowerBlock(h._CHORUS_PLANT, _BlockProperties._create(_Material._PLANTS, _MaterialColor._PURPLE)._tickRandomly()._hardnessAndResistance(0.4)._sound(_SoundType._WOOD)));
            h._PURPUR_BLOCK = register(-1, -1, "purpur_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._MAGENTA)._hardnessAndResistance(1.5, 6.0)));
            h._PURPUR_PILLAR = register(-1, -1, "purpur_pillar", new _RotatedPillarBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._MAGENTA)._hardnessAndResistance(1.5, 6.0)));
            h._PURPUR_STAIRS = register(-1, -1, "purpur_stairs", new _StairsBlock(h._PURPUR_BLOCK._getDefaultState(), _BlockProperties._from(h._PURPUR_BLOCK._prop)));
            h._END_STONE_BRICKS = register(-1, -1, "end_stone_bricks", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(0.8)));
            
            h._BEETROOTS = register(-1, -1, "beetroots", new _BeetrootBlock(_BlockProperties._create(_Material._PLANTS)._setTranslucent()._tickRandomly()._zeroHardnessAndResistance()._sound(_SoundType._CROP)));
            h._GRASS_PATH = register(-1, -1, "grass_path", new _GrassPathBlock(_BlockProperties._create(_Material._EARTH)._hardnessAndResistance(0.65)._sound(_SoundType._PLANT)));
            h._END_GATEWAY = register(-1, -1, "end_gateway", new _EndGatewayBlock(_BlockProperties._create(_Material._PORTAL, _MaterialColor._BLACK)._setTranslucent()._lightValue(15)._hardnessAndResistance(-1.0, 3600000.0)._noDrops()));
            
            h._REPEATING_COMMAND_BLOCK = register(-1, -1, "repeating_command_block", new _CommandBlockBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._PURPLE)._hardnessAndResistance(-1.0, 3600000.0)._noDrops()));
            h._CHAIN_COMMAND_BLOCK = register(-1, -1, "chain_command_block", new _CommandBlockBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._GREEN)._hardnessAndResistance(-1.0, 3600000.0)._noDrops()));
           
            h._FROSTED_ICE = register(-1, -1, "frosted_ice", new _FrostedIceBlock(_BlockProperties._create(_Material._ICE)._slipperiness(0.98)._tickRandomly()._hardnessAndResistance(0.5)._sound(_SoundType._GLASS)));
            h._MAGMA_BLOCK = register(-1, -1, "magma_block", new _MagmaBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._lightValue(3)._tickRandomly()._hardnessAndResistance(0.5)));
            h._NETHER_WART_BLOCK = register(-1, -1, "nether_wart_block", new _Block(_BlockProperties._create(_Material._ORGANIC, _MaterialColor._RED)._hardnessAndResistance(1.0)._sound(_SoundType._WOOD)));
            h._RED_NETHER_BRICKS = register(-1, -1, "red_nether_bricks", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._NETHERRACK)._hardnessAndResistance(2.0, 6.0)));
            h._BONE_BLOCK = register(-1, -1, "bone_block", new _RotatedPillarBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._SAND)._hardnessAndResistance(2.0)));
            h._STRUCTURE_VOID = register(-1, -1, "structure_void", new _StructureVoidBlock(_BlockProperties._create(_Material._STRUCTURE_VOID)._setTranslucent()._noDrops()));
            h._OBSERVER = register(-1, -1, "observer", new _ObserverBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.0)));
            
            h._SHULKER_BOX = register(-1, -1, "shulker_box", new _ShulkerBoxBlock(-1, _BlockProperties._create(_Material._SHULKER)._hardnessAndResistance(2.0)._variableOpacity()));
           
            h._WHITE_SHULKER_BOX = register(-1, -1, "white_shulker_box", new _ShulkerBoxBlock(_DyeColor._WHITE, _BlockProperties._create(_Material._SHULKER, _MaterialColor._SNOW)._hardnessAndResistance(2.0)._variableOpacity()));
            h._ORANGE_SHULKER_BOX = register(-1, -1, "orange_shulker_box", new _ShulkerBoxBlock(_DyeColor._ORANGE, _BlockProperties._create(_Material._SHULKER, _MaterialColor._ADOBE)._hardnessAndResistance(2.0)._variableOpacity()));
            h._MAGENTA_SHULKER_BOX = register(-1, -1, "magenta_shulker_box", new _ShulkerBoxBlock(_DyeColor._MAGENTA, _BlockProperties._create(_Material._SHULKER, _MaterialColor._MAGENTA)._hardnessAndResistance(2.0)._variableOpacity()));
            h._LIGHT_BLUE_SHULKER_BOX = register(-1, -1, "light_blue_shulker_box", new _ShulkerBoxBlock(_DyeColor._LIGHT_BLUE, _BlockProperties._create(_Material._SHULKER, _MaterialColor._LIGHT_BLUE)._hardnessAndResistance(2.0)._variableOpacity()));
            h._YELLOW_SHULKER_BOX = register(-1, -1, "yellow_shulker_box", new _ShulkerBoxBlock(_DyeColor._YELLOW, _BlockProperties._create(_Material._SHULKER, _MaterialColor._YELLOW)._hardnessAndResistance(2.0)._variableOpacity()));
            h._LIME_SHULKER_BOX = register(-1, -1, "lime_shulker_box", new _ShulkerBoxBlock(_DyeColor._LIME, _BlockProperties._create(_Material._SHULKER, _MaterialColor._LIME)._hardnessAndResistance(2.0)._variableOpacity()));
            h._PINK_SHULKER_BOX = register(-1, -1, "pink_shulker_box", new _ShulkerBoxBlock(_DyeColor._PINK, _BlockProperties._create(_Material._SHULKER, _MaterialColor._PINK)._hardnessAndResistance(2.0)._variableOpacity()));
            h._GRAY_SHULKER_BOX = register(-1, -1, "gray_shulker_box", new _ShulkerBoxBlock(_DyeColor._GRAY, _BlockProperties._create(_Material._SHULKER, _MaterialColor._GRAY)._hardnessAndResistance(2.0)._variableOpacity()));
            h._LIGHT_GRAY_SHULKER_BOX = register(-1, -1, "light_gray_shulker_box", new _ShulkerBoxBlock(_DyeColor._LIGHT_GRAY, _BlockProperties._create(_Material._SHULKER, _MaterialColor._LIGHT_GRAY)._hardnessAndResistance(2.0)._variableOpacity()));
            h._CYAN_SHULKER_BOX = register(-1, -1, "cyan_shulker_box", new _ShulkerBoxBlock(_DyeColor._CYAN, _BlockProperties._create(_Material._SHULKER, _MaterialColor._CYAN)._hardnessAndResistance(2.0)._variableOpacity()));
            h._PURPLE_SHULKER_BOX = register(-1, -1, "purple_shulker_box", new _ShulkerBoxBlock(_DyeColor._PURPLE, _BlockProperties._create(_Material._SHULKER, _MaterialColor._PURPLE_TERRACOTTA)._hardnessAndResistance(2.0)._variableOpacity()));
            h._BLUE_SHULKER_BOX = register(-1, -1, "blue_shulker_box", new _ShulkerBoxBlock(_DyeColor._BLUE, _BlockProperties._create(_Material._SHULKER, _MaterialColor._BLUE)._hardnessAndResistance(2.0)._variableOpacity()));
            h._BROWN_SHULKER_BOX = register(-1, -1, "brown_shulker_box", new _ShulkerBoxBlock(_DyeColor._BROWN, _BlockProperties._create(_Material._SHULKER, _MaterialColor._BROWN)._hardnessAndResistance(2.0)._variableOpacity()));
            h._GREEN_SHULKER_BOX = register(-1, -1, "green_shulker_box", new _ShulkerBoxBlock(_DyeColor._GREEN, _BlockProperties._create(_Material._SHULKER, _MaterialColor._GREEN)._hardnessAndResistance(2.0)._variableOpacity()));
            h._RED_SHULKER_BOX = register(-1, -1, "red_shulker_box", new _ShulkerBoxBlock(_DyeColor._RED, _BlockProperties._create(_Material._SHULKER, _MaterialColor._RED)._hardnessAndResistance(2.0)._variableOpacity()));
            h._BLACK_SHULKER_BOX = register(-1, -1, "black_shulker_box", new _ShulkerBoxBlock(_DyeColor._BLACK, _BlockProperties._create(_Material._SHULKER, _MaterialColor._BLACK)._hardnessAndResistance(2.0)._variableOpacity()));
            
            h._WHITE_GLAZED_TERRACOTTA = register(-1, -1, "white_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._WHITE)._hardnessAndResistance(1.4)));
            h._ORANGE_GLAZED_TERRACOTTA = register(-1, -1, "orange_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._ORANGE)._hardnessAndResistance(1.4)));
            h._MAGENTA_GLAZED_TERRACOTTA = register(-1, -1, "magenta_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._MAGENTA)._hardnessAndResistance(1.4)));
            h._LIGHT_BLUE_GLAZED_TERRACOTTA = register(-1, -1, "light_blue_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._LIGHT_BLUE)._hardnessAndResistance(1.4)));
            h._YELLOW_GLAZED_TERRACOTTA = register(-1, -1, "yellow_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._YELLOW)._hardnessAndResistance(1.4)));
            h._LIME_GLAZED_TERRACOTTA = register(-1, -1, "lime_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._LIME)._hardnessAndResistance(1.4)));
            h._PINK_GLAZED_TERRACOTTA = register(-1, -1, "pink_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._PINK)._hardnessAndResistance(1.4)));
            h._GRAY_GLAZED_TERRACOTTA = register(-1, -1, "gray_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._GRAY)._hardnessAndResistance(1.4)));
            h._LIGHT_GRAY_GLAZED_TERRACOTTA = register(-1, -1, "light_gray_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._LIGHT_GRAY)._hardnessAndResistance(1.4)));
            h._CYAN_GLAZED_TERRACOTTA = register(-1, -1, "cyan_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._CYAN)._hardnessAndResistance(1.4)));
            h._PURPLE_GLAZED_TERRACOTTA = register(-1, -1, "purple_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._PURPLE)._hardnessAndResistance(1.4)));
            h._BLUE_GLAZED_TERRACOTTA = register(-1, -1, "blue_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._BLUE)._hardnessAndResistance(1.4)));
            h._BROWN_GLAZED_TERRACOTTA = register(-1, -1, "brown_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._BROWN)._hardnessAndResistance(1.4)));
            h._GREEN_GLAZED_TERRACOTTA = register(-1, -1, "green_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._GREEN)._hardnessAndResistance(1.4)));
            h._RED_GLAZED_TERRACOTTA = register(-1, -1, "red_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._RED)._hardnessAndResistance(1.4)));
            h._BLACK_GLAZED_TERRACOTTA = register(-1, -1, "black_glazed_terracotta", new _GlazedTerracottaBlock(_BlockProperties._create(_Material._ROCK, _DyeColor._BLACK)._hardnessAndResistance(1.4)));
            
            h._WHITE_CONCRETE = register(-1, -1, "white_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._WHITE)._hardnessAndResistance(1.8)));
            h._ORANGE_CONCRETE = register(-1, -1, "orange_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._ORANGE)._hardnessAndResistance(1.8)));
            h._MAGENTA_CONCRETE = register(-1, -1, "magenta_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._MAGENTA)._hardnessAndResistance(1.8)));
            h._LIGHT_BLUE_CONCRETE = register(-1, -1, "light_blue_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._LIGHT_BLUE)._hardnessAndResistance(1.8)));
            h._YELLOW_CONCRETE = register(-1, -1, "yellow_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._YELLOW)._hardnessAndResistance(1.8)));
            h._LIME_CONCRETE = register(-1, -1, "lime_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._LIME)._hardnessAndResistance(1.8)));
            h._PINK_CONCRETE = register(-1, -1, "pink_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._PINK)._hardnessAndResistance(1.8)));
            h._GRAY_CONCRETE = register(-1, -1, "gray_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._GRAY)._hardnessAndResistance(1.8)));
            h._LIGHT_GRAY_CONCRETE = register(-1, -1, "light_gray_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._LIGHT_GRAY)._hardnessAndResistance(1.8)));
            h._CYAN_CONCRETE = register(-1, -1, "cyan_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._CYAN)._hardnessAndResistance(1.8)));
            h._PURPLE_CONCRETE = register(-1, -1, "purple_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._PURPLE)._hardnessAndResistance(1.8)));
            h._BLUE_CONCRETE = register(-1, -1, "blue_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._BLUE)._hardnessAndResistance(1.8)));
            h._BROWN_CONCRETE = register(-1, -1, "brown_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._BROWN)._hardnessAndResistance(1.8)));
            h._GREEN_CONCRETE = register(-1, -1, "green_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._GREEN)._hardnessAndResistance(1.8)));
            h._RED_CONCRETE = register(-1, -1, "red_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._RED)._hardnessAndResistance(1.8)));
            h._BLACK_CONCRETE = register(-1, -1, "black_concrete", new _Block(_BlockProperties._create(_Material._ROCK, _DyeColor._BLACK)._hardnessAndResistance(1.8)));
            
            h._WHITE_CONCRETE_POWDER = register(-1, -1, "white_concrete_powder", new _ConcretePowderBlock(h._WHITE_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._WHITE)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._ORANGE_CONCRETE_POWDER = register(-1, -1, "orange_concrete_powder", new _ConcretePowderBlock(h._ORANGE_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._ORANGE)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._MAGENTA_CONCRETE_POWDER = register(-1, -1, "magenta_concrete_powder", new _ConcretePowderBlock(h._MAGENTA_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._MAGENTA)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._LIGHT_BLUE_CONCRETE_POWDER = register(-1, -1, "light_blue_concrete_powder", new _ConcretePowderBlock(h._LIGHT_BLUE_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._LIGHT_BLUE)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._YELLOW_CONCRETE_POWDER = register(-1, -1, "yellow_concrete_powder", new _ConcretePowderBlock(h._YELLOW_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._YELLOW)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._LIME_CONCRETE_POWDER = register(-1, -1, "lime_concrete_powder", new _ConcretePowderBlock(h._LIME_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._LIME)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._PINK_CONCRETE_POWDER = register(-1, -1, "pink_concrete_powder", new _ConcretePowderBlock(h._PINK_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._PINK)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._GRAY_CONCRETE_POWDER = register(-1, -1, "gray_concrete_powder", new _ConcretePowderBlock(h._GRAY_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._GRAY)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._LIGHT_GRAY_CONCRETE_POWDER = register(-1, -1, "light_gray_concrete_powder", new _ConcretePowderBlock(h._LIGHT_GRAY_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._LIGHT_GRAY)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._CYAN_CONCRETE_POWDER = register(-1, -1, "cyan_concrete_powder", new _ConcretePowderBlock(h._CYAN_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._CYAN)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._PURPLE_CONCRETE_POWDER = register(-1, -1, "purple_concrete_powder", new _ConcretePowderBlock(h._PURPLE_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._PURPLE)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._BLUE_CONCRETE_POWDER = register(-1, -1, "blue_concrete_powder", new _ConcretePowderBlock(h._BLUE_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._BLUE)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._BROWN_CONCRETE_POWDER = register(-1, -1, "brown_concrete_powder", new _ConcretePowderBlock(h._BROWN_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._BROWN)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._GREEN_CONCRETE_POWDER = register(-1, -1, "green_concrete_powder", new _ConcretePowderBlock(h._GREEN_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._GREEN)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._RED_CONCRETE_POWDER = register(-1, -1, "red_concrete_powder", new _ConcretePowderBlock(h._RED_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._RED)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._BLACK_CONCRETE_POWDER = register(-1, -1, "black_concrete_powder", new _ConcretePowderBlock(h._BLACK_CONCRETE, _BlockProperties._create(_Material._SAND, _DyeColor._BLACK)._hardnessAndResistance(0.5)._sound(_SoundType._SAND)));
            h._KELP = register(-1, -1, "kelp", new _KelpTopBlock(_BlockProperties._create(_Material._OCEAN_PLANT)._setTranslucent()._tickRandomly()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._KELP_PLANT = register(-1, -1, "kelp_plant", new _KelpBlock(h._KELP, _BlockProperties._create(_Material._OCEAN_PLANT)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._DRIED_KELP_BLOCK = register(-1, -1, "dried_kelp_block", new _Block(_BlockProperties._create(_Material._ORGANIC, _MaterialColor._GREEN)._hardnessAndResistance(0.5, 2.5)._sound(_SoundType._PLANT)));
            
            
            h._TURTLE_EGG = register(-1, -1, "turtle_egg", new _TurtleEggBlock(_BlockProperties._create(_Material._DRAGON_EGG, _MaterialColor._SAND)._hardnessAndResistance(0.5)._sound(_SoundType._METAL)._tickRandomly()));
            
            h._DEAD_TUBE_CORAL_BLOCK = register(-1, -1, "dead_tube_coral_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._hardnessAndResistance(1.5, 6.0)));
            h._DEAD_BRAIN_CORAL_BLOCK = register(-1, -1, "dead_brain_coral_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._hardnessAndResistance(1.5, 6.0)));
            h._DEAD_BUBBLE_CORAL_BLOCK = register(-1, -1, "dead_bubble_coral_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._hardnessAndResistance(1.5, 6.0)));
            h._DEAD_FIRE_CORAL_BLOCK = register(-1, -1, "dead_fire_coral_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._hardnessAndResistance(1.5, 6.0)));
            h._DEAD_HORN_CORAL_BLOCK = register(-1, -1, "dead_horn_coral_block", new _Block(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._hardnessAndResistance(1.5, 6.0)));
            
            h._TUBE_CORAL_BLOCK = register(-1, -1, "tube_coral_block", new _CoralBlock(h._DEAD_TUBE_CORAL_BLOCK, _BlockProperties._create(_Material._ROCK, _MaterialColor._BLUE)._hardnessAndResistance(1.5, 6.0)._sound(_SoundType._CORAL)));
            h._BRAIN_CORAL_BLOCK = register(-1, -1, "brain_coral_block", new _CoralBlock(h._DEAD_BRAIN_CORAL_BLOCK, _BlockProperties._create(_Material._ROCK, _MaterialColor._PINK)._hardnessAndResistance(1.5, 6.0)._sound(_SoundType._CORAL)));
            h._BUBBLE_CORAL_BLOCK = register(-1, -1, "bubble_coral_block", new _CoralBlock(h._DEAD_BUBBLE_CORAL_BLOCK, _BlockProperties._create(_Material._ROCK, _MaterialColor._PURPLE)._hardnessAndResistance(1.5, 6.0)._sound(_SoundType._CORAL)));
            h._FIRE_CORAL_BLOCK = register(-1, -1, "fire_coral_block", new _CoralBlock(h._DEAD_FIRE_CORAL_BLOCK, _BlockProperties._create(_Material._ROCK, _MaterialColor._RED)._hardnessAndResistance(1.5, 6.0)._sound(_SoundType._CORAL)));
            h._HORN_CORAL_BLOCK = register(-1, -1, "horn_coral_block", new _CoralBlock(h._DEAD_HORN_CORAL_BLOCK, _BlockProperties._create(_Material._ROCK, _MaterialColor._YELLOW)._hardnessAndResistance(1.5, 6.0)._sound(_SoundType._CORAL)));
            
            h._DEAD_TUBE_CORAL = register(-1, -1, "dead_tube_coral", new _DeadCoralPlantBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_BRAIN_CORAL = register(-1, -1, "dead_brain_coral", new _DeadCoralPlantBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_BUBBLE_CORAL = register(-1, -1, "dead_bubble_coral", new _DeadCoralPlantBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_FIRE_CORAL = register(-1, -1, "dead_fire_coral", new _DeadCoralPlantBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_HORN_CORAL = register(-1, -1, "dead_horn_coral", new _DeadCoralPlantBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            
            h._TUBE_CORAL = register(-1, -1, "tube_coral", new _CoralPlantBlock(h._DEAD_TUBE_CORAL, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._BLUE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._BRAIN_CORAL = register(-1, -1, "brain_coral", new _CoralPlantBlock(h._DEAD_BRAIN_CORAL, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._PINK)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._BUBBLE_CORAL = register(-1, -1, "bubble_coral", new _CoralPlantBlock(h._DEAD_BUBBLE_CORAL, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._PURPLE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._FIRE_CORAL = register(-1, -1, "fire_coral", new _CoralPlantBlock(h._DEAD_FIRE_CORAL, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._RED)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._HORN_CORAL = register(-1, -1, "horn_coral", new _CoralPlantBlock(h._DEAD_HORN_CORAL, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._YELLOW)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            
            h._DEAD_TUBE_CORAL_FAN = register(-1, -1, "dead_tube_coral_fan", new _DeadCoralFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_BRAIN_CORAL_FAN = register(-1, -1, "dead_brain_coral_fan", new _DeadCoralFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_BUBBLE_CORAL_FAN = register(-1, -1, "dead_bubble_coral_fan", new _DeadCoralFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_FIRE_CORAL_FAN = register(-1, -1, "dead_fire_coral_fan", new _DeadCoralFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            h._DEAD_HORN_CORAL_FAN = register(-1, -1, "dead_horn_coral_fan", new _DeadCoralFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()));
            
            h._TUBE_CORAL_FAN = register(-1, -1, "tube_coral_fan", new _CoralFanBlock(h._DEAD_TUBE_CORAL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._BLUE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._BRAIN_CORAL_FAN = register(-1, -1, "brain_coral_fan", new _CoralFanBlock(h._DEAD_BRAIN_CORAL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._PINK)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._BUBBLE_CORAL_FAN = register(-1, -1, "bubble_coral_fan", new _CoralFanBlock(h._DEAD_BUBBLE_CORAL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._PURPLE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._FIRE_CORAL_FAN = register(-1, -1, "fire_coral_fan", new _CoralFanBlock(h._DEAD_FIRE_CORAL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._RED)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            h._HORN_CORAL_FAN = register(-1, -1, "horn_coral_fan", new _CoralFanBlock(h._DEAD_HORN_CORAL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._YELLOW)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)));
            
            h._DEAD_TUBE_CORAL_WALL_FAN = register(-1, -1, "dead_tube_coral_wall_fan", new _DeadCoralWallFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()._lootFrom(h._DEAD_TUBE_CORAL_FAN)));
            h._DEAD_BRAIN_CORAL_WALL_FAN = register(-1, -1, "dead_brain_coral_wall_fan", new _DeadCoralWallFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()._lootFrom(h._DEAD_BRAIN_CORAL_FAN)));
            h._DEAD_BUBBLE_CORAL_WALL_FAN = register(-1, -1, "dead_bubble_coral_wall_fan", new _DeadCoralWallFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()._lootFrom(h._DEAD_BUBBLE_CORAL_FAN)));
            h._DEAD_FIRE_CORAL_WALL_FAN = register(-1, -1, "dead_fire_coral_wall_fan", new _DeadCoralWallFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()._lootFrom(h._DEAD_FIRE_CORAL_FAN)));
            h._DEAD_HORN_CORAL_WALL_FAN = register(-1, -1, "dead_horn_coral_wall_fan", new _DeadCoralWallFanBlock(_BlockProperties._create(_Material._ROCK, _MaterialColor._GRAY)._setTranslucent()._zeroHardnessAndResistance()._lootFrom(h._DEAD_HORN_CORAL_FAN)));
            
            h._TUBE_CORAL_WALL_FAN = register(-1, -1, "tube_coral_wall_fan", new _CoralWallFanBlock(h._DEAD_TUBE_CORAL_WALL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._BLUE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)._lootFrom(h._TUBE_CORAL_FAN)));
            h._BRAIN_CORAL_WALL_FAN = register(-1, -1, "brain_coral_wall_fan", new _CoralWallFanBlock(h._DEAD_BRAIN_CORAL_WALL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._PINK)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)._lootFrom(h._TUBE_CORAL_FAN)));
            h._BUBBLE_CORAL_WALL_FAN = register(-1, -1, "bubble_coral_wall_fan", new _CoralWallFanBlock(h._DEAD_BUBBLE_CORAL_WALL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._PURPLE)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)._lootFrom(h._TUBE_CORAL_FAN)));
            h._FIRE_CORAL_WALL_FAN = register(-1, -1, "fire_coral_wall_fan", new _CoralWallFanBlock(h._DEAD_FIRE_CORAL_WALL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._RED)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)._lootFrom(h._TUBE_CORAL_FAN)));
            h._HORN_CORAL_WALL_FAN = register(-1, -1, "horn_coral_wall_fan", new _CoralWallFanBlock(h._DEAD_HORN_CORAL_WALL_FAN, _BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._YELLOW)._setTranslucent()._zeroHardnessAndResistance()._sound(_SoundType._WET_GRASS)._lootFrom(h._TUBE_CORAL_FAN)));
            
            h._SEA_PICKLE = register(-1, -1, "sea_pickle", new _SeaPickleBlock(_BlockProperties._create(_Material._OCEAN_PLANT, _MaterialColor._GREEN)._lightValue(3)._sound(_SoundType._SLIME)));
            h._BLUE_ICE = register(-1, -1, "blue_ice", new _BreakableBlock(_BlockProperties._create(_Material._PACKED_ICE)._hardnessAndResistance(2.8)._slipperiness(0.989)._sound(_SoundType._GLASS)));
            h._CONDUIT = register(-1, -1, "conduit", new _ConduitBlock(_BlockProperties._create(_Material._GLASS, _MaterialColor._DIAMOND)._hardnessAndResistance(3.0)._lightValue(15)));
            h._BAMBOO_SAPLING = register(-1, -1, "bamboo_sapling", new _BambooSaplingBlock(_BlockProperties._create(_Material._BAMBOO_SAPLING)._tickRandomly()._zeroHardnessAndResistance()._setTranslucent()._hardnessAndResistance(1.0)._sound(_SoundType._BAMBOO_SAPLING)));
            h._BAMBOO = register(-1, -1, "bamboo", new _BambooBlock(_BlockProperties._create(_Material._BAMBOO, _MaterialColor._FOLIAGE)._tickRandomly()._zeroHardnessAndResistance()._hardnessAndResistance(1.0)._sound(_SoundType._BAMBOO)));
            h._POTTED_BAMBOO = register(-1, -1, "potted_bamboo", new _FlowerPotBlock(h._BAMBOO, _BlockProperties._create(_Material._MISCELLANEOUS)._zeroHardnessAndResistance()));
            h._VOID_AIR = register(-1, -1, "void_air", new _AirBlock(_BlockProperties._create(_Material._AIR)._setTranslucent()._noDrops()));
            h._CAVE_AIR = register(-1, -1, "cave_air", new _AirBlock(_BlockProperties._create(_Material._AIR)._setTranslucent()._noDrops()));
            h._BUBBLE_COLUMN = register(-1, -1, "bubble_column", new _BubbleColumnBlock(_BlockProperties._create(_Material._BUBBLE_COLUMN)._setTranslucent()._noDrops()));
            h._POLISHED_GRANITE_STAIRS = register(-1, -1, "polished_granite_stairs", new _StairsBlock(h._POLISHED_GRANITE._getDefaultState(), _BlockProperties._from(h._POLISHED_GRANITE._prop)));
            h._SMOOTH_RED_SANDSTONE_STAIRS = register(-1, -1, "smooth_red_sandstone_stairs", new _StairsBlock(h._SMOOTH_RED_SANDSTONE._getDefaultState(), _BlockProperties._from(h._SMOOTH_RED_SANDSTONE._prop)));
            h._MOSSY_STONE_BRICK_STAIRS = register(-1, -1, "mossy_stone_brick_stairs", new _StairsBlock(h._MOSSY_STONE_BRICKS._getDefaultState(), _BlockProperties._from(h._MOSSY_STONE_BRICKS._prop)));
            h._POLISHED_DIORITE_STAIRS = register(-1, -1, "polished_diorite_stairs", new _StairsBlock(h._POLISHED_DIORITE._getDefaultState(), _BlockProperties._from(h._POLISHED_DIORITE._prop)));
            h._MOSSY_COBBLESTONE_STAIRS = register(-1, -1, "mossy_cobblestone_stairs", new _StairsBlock(h._MOSSY_COBBLESTONE._getDefaultState(), _BlockProperties._from(h._MOSSY_COBBLESTONE._prop)));
            h._END_STONE_BRICK_STAIRS = register(-1, -1, "end_stone_brick_stairs", new _StairsBlock(h._END_STONE_BRICKS._getDefaultState(), _BlockProperties._from(h._END_STONE_BRICKS._prop)));
            h._STONE_STAIRS = register(-1, -1, "stone_stairs", new _StairsBlock(h._STONE._getDefaultState(), _BlockProperties._from(h._STONE._prop)));
            h._SMOOTH_SANDSTONE_STAIRS = register(-1, -1, "smooth_sandstone_stairs", new _StairsBlock(h._SMOOTH_SANDSTONE._getDefaultState(), _BlockProperties._from(h._SMOOTH_SANDSTONE._prop)));
            h._SMOOTH_QUARTZ_STAIRS = register(-1, -1, "smooth_quartz_stairs", new _StairsBlock(h._SMOOTH_QUARTZ._getDefaultState(), _BlockProperties._from(h._SMOOTH_QUARTZ._prop)));
            h._GRANITE_STAIRS = register(-1, -1, "granite_stairs", new _StairsBlock(h._GRANITE._getDefaultState(), _BlockProperties._from(h._GRANITE._prop)));
            h._ANDESITE_STAIRS = register(-1, -1, "andesite_stairs", new _StairsBlock(h._ANDESITE._getDefaultState(), _BlockProperties._from(h._ANDESITE._prop)));
            h._RED_NETHER_BRICK_STAIRS = register(-1, -1, "red_nether_brick_stairs", new _StairsBlock(h._RED_NETHER_BRICKS._getDefaultState(), _BlockProperties._from(h._RED_NETHER_BRICKS._prop)));
            h._POLISHED_ANDESITE_STAIRS = register(-1, -1, "polished_andesite_stairs", new _StairsBlock(h._POLISHED_ANDESITE._getDefaultState(), _BlockProperties._from(h._POLISHED_ANDESITE._prop)));
            h._DIORITE_STAIRS = register(-1, -1, "diorite_stairs", new _StairsBlock(h._DIORITE._getDefaultState(), _BlockProperties._from(h._DIORITE._prop)));
            h._POLISHED_GRANITE_SLAB = register(-1, -1, "polished_granite_slab", new _SlabBlock(_BlockProperties._from(h._POLISHED_GRANITE._prop)));
            h._SMOOTH_RED_SANDSTONE_SLAB = register(-1, -1, "smooth_red_sandstone_slab", new _SlabBlock(_BlockProperties._from(h._SMOOTH_RED_SANDSTONE._prop)));
            h._MOSSY_STONE_BRICK_SLAB = register(-1, -1, "mossy_stone_brick_slab", new _SlabBlock(_BlockProperties._from(h._MOSSY_STONE_BRICKS._prop)));
            h._POLISHED_DIORITE_SLAB = register(-1, -1, "polished_diorite_slab", new _SlabBlock(_BlockProperties._from(h._POLISHED_DIORITE._prop)));
            h._MOSSY_COBBLESTONE_SLAB = register(-1, -1, "mossy_cobblestone_slab", new _SlabBlock(_BlockProperties._from(h._MOSSY_COBBLESTONE._prop)));
            h._END_STONE_BRICK_SLAB = register(-1, -1, "end_stone_brick_slab", new _SlabBlock(_BlockProperties._from(h._END_STONE_BRICKS._prop)));
            h._SMOOTH_SANDSTONE_SLAB = register(-1, -1, "smooth_sandstone_slab", new _SlabBlock(_BlockProperties._from(h._SMOOTH_SANDSTONE._prop)));
            h._SMOOTH_QUARTZ_SLAB = register(-1, -1, "smooth_quartz_slab", new _SlabBlock(_BlockProperties._from(h._SMOOTH_QUARTZ._prop)));
            h._GRANITE_SLAB = register(-1, -1, "granite_slab", new _SlabBlock(_BlockProperties._from(h._GRANITE._prop)));
            h._ANDESITE_SLAB = register(-1, -1, "andesite_slab", new _SlabBlock(_BlockProperties._from(h._ANDESITE._prop)));
            h._RED_NETHER_BRICK_SLAB = register(-1, -1, "red_nether_brick_slab", new _SlabBlock(_BlockProperties._from(h._RED_NETHER_BRICKS._prop)));
            h._POLISHED_ANDESITE_SLAB = register(-1, -1, "polished_andesite_slab", new _SlabBlock(_BlockProperties._from(h._POLISHED_ANDESITE._prop)));
            h._DIORITE_SLAB = register(-1, -1, "diorite_slab", new _SlabBlock(_BlockProperties._from(h._DIORITE._prop)));
            h._BRICK_WALL = register(-1, -1, "brick_wall", new _WallBlock(_BlockProperties._from(h._BRICKS._prop)));
            h._PRISMARINE_WALL = register(-1, -1, "prismarine_wall", new _WallBlock(_BlockProperties._from(h._PRISMARINE._prop)));
            h._RED_SANDSTONE_WALL = register(-1, -1, "red_sandstone_wall", new _WallBlock(_BlockProperties._from(h._RED_SANDSTONE._prop)));
            h._MOSSY_STONE_BRICK_WALL = register(-1, -1, "mossy_stone_brick_wall", new _WallBlock(_BlockProperties._from(h._MOSSY_STONE_BRICKS._prop)));
            h._GRANITE_WALL = register(-1, -1, "granite_wall", new _WallBlock(_BlockProperties._from(h._GRANITE._prop)));
            h._STONE_BRICK_WALL = register(-1, -1, "stone_brick_wall", new _WallBlock(_BlockProperties._from(h._STONE_BRICKS._prop)));
            h._NETHER_BRICK_WALL = register(-1, -1, "nether_brick_wall", new _WallBlock(_BlockProperties._from(h._NETHER_BRICKS._prop)));
            h._ANDESITE_WALL = register(-1, -1, "andesite_wall", new _WallBlock(_BlockProperties._from(h._ANDESITE._prop)));
            h._RED_NETHER_BRICK_WALL = register(-1, -1, "red_nether_brick_wall", new _WallBlock(_BlockProperties._from(h._RED_NETHER_BRICKS._prop)));
            h._SANDSTONE_WALL = register(-1, -1, "sandstone_wall", new _WallBlock(_BlockProperties._from(h._SANDSTONE._prop)));
            h._END_STONE_BRICK_WALL = register(-1, -1, "end_stone_brick_wall", new _WallBlock(_BlockProperties._from(h._END_STONE_BRICKS._prop)));
            h._DIORITE_WALL = register(-1, -1, "diorite_wall", new _WallBlock(_BlockProperties._from(h._DIORITE._prop)));
            h._SCAFFOLDING = register(-1, -1, "scaffolding", new _ScaffoldingBlock(_BlockProperties._create(_Material._MISCELLANEOUS, _MaterialColor._SAND)._setTranslucent()._sound(_SoundType._SCAFFOLDING)._variableOpacity()));
            h._LOOM = register(-1, -1, "loom", new _LoomBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
            h._BARREL = register(-1, -1, "barrel", new _BarrelBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
            h._SMOKER = register(-1, -1, "smoker", new _SmokerBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.5)._lightValue(13)));
            h._BLAST_FURNACE = register(-1, -1, "blast_furnace", new _BlastFurnaceBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.5)._lightValue(13)));
            h._CARTOGRAPHY_TABLE = register(-1, -1, "cartography_table", new _CartographyTableBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
            h._FLETCHING_TABLE = register(-1, -1, "fletching_table", new _FletchingTableBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
            h._GRINDSTONE = register(-1, -1, "grindstone", new _GrindstoneBlock(_BlockProperties._create(_Material._ANVIL, _MaterialColor._IRON)._hardnessAndResistance(2.0, 6.0)._sound(_SoundType._STONE)));
            h._LECTERN = register(-1, -1, "lectern", new _LecternBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
            h._SMITHING_TABLE = register(-1, -1, "smithing_table", new _SmithingTableBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(2.5)._sound(_SoundType._WOOD)));
            h._STONECUTTER = register(-1, -1, "stonecutter", new _StonecutterBlock(_BlockProperties._create(_Material._ROCK)._hardnessAndResistance(3.5)));
            h._BELL = register(-1, -1, "bell", new _BellBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._GOLD)._hardnessAndResistance(5.0)._sound(_SoundType._ANVIL)));
            h._LANTERN = register(-1, -1, "lantern", new _LanternBlock(_BlockProperties._create(_Material._IRON)._hardnessAndResistance(3.5)._sound(_SoundType._LANTERN)._lightValue(15)));
            h._CAMPFIRE = register(-1, -1, "campfire", new _CampfireBlock(_BlockProperties._create(_Material._WOOD, _MaterialColor._OBSIDIAN)._hardnessAndResistance(2.0)._sound(_SoundType._WOOD)._lightValue(15)._tickRandomly()));
            h._SWEET_BERRY_BUSH = register(-1, -1, "sweet_berry_bush", new _SweetBerryBushBlock(_BlockProperties._create(_Material._PLANTS)._tickRandomly()._setTranslucent()._sound(_SoundType._SWEET_BERRY_BUSH)));
            h._STRUCTURE_BLOCK = register(-1, -1, "structure_block", new _StructureBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._LIGHT_GRAY)._hardnessAndResistance(-1.0, 3600000.0)._noDrops()));
            h._JIGSAW = register(-1, -1, "jigsaw", new _JigsawBlock(_BlockProperties._create(_Material._IRON, _MaterialColor._LIGHT_GRAY)._hardnessAndResistance(-1.0, 3600000.0)._noDrops()));
            h._COMPOSTER = register(-1, -1, "composter", new _ComposterBlock(_BlockProperties._create(_Material._WOOD)._hardnessAndResistance(0.6)._sound(_SoundType._WOOD)));
        }
        this._postRegister();
    }

}
