import * as Preact from 'preact'; Preact;
import { GraphView } from './GraphView'
import { OutputNode } from '../../machine/node'
import { convertGraph } from '../../machine/graph';

export function drawGraph(outputs: OutputNode[]) {

    const graph = convertGraph(outputs)
    Preact.render(<GraphView graph={graph} />, document.body)

}