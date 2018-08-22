import { MachineNode, OutputNode, InputNode, ProducerNode, output, producer, input } from "./node";
import { unwatchFile } from "fs";
import { getRecipe, ItemName, getIngredients } from "../items/items";


export interface GraphNode {
    position: { x: number, y: number }
    size: { x: number, y: number }
    level: number
    machineNode: MachineNode
    color?: string
}

export interface GraphEdge {
    readonly from: GraphNode
    readonly to: GraphNode
}

export interface Graph {
    readonly nodes: GraphNode[]
    readonly edges: GraphEdge[]
}

export function validateGraph(outputs: OutputNode[]) {
    new GraphValidator(outputs).validate()
}

export class GraphValidator {

    private states: Map<MachineNode, boolean> = new Map()

    constructor(private outputs: OutputNode[]) {}

    validate() {
        for(let output of this.outputs) {
            this.visit(output)
        }
    }

    private checkOutputNode(node: OutputNode) {
        const parents = Object.keys(node.parents) as ItemName[]
        if(parents.length === 0) {
            throw new Error(`OutputNode[${node.output}] is missing a parent (parents: ${parents.join(', ')}).`)
        }
    }

    private checkProducerNode(node: ProducerNode) {
        const parents = Object.keys(node.parents) as ItemName[]
        const recipe = Object.keys(getRecipe(node.output)) as ItemName[]
        //Only need to check if all ingredients are satisfied
        //Checking if parents are valid is done in MachineNode.setParent()
        for(let item of recipe) {
            if(!parents.includes(item)) {
                throw new Error(`Missing input ${item} in ProducerNode[${node.output}]`)
            }
        }
    }

    private visit(node: MachineNode) {
        //Already visited or is InputNode
        if(this.states.has(node) || node instanceof InputNode) {
            return
        }

        this.states.set(node, true)

        //Not yet visited
        if(node instanceof OutputNode) {
            this.checkOutputNode(node)
        } else if(node instanceof ProducerNode) {
            this.checkProducerNode(node)
        }
    }

}

export function convertGraph(outputs: OutputNode[]): Graph {
    const graph = new GraphConverter(outputs).convert()
    return graph
}

export class GraphConverter {

    private nodes: GraphNode[] = []
    private edges: GraphEdge[] = []
    private states: Map<MachineNode, boolean> = new Map()

    constructor(readonly outputs: OutputNode[]) {}

    convert(): Graph {
        this.visitOutputs()
        return {
            nodes: this.nodes,
            edges: this.edges
        }
    }

    private visitOutputs() {
        this.outputs.forEach(output => {
            this.visit(output)
        })
    }

    private visit(current: MachineNode) : GraphNode {

        if(this.states.has(current)) {
            return this.nodes.find(node => node.machineNode === current)
        }

        const currentNode: GraphNode = {
            machineNode: current,
            level: 0,
            position: { x: 0, y: 0 },
            size: { x: 0, y: 0 }
        }

        if(!(current instanceof InputNode)) {
            const parents = Object.values(current.parents)
            for(let parent of parents) {
                let parentNode = this.visit(parent)
                if(parentNode.level >= currentNode.level) {
                    currentNode.level = parentNode.level + 1
                }
                this.edges.push({ from: parentNode, to: currentNode })
            }
        }

        this.nodes.push(currentNode)
        this.states.set(current, true)

        return currentNode

        // if(!this.states.has(current)) {
        //     this.nodes.push({ machineNode: current, position: { x: 0, y: 0 } })
        //     if(!(current instanceof InputNode)) {
        //         const parents: MachineNode[] = Object.values(current.parents)
        //         for(let parent of parents) {
        //             this.edges.push({ from: parent, to: current })
        //             this.visit(parent)
        //         }
        //     }
        //     this.states.set(current, true)
        // }

    }

}


export function generateGraph(...item: ItemName[]) {
    return new GraphGenerator(item).generate()
}

export class GraphGenerator {

    private producers: Map<ItemName, ProducerNode> = new Map()
    private inputs: Map<ItemName, InputNode> = new Map()

    constructor(readonly items: ItemName[]) {}

    generate() : OutputNode[] {
        const outputs: OutputNode[] = []
        for(let item of this.items) {
            outputs.push(this.createOutput(item))
        }
        return outputs
    }

    private createNode(item: ItemName) : MachineNode {
        const ingredients = getIngredients(getRecipe(item))
        if(ingredients.length === 0) {
            return this.createInput(item)
        } else {
            return this.createProducer(item, ingredients)
        }
    }

    private createOutput(item) : OutputNode {
        const node = output(item)
        //Visit producer
        const parent = this.createNode(item)
        //Connect to producer
        node.setParent(parent)
        return node
    }

    //Recursive
    private createProducer(item: ItemName, ingredients: ItemName[]) : MachineNode {
        //Already exists
        if(this.producers.has(item)) {
            return this.producers.get(item)
        }

        //Create new
        const node = producer(item)
        this.producers.set(item, node)
        for(let ingredient of ingredients) {
            const parent = this.createNode(ingredient)
            node.setParent(parent)            
        }

        return node
    }

    private createInput(item: ItemName) : InputNode {
        //Exists
        if(this.inputs.has(item)) {
            return this.inputs.get(item)
        }
        //Create new
        const node = input(item)
        this.inputs.set(item, node)
        return node
    }

}