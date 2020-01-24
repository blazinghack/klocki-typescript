import { _Klocki } from "../client/Klocki";
import { _Block } from "../block/Block";

import { _Item } from "./Item";
import { _ItemBlock, _ItemColored, _ItemMultiTexture } from "./ItemBlock";
import { _ItemAxe, _ItemBow, _ItemCoal, _ItemFlintAndSteel, _ItemFood, _ItemPickaxe, _ItemSpade, _ItemSword } from "./Items";
import { _CreativeTabs } from "./CreativeTabs";

export class _ItemRegistry {
    public _klocki: _Klocki;
    public _itemsByLegacyID: _Item[];

    public constructor(klocki: _Klocki) {
        this._klocki = klocki;
        this._itemsByLegacyID = new Array<_Item>(1024);
    }
    public _registerItems() {
        const registerItemBlock = (b: _Block, i?: _ItemBlock) => {

        };
        const registerItem = (legacyId: number, name: string, i: _Item) => {
            this._itemsByLegacyID[legacyId] = i;
            i._setName(name);
        };
        const h = this._klocki._blockRegistry._helper;
        registerItemBlock(h._STONE!, (new _ItemMultiTexture(h._STONE!, h._STONE!))._setUnlocalizedName("stone"));
        registerItemBlock(h._GRASS!, new _ItemColored(h._GRASS!, false));
        registerItemBlock(h._DIRT!, (new _ItemMultiTexture(h._DIRT!, h._DIRT!))._setUnlocalizedName("dirt"));
        registerItemBlock(h._COBBLESTONE!);
        registerItemBlock(h._OAK_PLANKS!, (new _ItemMultiTexture(h._OAK_PLANKS!, h._OAK_PLANKS!))._setUnlocalizedName("wood"));
        registerItemBlock(h._OAK_SAPLING!, (new _ItemMultiTexture(h._OAK_SAPLING!, h._OAK_SAPLING!))._setUnlocalizedName("sapling"));
        registerItemBlock(h._BEDROCK!);
        
        // TODO

        registerItem(256, "iron_shovel", (new _ItemSpade(_Item._ToolMaterial._IRON))._setUnlocalizedName("shovelIron"));
        registerItem(257, "iron_pickaxe", (new _ItemPickaxe(_Item._ToolMaterial._IRON))._setUnlocalizedName("pickaxeIron"));
        registerItem(258, "iron_axe", (new _ItemAxe(_Item._ToolMaterial._IRON))._setUnlocalizedName("hatchetIron"));
        registerItem(259, "flint_and_steel", (new _ItemFlintAndSteel())._setUnlocalizedName("flintAndSteel"));
        registerItem(260, "apple", (new _ItemFood(4, 0.3, false))._setUnlocalizedName("apple"));
        registerItem(261, "bow", (new _ItemBow())._setUnlocalizedName("bow"));
        registerItem(262, "arrow", (new _Item())._setUnlocalizedName("arrow")._setCreativeTab(_CreativeTabs._tabCombat));
        registerItem(263, "coal", (new _ItemCoal())._setUnlocalizedName("coal"));
        registerItem(264, "diamond", (new _Item())._setUnlocalizedName("diamond")._setCreativeTab(_CreativeTabs._tabMaterials));
        registerItem(265, "iron_ingot", (new _Item())._setUnlocalizedName("ingotIron")._setCreativeTab(_CreativeTabs._tabMaterials));
        registerItem(266, "gold_ingot", (new _Item())._setUnlocalizedName("ingotGold")._setCreativeTab(_CreativeTabs._tabMaterials));
        registerItem(267, "iron_sword", (new _ItemSword(_Item._ToolMaterial._IRON))._setUnlocalizedName("swordIron"));
        registerItem(268, "wooden_sword", (new _ItemSword(_Item._ToolMaterial._WOOD))._setUnlocalizedName("swordWood"));
        registerItem(269, "wooden_shovel", (new _ItemSpade(_Item._ToolMaterial._WOOD))._setUnlocalizedName("shovelWood"));
        registerItem(270, "wooden_pickaxe", (new _ItemPickaxe(_Item._ToolMaterial._WOOD))._setUnlocalizedName("pickaxeWood"));
        registerItem(271, "wooden_axe", (new _ItemAxe(_Item._ToolMaterial._WOOD))._setUnlocalizedName("hatchetWood"));
        registerItem(272, "stone_sword", (new _ItemSword(_Item._ToolMaterial._STONE))._setUnlocalizedName("swordStone"));
        registerItem(273, "stone_shovel", (new _ItemSpade(_Item._ToolMaterial._STONE))._setUnlocalizedName("shovelStone"));
        registerItem(274, "stone_pickaxe", (new _ItemPickaxe(_Item._ToolMaterial._STONE))._setUnlocalizedName("pickaxeStone"));
        registerItem(275, "stone_axe", (new _ItemAxe(_Item._ToolMaterial._STONE))._setUnlocalizedName("hatchetStone"));
        registerItem(276, "diamond_sword", (new _ItemSword(_Item._ToolMaterial._DIAMOND))._setUnlocalizedName("swordDiamond"));
        registerItem(277, "diamond_shovel", (new _ItemSpade(_Item._ToolMaterial._DIAMOND))._setUnlocalizedName("shovelDiamond"));
        registerItem(278, "diamond_pickaxe", (new _ItemPickaxe(_Item._ToolMaterial._DIAMOND))._setUnlocalizedName("pickaxeDiamond"));
        registerItem(279, "diamond_axe", (new _ItemAxe(_Item._ToolMaterial._DIAMOND))._setUnlocalizedName("hatchetDiamond"));
        // TODO
    }
}
