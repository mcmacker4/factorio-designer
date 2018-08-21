import { MachineNode, OutputNode, InputNode } from "./node";
import { unwatchFile } from "fs";


export interface GraphNode {
    position: { x: number, y: number }
    size: { x: number, y: number, text: number }
    level: number
    machineNode: MachineNode
}

export interface GraphEdge {
    readonly from: GraphNode
    readonly to: GraphNode
}

export interface Graph {
    readonly nodes: GraphNode[]
    readonly edges: GraphEdge[]
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
            size: { x: 0, y: 0, text: 0 }
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