import { OutputNode, InputNode, ProducerNode } from "../machine/node";
import { Graph, GraphNode, GraphEdge } from "../machine/graph";
import { getRecipe, getProducers } from "../items/items";


export class GraphEditor {

    private canvas: HTMLCanvasElement = document.getElementById('graph-editor') as HTMLCanvasElement
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')

    private draggingElement: GraphNode = null
    private draggingPos = { x: 0, y: 0 }

    private readonly fontSize = 12
    private readonly font = `${this.fontSize}px Arial`
    private readonly nodePadX = 20
    private readonly nodePadY = 10

    private lastColor = 0

    constructor(private graph: Graph) {
        window.addEventListener("resize", () => this.resizeCavnas())
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e))
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e))
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e))
        this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e))
        this.resizeCavnas()
        this.calculatePositions()
        this.render()
    }

    private onMouseDown(e: MouseEvent) {
        this.draggingElement = this.graph.nodes.find(node => {
            return e.x > node.position.x - node.size.x / 2
                && e.x < node.position.x + node.size.x / 2
                && e.y > node.position.y - node.size.y / 2
                && e.y < node.position.y + node.size.y / 2
        })
        if(this.draggingElement) {
            this.draggingPos = {
                x: this.draggingElement.position.x - e.x,
                y: this.draggingElement.position.y - e.y
            }
        }
    }

    private onMouseMove(e: MouseEvent) {
        if(this.draggingElement) {
            this.draggingElement.position.x = e.x + this.draggingPos.x
            this.draggingElement.position.y = e.y + this.draggingPos.y
        }
        this.render()
    }

    private onMouseUp(e: MouseEvent) {
        this.draggingElement = null
    }

    private resizeCavnas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.calculatePositions()
        this.render()
    }

    private drawInputOrOutput(node: GraphNode) {
        const pos = node.position
        const size = node.size

        this.ctx.beginPath()
        this.ctx.moveTo(pos.x - size.x / 2, pos.y - size.y / 2)

        this.ctx.lineTo(pos.x + size.x / 2 - this.nodePadX, pos.y - size.y / 2)
        this.ctx.lineTo(pos.x + size.x / 2 - this.nodePadX, pos.y - size.y / 2 - this.nodePadY)
        this.ctx.lineTo(pos.x + size.x / 2, pos.y)
        this.ctx.lineTo(pos.x + size.x / 2 - this.nodePadX, pos.y + size.y / 2 + this.nodePadY)
        this.ctx.lineTo(pos.x + size.x / 2 - this.nodePadX, pos.y + size.y / 2)
        this.ctx.lineTo(pos.x - size.x / 2, pos.y + size.y / 2)
        this.ctx.lineTo(pos.x - size.x / 2, pos.y - size.y / 2)
        
        this.ctx.fillStyle = "#FFF"
        this.ctx.fill()
        this.ctx.strokeStyle = "#000"
        this.ctx.lineWidth = 2
        this.ctx.stroke()
        this.ctx.closePath()

        this.ctx.fillStyle = "#000"
        this.ctx.textBaseline = "middle"
        const textSize = this.ctx.measureText(node.machineNode.output).width
        this.ctx.fillText(node.machineNode.output, pos.x - textSize / 2, pos.y)
    }

    private drawProducer(node: GraphNode) {
        //Anchor point is always on the center
        const pos = node.position
        const size = node.size
        const machineName = getProducers(node.machineNode.output)[0]
        //Draw rect
        this.ctx.fillStyle = "#FFF"
        this.ctx.fillRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y)
        this.ctx.strokeStyle = "#000"
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y)
        //Draw text
        this.ctx.font = this.font
        this.ctx.fillStyle = "#000"
        this.ctx.textBaseline = "bottom"
        this.ctx.lineWidth = 0.5
        let textSize = this.ctx.measureText(node.machineNode.output).width
        this.ctx.fillText(node.machineNode.output, pos.x - textSize / 2, pos.y)
        this.ctx.strokeText(node.machineNode.output, pos.x - textSize / 2, pos.y)
        this.ctx.textBaseline = "top"
        textSize = this.ctx.measureText(machineName).width
        this.ctx.fillText(machineName, pos.x - textSize / 2, pos.y)
    }

    private drawNode(node: GraphNode) {
        if(node.machineNode instanceof InputNode || node.machineNode instanceof OutputNode) {
            this.drawInputOrOutput(node)
        } else if(node.machineNode instanceof ProducerNode) {
            this.drawProducer(node)
        } else {
            console.warn(`Unknown node type ${node}`)
        }
    }

    private drawEdge(edge: GraphEdge) {
        const pos1 = edge.from.position
        const pos2 = edge.to.position

        const size1 = edge.from.size
        const size2 = edge.to.size

        //sudden change from negative to positive
        // const ctrl = Math.abs(((pos2.x - size2.x / 2) - (pos1.x + size1.x / 2)) * 0.5)

        //smooth change using two functions (a quadratic and a line) tangent at x = 20
        // f(x) = {
        //     abs(x) > 20 => abs(0.5x) + 15
        //     abs(x) < 20 => 25 * pow(x, 2) / 2000 + 20
        // }
        //This is a wesome because it is both fancy and useless at the same time :)
        const diff = Math.abs((pos2.x - size2.x / 2) - (pos1.x + size1.x / 2))
        const ctrl = diff > 20 ? (Math.abs(0.5*diff) + 15) : ((25*Math.pow(diff, 2)) / 2000 + 20)

        if(!edge.from.color) {
            edge.from.color = `hsl(${this.lastColor}, 100%, 50%)`
            this.lastColor += 30
        }

        this.ctx.beginPath()
        this.ctx.moveTo(pos1.x + size1.x / 2, pos1.y)
        this.ctx.bezierCurveTo(pos1.x + size1.x / 2 + ctrl, pos1.y, pos2.x - size2.x / 2 - ctrl, pos2.y, pos2.x - size2.x / 2, pos2.y)
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = edge.from.color
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
                const textSize = this.ctx.measureText(node.machineNode.output).width
                node.size.x = textSize + this.nodePadX * 2
                if(node.machineNode instanceof ProducerNode) {
                    const machineName = getProducers(node.machineNode.output)[0]
                    const nameSize = this.ctx.measureText(machineName).width
                    if(nameSize > textSize) {
                        node.size.x = nameSize + this.nodePadX * 2
                    }
                    node.size.y = this.fontSize * 2 + this.nodePadY * 2
                } else {
                    node.size.y = this.fontSize + this.nodePadY * 2
                }
            }
        }

    }

    private clear() {
        this.ctx.fillStyle = 'hsl(0, 0%, 50%)'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    render() {
        this.clear()
        this.graph.edges.forEach(edge => this.drawEdge(edge))
        this.graph.nodes.forEach(node => this.drawNode(node))
    }

}