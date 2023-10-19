import { createEffect } from 'solid-js'
import type { Repo, Projects, Project } from './projects'
import { projects } from './projects'
import { createStore } from 'solid-js/store'

type Cords = { x: number; y: number }

type GraphNode = {
    path: string
    repo: Repo
    x: number
    y: number
    w: number
    h: number
    bw: number
    n: number
}
type GraphEdge = {
    s: Cords
    c: Cords
    d: Cords
    e: Cords
}

type Graph = {
    edges: GraphEdge[]
    nodes: GraphNode[]
}

const [graph, setGraph] = createStore<Graph>({ edges: [], nodes: [] })

const NODE_W_AND_P = 256
const BASE_Y = 20
const ROOT_W = 256

const SX = 128 / 2
const SY = 128 / 2

createEffect(() => {
    let x = 0
    let n = 0

    const edges: GraphEdge[] = []
    const nodes: GraphNode[] = []

    function make_nodes_and_edges(
        data: Projects,
        path: string,
        level: number = 0,
        parent?: Project
    ) {
        let width = 0
        let end_edges: Cords[] = []

        Object.entries(data).forEach(([repo, p], i, a) => {
            if (repo != p.repo) {
                let msg = `invalid repo key at: ${path}${repo} != ${path}${p.repo}`
                alert(msg)
                throw new Error(msg)
            }

            let mx = x
            let y = BASE_Y - level * 256

            if (parent && a.length > 2) {
                let c = a.length / 2
                y = BASE_Y - level * 128
                if (i < c) {
                    y += (i + 1) * -128
                } else {
                    y += (a.length - i) * -128
                }
            }

            if (p.childs) {
                let cinfo = make_nodes_and_edges(
                    p.childs,
                    path + p.repo + ':',
                    level + 1,
                    p
                )
                width += cinfo.width
                mx += cinfo.width / 2 - NODE_W_AND_P / 2

                cinfo.end_edges.forEach(e => {
                    edges.push({
                        s: { x: mx + SX, y: y + SY },
                        c: { x: mx + SX, y: e.y },
                        d: { x: e.x, y: y + SY },
                        e,
                    })
                })
            } else {
                width += NODE_W_AND_P
            }

            end_edges.push({ x: mx + SX, y: y + SY })

            nodes.push({
                path: path + repo,
                repo,
                n,
                x: mx,
                y,
                w: 128,
                h: 128,
                bw: width,
            })
            n++
            x += NODE_W_AND_P
        })

        return { width, end_edges }
    }

    let cinfo = make_nodes_and_edges(projects, '')

    cinfo.end_edges.forEach((e, i, a) => {
        let sw = ROOT_W / a.length
        let mx = sw / 2 + i * sw
        mx -= ROOT_W / 2
        mx += cinfo.width / 2

        let y = BASE_Y + 512

        edges.push({
            s: { x: mx, y },
            c: { x: mx, y: e.y },
            d: { x: e.x, y },
            e,
        })
    })

    setGraph({ nodes, edges })
})

export { graph, setGraph }
export type { GraphEdge, GraphNode }
