import { OutputNode, InputNode, ProducerNode } from "../machine/node";
import { Graph, GraphNode, GraphEdge } from "../machine/graph";
import { getRecipe, getProducers } from "../items/items";


export class GraphEditor {

    private canvas: HTMLCanvasElement = document.getElementById('graph-editor') as HTMLCanvasElement
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')

    private draggingElement: GraphNode = null
    private draggingPos = { x: 0, y: 0 }

    private view = { x: 0, y: 0, dragging: { x: 0, y: 0, active: false } }

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
            return e.x + this.view.x > node.position.x - node.size.x / 2
                && e.x + this.view.x < node.position.x + node.size.x / 2
                && e.y + this.view.y > node.position.y - node.size.y / 2
                && e.y + this.view.y < node.position.y + node.size.y / 2
        })
        if(this.draggingElement) {
            this.draggingPos = {
                x: this.draggingElement.position.x - e.x,
                y: this.draggingElement.position.y - e.y
            }
        } else {
            this.view.dragging.active = true
            this.view.dragging.x = e.x + this.view.x
            this.view.dragging.y = e.y + this.view.y
        }
    }

    private onMouseMove(e: MouseEvent) {
        if(this.draggingElement) {
            this.draggingElement.position.x = e.x + this.draggingPos.x
            this.draggingElement.position.y = e.y + this.draggingPos.y
        } else if(this.view.dragging.active) {
            this.view.x = this.view.dragging.x - e.x
            this.view.y = this.view.dragging.y - e.y
        }
    }

    private onMouseUp(e: MouseEvent) {
        this.draggingElement = null
        this.view.dragging.active = false
    }

    private resizeCavnas() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    private drawInputOrOutput(node: GraphNode) {
        this.ctx.save()
        const pos = node.position
        this.ctx.translate(pos.x - this.view.x, pos.y - this.view.y)
        const size = node.size

        this.ctx.beginPath()
        this.ctx.moveTo(-size.x / 2, -size.y / 2)

        this.ctx.lineTo(size.x / 2 - this.nodePadX, -size.y / 2)
        this.ctx.lineTo(size.x / 2 - this.nodePadX, -size.y / 2 - this.nodePadY)
        this.ctx.lineTo(size.x / 2, 0)
        this.ctx.lineTo(size.x / 2 - this.nodePadX, size.y / 2 + this.nodePadY)
        this.ctx.lineTo(size.x / 2 - this.nodePadX, size.y / 2)
        this.ctx.lineTo(-size.x / 2, size.y / 2)
        this.ctx.lineTo(-size.x / 2, -size.y / 2)
        
        this.ctx.fillStyle = "#FFF"
        this.ctx.fill()
        this.ctx.strokeStyle = "#000"
        this.ctx.lineWidth = 2
        this.ctx.stroke()
        this.ctx.closePath()

        if(node.machineNode instanceof OutputNode) {
            this.ctx.fillStyle = "#000"
            this.ctx.textBaseline = "middle"
            const textSize = this.ctx.measureText(node.machineNode.output).width
            this.ctx.fillText(node.machineNode.output, -textSize / 2, 0)
        } else {
            this.ctx.font = this.font
            this.ctx.fillStyle = "#000"
            this.ctx.textBaseline = "bottom"
            this.ctx.lineWidth = 0.5
            let textSize = this.ctx.measureText(node.machineNode.output).width
            this.ctx.fillText(node.machineNode.output, -textSize / 2, 0)
            this.ctx.strokeText(node.machineNode.output, -textSize / 2, 0)
            this.ctx.textBaseline = "top"
            const machineName = getProducers(node.machineNode.output)[0] || "Hand"
            textSize = this.ctx.measureText(machineName).width
            this.ctx.fillText(machineName, -textSize / 2, 0)
        }

        this.ctx.restore()
    }

    private drawProducer(node: GraphNode) {
        //Anchor point is always on the center
        this.ctx.save()
        const pos = node.position
        this.ctx.translate(pos.x - this.view.x, pos.y - this.view.y)
        const size = node.size
        const machineName = getProducers(node.machineNode.output)[0] || "Hand"
        //Draw rect
        this.ctx.fillStyle = "#FFF"
        this.ctx.fillRect(-size.x / 2, -size.y / 2, size.x, size.y)
        this.ctx.strokeStyle = "#000"
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y)
        //Draw text
        this.ctx.font = this.font
        this.ctx.fillStyle = "#000"
        this.ctx.textBaseline = "bottom"
        this.ctx.lineWidth = 0.5
        let textSize = this.ctx.measureText(node.machineNode.output).width
        this.ctx.fillText(node.machineNode.output, -textSize / 2, 0)
        this.ctx.strokeText(node.machineNode.output, -textSize / 2, 0)
        this.ctx.textBaseline = "top"
        textSize = this.ctx.measureText(machineName).width
        this.ctx.fillText(machineName, -textSize / 2, 0)
        this.ctx.restore()
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
        this.ctx.save()
        const pos1 = edge.from.position
        this.ctx.translate(pos1.x - this.view.x, pos1.y - this.view.y)
        const pos2 = { x: edge.to.position.x - pos1.x, y: edge.to.position.y - pos1.y }

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
        const diff = Math.abs((pos2.x - size2.x / 2) - (+size1.x / 2))
        const ctrl = diff > 20 ? (Math.abs(0.5*diff) + 15) : ((25*Math.pow(diff, 2)) / 2000 + 20)

        if(!edge.from.color) {
            edge.from.color = `hsl(${this.lastColor}, 100%, 50%)`
            this.lastColor += 50
        }

        this.ctx.beginPath()
        this.ctx.moveTo(size1.x / 2, 0)
        this.ctx.bezierCurveTo(size1.x / 2 + ctrl, 0, pos2.x - size2.x / 2 - ctrl, pos2.y, pos2.x - size2.x / 2, pos2.y)
        this.ctx.lineWidth = 2
        this.ctx.strokeStyle = edge.from.color
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.restore()
    }

    private calculatePositions() {

        const levels = this.graph.nodes.reduce((levels: GraphNode[][], node: GraphNode) => {
            if(!levels[node.level]) {
                levels[node.level] = []
            }
            levels[node.level].push(node)
            return levels
        }, [])

        let maxLevelWidth = 0
        for(let level of levels) {
            if(level.length > maxLevelWidth) {
                maxLevelWidth = level.length
            }
        }

        for(let i = 0; i < levels.length; i++) {
            for(let j = 0; j < levels[i].length; j++) {
                const node = levels[i][j]
                // node.position.x = (this.canvas.width / (levels.length + 1)) * (i + 1)
                // node.position.y = (this.canvas.height / (levels[i].length + 1)) * (j + 1)
                node.position.x = 300 * (i + 1)
                node.position.y = (maxLevelWidth * 200 / (levels[i].length + 1)) * (j + 1)

                this.ctx.font = this.font
                const textSize = this.ctx.measureText(node.machineNode.output).width
                node.size.x = textSize + this.nodePadX * 2
                if(node.machineNode instanceof ProducerNode || node.machineNode instanceof InputNode) {
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
        requestAnimationFrame(() => this.render())
    }

}