import { ItemName, getRecipe, getProducers, ItemInfo, ITEMS } from '../items/items'


/*
 * Helper Functions
 */

export function input(item: ItemName) {
    return new InputNode(item)
}

export function output(item: ItemName) {
    return new OutputNode(item)
}

export function producer(product: ItemName) {
    return new ProducerNode(product)
}

/*
 * Classes
 */

export type Parents = {
    [item in ItemName]?: MachineNode
}


export abstract class MachineNode {

    parents: Parents
    output: ItemName

    abstract setParent(parent: MachineNode)

}

export class InputNode extends MachineNode {

    constructor(readonly output: ItemName) {
        super()
    }

    setParent(parent: MachineNode) {
        throw new Error(`Inputs cannot have parents.`)
    }

}

export class OutputNode extends MachineNode {

    parents: Parents = {}

    constructor(readonly output: ItemName) {
        super()
    }

    setParent(parent: MachineNode) {
        if(parent.output !== this.output) {
            throw new Error(`Incompatible income[${parent.output}], expected [${this.output}]`)
        }
        if(this.parents[parent.output]) {
            console.log(`[Warning] OutputNode[${this.output}] input is being replaced!`)
        }
        this.parents[parent.output] = parent
    }
    
}

export class ProducerNode extends MachineNode {

    parents: Parents = {}
    productInfo: ItemInfo

    constructor(readonly output: ItemName) {
        super()
        this.productInfo = ITEMS[output]
    }

    setParent(parent: MachineNode) {
        if(!Object.keys(this.productInfo.recipe).includes(parent.output)) {
            throw new Error(`Incompatible income[${parent.output}], expected [${Object.keys(this.productInfo.recipe).join(', ')}]`)
        }
        if(this.parents[parent.output] != null) {
            throw new Error(`Already accepting ${parent.output}`)
        }
        this.parents[parent.output] = parent
    }

    setParents(...parents: MachineNode[]) {
        parents.forEach((parent) => this.setParent(parent))
    }

}