
export const ITEMS = require('./recipes.json') as Items

export function getRecipe(item: ItemName) {
    return ITEMS[item].recipe
}

export function getProducers(item: ItemName) {
    return ITEMS[item].producers
}

export type Items = {
    readonly [item in ItemName]: ItemInfo
}

export type ItemInfo = {
    readonly recipe: Recipe
    readonly producers: Array<ItemName>
    readonly time: number
}

export type Recipe = {
    readonly [item in ItemName]?: number;
}

export type ItemName =
    "WoodenChest" |
    "IronChest" |
    "SteelChest" |
    "StorageTank" |
    "TransportBelt" |
    "FastTransportBelt" |
    "ExpressTransportBelt" |
    "UndergroundBelt" |
    "FastUndergroundBelt" |
    "ExpressUndergroundBelt" |
    "Splitter" |
    "FastSplitter" |
    "ExpressSplitter" |
    "BurnerInserter" |
    "Inserter" |
    "LongHandedInserter" |
    "FastInserter" |
    "FilterInserter" |
    "StackInserter" |
    "StackFilterInserter" |
    "SmallElectricPole" |
    "MediumElectricPole" |
    "BigElectricPole" |
    "Substation" |
    "Pipe" |
    "PipeToGround" |
    "Pump" |
    "Rail" |
    "TrainStop" |
    "RailSignal" |
    "RailChainSignal" |
    "Locomotive" |
    "CargoWagon" |
    "FluidWagon" |
    "ArtilleryWagon" |
    "Car" |
    "Tank" |
    "LogisticRobot" |
    "ConstructionRobot" |
    "ActiveProviderChest" |
    "PassiveProviderChest" |
    "StorageChest" |
    "BufferChest" |
    "RequesterChest" |
    "Roboport" |
    "Lamp" |
    "RedWire" |
    "GreenWire" |
    "ArithmeticCombinator" |
    "DeciderCombinator" |
    "ConstantCombinator" |
    "PowerSwitch" |
    "ProgrammableSpeaker" |
    "StoneBrick" |
    "Concrete" |
    "HazardConcrete" |
    "RefinedConcrete" |
    "RefinedHazardConcrete" |
    "Landfill" |
    "CliffExplosives" |
    "IronAxe" |
    "SteelAxe" |
    "RepairPack" |
    "Blueprint" |
    "DeconstructionPlanner" |
    "BlueprintBook" |
    "Boiler" |
    "SteamEngine" |
    "SteamTurbine" |
    "SolarPanel" |
    "Accumulator" |
    "NuclearReactor" |
    "HeatExchanger" |
    "HeatPipe" |
    "BurnerMiningDrill" |
    "ElectricMiningDrill" |
    "OffshorePump" |
    "Pumpjack" |
    "StoneFurnace" |
    "SteelFurnace" |
    "ElectricFurnace" |
    "AssemblingMachine1" |
    "AssemblingMachine2" |
    "AssemblingMachine3" |
    "OilRefinery" |
    "ChemicalPlant" |
    "Centrifuge" |
    "Lab" |
    "Beacon" |
    "SpeedModule" |
    "SpeedModule2" |
    "SpeedModule3" |
    "EfficiencyModule" |
    "EfficiencyModule2" |
    "EfficiencyModule3" |
    "ProductivityModule" |
    "ProductivityModule2" |
    "ProductivityModule3" |
    "RawWood" |
    "Coal" |
    "Stone" |
    "IronOre" |
    "CopperOre" |
    "UraniumOre" |
    "RawFish" |
    "CrudeOil" |
    "HeavyOil" |
    "LightOil" |
    "Lubricant" |
    "PetroleumGas" |
    "SulfuricAcid" |
    "Water" |
    "Steam" |
    "Wood" |
    "IronPlate" |
    "CopperPlate" |
    "SolidFuel" |
    "SteelPlate" |
    "PlasticBar" |
    "Sulfur" |
    "Battery" |
    "Explosives" |
    "UraniumProcessing" |
    "CrudeOilBarrel" |
    "HeavyOilBarrel" |
    "LightOilBarrel" |
    "LubricantBarrel" |
    "PetroleumGasBarrel" |
    "SulfuricAcidBarrel" |
    "WaterBarrel" |
    "CopperCable" |
    "IronStick" |
    "IronGearWheel" |
    "EmptyBarrel" |
    "ElectronicCircuit" |
    "AdvancedCircuit" |
    "ProcessingUnit" |
    "EngineUnit" |
    "ElectricEngineUnit" |
    "FlyingRobotFrame" |
    "Satellite" |
    "RocketPart" |
    "RocketControlUnit" |
    "LowDensityStructure" |
    "RocketFuel" |
    "NuclearFuel" |
    "Uranium-235" |
    "Uranium-238" |
    "UraniumFuelCell" |
    "UsedUpUraniumFuelCell" |
    "NuclearFuelReprocessing" |
    "KovarexEnrichmentProcess" |
    "SciencePack1" |
    "SciencePack2" |
    "SciencePack3" |
    "MilitarySciencePack" |
    "ProductionSciencePack" |
    "HighTechSciencePack" |
    "SpaceSciencePack" |
    "Pistol" |
    "SubmachineGun" |
    "Shotgun" |
    "CombatShotgun" |
    "RocketLauncher" |
    "Flamethrower" |
    "LandMine" |
    "FirearmMagazine" |
    "PiercingRoundsMagazine" |
    "UraniumRoundsMagazine" |
    "ShotgunShells" |
    "PiercingShotgunShells" |
    "CannonShell" |
    "ExplosiveCannonShell" |
    "UraniumCannonShell" |
    "ExplosiveUraniumCannonShell" |
    "ArtilleryShell" |
    "Rocket" |
    "ExplosiveRocket" |
    "AtomicBomb" |
    "FlamethrowerAmmo" |
    "Grenade" |
    "ClusterGrenade" |
    "PoisonCapsule" |
    "SlowdownCapsule" |
    "DefenderCapsule" |
    "DistractorCapsule" |
    "DestroyerCapsule" |
    "DischargeDefenseRemote" |
    "ArtilleryTargetingRemote" |
    "LightArmor" |
    "HeavyArmor" |
    "ModularArmor" |
    "PowerArmor" |
    "PowerArmorMk2" |
    "PortableSolarPanel" |
    "PortableFusionReactor" |
    "EnergyShield" |
    "EnergyShieldMk2" |
    "BatteryMk1" |
    "BatteryMk2" |
    "PersonalLaserDefense" |
    "DischargeDefense" |
    "Exoskeleton" |
    "PersonalRoboport" |
    "PersonalRoboportMk2" |
    "Nightvision" |
    "StoneWall" |
    "Gate" |
    "GunTurret" |
    "LaserTurret" |
    "FlamethrowerTurret" |
    "ArtilleryTurret" |
    "Radar" |
    "RocketSilo"