import * as Preact from 'preact'; Preact;
import { Graph, GraphNode } from '../../machine/graph';
import { OutputNode, MachineNode } from '../../machine/node';

interface Position {
    x: number
    y: number
}

interface OutputProps { node: OutputNode, pos: Position }
export class Output extends Preact.Component<OutputProps> {

    render({ node, pos }: OutputProps) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
        text.setAttribute("text-anchor", "middle")
        text.setAttribute("alignment-baseline", "central")
        text.textContent = node.output
        const { width, height } = text.getBBox()
        const rectPos = { x: pos.x - width/2 - 10, y: pos.y - height/2 - 10 }
        return (
            <g>
                <rect x={rectPos.x} y={rectPos.y} width={width + 20} height={height + 20} />
                <text x={pos.x} y={pos.y} text-anchor="middle" alignment-baseline="central">{node.output}</text>
            </g>
        )
    }

}

interface GraphViewProps { graph: Graph }

export class GraphView extends Preact.Component<GraphViewProps> {

    render({ graph }: GraphViewProps) {
        return (
            <svg>
                { graph.nodes.map((node: GraphNode) => {
                    if(node instanceof OutputNode) {
                        return <Output node={node} pos={{ x: 100, y: 50 }} />
                    }
                })}
            </svg>
        )
    }

}
