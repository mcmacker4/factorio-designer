import { input, output, producer } from './machine/node'
import { convertGraph } from './machine/graph';
import { GraphEditor } from './gui/GUI';

//Nodes

const ironInput = input("IronOre")
const ironPlateProd = producer("IronPlate")

const ironGearProd = producer("IronGearWheel")
const beltProd = producer("TransportBelt")

const beltOut = output("TransportBelt")

//Edges

ironPlateProd.setParent(ironInput)
ironGearProd.setParent(ironPlateProd)

beltProd.setParents(ironPlateProd, ironGearProd)

beltOut.setParent(beltProd)

new GraphEditor(convertGraph([beltOut]))