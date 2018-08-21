import { OutputNode } from "../machine/node";
import { render } from "preact";
import { Graph, GraphNode, GraphEdge } from "../machine/graph";


export class GraphEditor {

    private canvas: HTMLCanvasElement = document.getElementById('graph-editor') as HTMLCanvasElement
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')

    private draggingElement: GraphNode = null

    private readonly fontSize = 20
    private readonly font = `${this.fontSize}px Arial`

    constructor(private graph: Graph) {
        window.addEventListener("resize", () => this.resizeCavnas())
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e))
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e))
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e))
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e))
        this.resizeCavnas()
        this.calculatePositions()
    }

    private onMouseDown(e: MouseEvent) {
        this.draggingElement = this.graph.nodes.find(node => {
            return e.x > node.position.x - node.size.x / 2
                && e.x < node.position.x + node.size.x / 2
                && e.y > node.position.y - node.size.y / 2
                && e.y < node.position.y + node.size.y / 2
        })
        console.log(this.draggingElement)
    }

    private onMouseMove(e: MouseEvent) {
        if(this.draggingElement) {
            this.draggingElement.position.x += e.movementX
            this.draggingElement.position.y += e.movementY
        }
    }

    private onMouseUp(e: MouseEvent) {
        this.draggingElement = null
    }

    private resizeCavnas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.render()
    }

    private drawNode(node: GraphNode) {
        //Anchor point is always on the center
        const pos = node.position
        const size = node.size
        //Draw rect
        this.ctx.strokeStyle = "#000"
        this.ctx.strokeRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y)
        //Draw text
        this.ctx.font = this.font
        this.ctx.fillStyle = "#000"
        this.ctx.fillText(node.machineNode.output, pos.x - node.size.text / 2, pos.y + this.fontSize / 2)
    }

    private drawEdge(edge: GraphEdge) {
        const pos1 = edge.from.position
        const pos2 = edge.to.position

        const size1 = edge.from.size
        const size2 = edge.to.size

        const ctrl = (pos2.x - pos1.x) * 0.3

        this.ctx.strokeStyle = "#000"

        this.ctx.beginPath()
        this.ctx.moveTo(pos1.x + size1.x / 2, pos1.y)
        this.ctx.bezierCurveTo(pos1.x + size1.x / 2 + ctrl, pos1.y, pos2.x - size2.x / 2 - ctrl, pos2.y, pos2.x - size2.x / 2, pos2.y)
        this.ctx.stroke()
        this.ctx.closePath()
    }

    private calculatePositions() {

        const levels = this.graph.nodes.reduce((levels: GraphNode[][], node: GraphNode) => {
            if(!levels[node.level]) {
                levels[node.level] = []
            }
            levels[node.level].push(node)
            return levels
        }, [])

        for(let i = 0; i < levels.length; i++) {
            for(let j = 0; j < levels[i].length; j++) {
                const node = levels[i][j]
                node.position.x = (this.canvas.width / (levels.length + 1)) * (i + 1)
                node.position.y = (this.canvas.height / (levels[i].length + 1)) * (j + 1)
                //node.position.y = Math.random() * (this.canvas.height - 200) + 100

                this.ctx.font = this.font
                const textSize = this.ctx.measureText(node.machineNode.output)
                node.size.text = textSize.width
                node.size.x = textSize.width + 20
                node.size.y = 60
            }
        }

    }

    private clear() {
        this.ctx.fillStyle = "#FFF"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    destroy() {
        window.removeEventListener("resize", this.resizeCavnas)
    }

    render() {
        this.clear()
        this.graph.nodes.forEach(node => this.drawNode(node))
        this.graph.edges.forEach(edge => this.drawEdge(edge))
        requestAnimationFrame(() => this.render())
    }

}