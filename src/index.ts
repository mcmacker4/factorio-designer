import { input, output, producer } from './machine/node'
import { convertGraph, validateGraph, generateGraph } from './machine/graph';
import { GraphEditor } from './gui/GUI';


// Transport Belt Machine

// //Nodes

// const ironInput = input("IronOre")

// const ironPlateProd = producer("IronPlate")

// const ironGearProd = producer("IronGearWheel")
// const beltProd = producer("TransportBelt")

// const beltOut = output("TransportBelt")

// //Edges

// ironPlateProd.setParent(ironInput)
// ironGearProd.setParent(ironPlateProd)
// beltProd.setParents(ironPlateProd, ironGearProd)
// beltOut.setParent(beltProd)

const out = generateGraph("RocketPart")

validateGraph(out)
new GraphEditor(convertGraph(out))