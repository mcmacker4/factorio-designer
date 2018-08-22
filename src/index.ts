import { input, output, producer } from './machine/node'
import { convertGraph, validateGraph, generateGraph } from './machine/graph';
import { GraphEditor } from './gui/GUI';
import { ITEMS, ItemName } from './items/items';


const allItems = Object.keys(ITEMS) as ItemName[]
const item = allItems[Math.floor(Math.random() * allItems.length)]
//console.log(item)
//const out = generateGraph("LaserTurret")
const out = generateGraph(item)

validateGraph(out)
new GraphEditor(convertGraph(out))