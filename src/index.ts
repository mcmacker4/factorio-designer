import { input, output, producer } from './machine/node'
import { convertGraph, validateGraph, generateGraph } from './machine/graph';
import { GraphEditor } from './gui/GUI';
import { ITEMS, ItemName } from './items/items';


const allItems = Object.keys(ITEMS) as ItemName[]
const item = allItems[Math.floor(Math.random() * allItems.length)]
drawGraph(item)

function drawGraph(...items: ItemName[]) {
    const out = generateGraph(...items)
    validateGraph(out)
    new GraphEditor(convertGraph(out))
}

window['drawGraph'] = drawGraph