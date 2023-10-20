import { createEffect } from 'solid-js'
import type { Repo } from './projects'
import { projects } from './projects'
import { createStore } from 'solid-js/store'

type Cords = { x: number; y: number }

type GraphNode = {
    repo: Repo
    x: number
    y: number
    w: number
    h: number
    bw: number
    n: number
}
type GraphEdge = {
    repos: Repo[]
    target: Repo
    s: Cords
    c: Cords
    d: Cords
    e: Cords
}

type Graph = {
    edges: GraphEdge[]
    nodes: GraphNode[]
    root: Cords & { w: number }
}

type NestedProject = {
    repo: Repo
    childs?: NestedProjects
    detail: string
    datetime: number
}
type NestedProjects = {
    [k: Repo]: NestedProject
}

const [graph, setGraph] = createStore<Graph>({
    edges: [],
    nodes: [],
    root: { x: 0, y: 0, w: 0 },
})

const NODE_W_AND_P = 256 + 128
const BASE_Y = 0
const ROOT_W = 256

const SX = 256 / 2
const SY = 64 / 2

function get_nested(repos: string[]): NestedProjects {
    let obj: NestedProjects = {}
    repos.forEach(r => {
        let proj = projects[r]
        if (!proj) return
        obj[r] = {
            repo: r,
            datetime: proj.datetime,
            detail: proj.detail,
        }
        if (proj.childs && proj.childs.length) {
            obj[r]!.childs = get_nested(proj.childs)
        }
    })
    return obj
}

createEffect(() => {
    let x = 0
    let n = 0
    let nested_projects: NestedProjects = {}

    Object.entries(projects).forEach(([repo, p]) => {
        if (repo != p.repo) {
            let msg = `invalid repo key at: ${repo} != ${p.repo}`
            alert(msg)
            throw new Error(msg)
        }

        if (p.parent) return

        if (!nested_projects[repo]) {
            nested_projects[repo] = {
                repo,
                datetime: p.datetime,
                detail: p.detail,
            }
            if (p.childs) {
                nested_projects[repo]!.childs = get_nested(p.childs)
            }
        }
    })

    let edges: GraphEdge[] = []
    let nodes: GraphNode[] = []

    function make_nodes_and_edges(
        data: NestedProjects,
        level: number = 0,
        added_y: number = 0,
        parent?: NestedProject
    ) {
        let width = 0
        let end_edges: (Cords & { repos: Repo[]; target: Repo })[] = []
        let all_repos: Repo[] = []

        Object.entries(data).forEach(([repo, p], i, a) => {
            let mx = x
            let y = BASE_Y - level * 256 + added_y

            if (parent && a.length > 2) {
                let c = a.length / 2
                y = BASE_Y - level * 128 + added_y
                if (i < c) {
                    y += (i + 1) * -64
                } else {
                    y += (a.length - i) * -64
                }
            }

            let repos = [p.repo]

            if (p.childs && Object.keys(p.childs).length) {
                let cinfo = make_nodes_and_edges(p.childs, level + 1, y + 64, p)
                width += cinfo.width
                mx += cinfo.width / 2 - NODE_W_AND_P / 2

                repos = repos.concat(cinfo.repos)

                cinfo.end_edges.forEach(e => {
                    edges.push({
                        target: e.target,
                        repos: e.repos,
                        s: { x: mx + SX, y: y + SY },
                        c: { x: mx + SX, y: e.y },
                        d: { x: e.x, y: y + SY },
                        e,
                    })
                })
            } else {
                width += NODE_W_AND_P
                x += NODE_W_AND_P
            }

            all_repos = all_repos.concat(repos)
            end_edges.push({
                x: mx + SX,
                y: y + SY,
                repos,
                target: p.repo,
            })

            nodes.push({
                repo,
                n,
                x: mx,
                y,
                w: 256,
                h: 64,
                bw: width,
            })
            n++
        })

        return { width, end_edges, repos: all_repos }
    }

    let cinfo = make_nodes_and_edges(nested_projects, 0)
    let y = BASE_Y + 512

    cinfo.end_edges.forEach((e, i, a) => {
        let sw = ROOT_W / a.length
        let mx = sw / 2 + i * sw
        mx -= ROOT_W / 2
        mx += cinfo.width / 2

        edges.push({
            target: e.target,
            repos: e.repos,
            s: { x: mx, y },
            c: { x: mx, y: e.y },
            d: { x: e.x, y },
            e,
        })
    })

    setGraph({
        nodes,
        edges,
        root: {
            x: cinfo.width / 2,
            y,
            w: cinfo.width,
        },
    })
})

export { graph, setGraph }
export type { GraphEdge, GraphNode }
