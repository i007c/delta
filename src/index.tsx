/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { Component, createEffect, on, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import 'style/index.scss'

var context: SVGGElement
var active_node_text: SVGTextElement
var svg: SVGSVGElement
const SVGNS = 'http://www.w3.org/2000/svg'

import { graph, Project, projects, setProjects } from 'stores'
import type { GraphNode, GraphEdge } from 'stores'
import { createStore, produce } from 'solid-js/store'
import { now_iso } from 'utils'

var drag = {
    active: false,
    moved: false,
    x: 0,
    y: 0,
}

const [state, setState] = createStore({
    text: '',
    tz: 0.5,
    ty: 0,
    tx: 0,
    td: false,
})

function render_data(nodes: GraphNode[], edges: GraphEdge[]) {
    context.innerHTML = ''

    edges.forEach(({ s, c, d, e, repos, target }) => {
        let path_data = `M ${s.x} ${s.y} C ${c.x} ${c.y} ${d.x} ${d.y} ${e.x} ${e.y}`
        let path = document.createElementNS(SVGNS, 'path')
        path.setAttribute('d', path_data)
        path.setAttribute('data-repos', ' ' + repos.join(' ') + ' ')
        path.setAttribute('data-target', target)
        context.appendChild(path)
    })

    nodes.forEach(n => {
        let g = document.createElementNS(SVGNS, 'g')
        g.setAttribute('data-repo', n.repo)
        g.classList.add('node')
        g.onmouseenter = () => {
            setState({ text: n.repo })
        }
        g.onmouseleave = () => {
            setState({ text: '' })
        }

        let rect = document.createElementNS(SVGNS, 'rect')
        rect.setAttribute('x', n.x.toString())
        rect.setAttribute('y', n.y.toString())
        rect.setAttribute('width', n.w.toString())
        rect.setAttribute('height', n.h.toString())
        rect.setAttribute('rx', '10')
        g.appendChild(rect)

        let text = document.createElementNS(SVGNS, 'text')
        text.textContent = `${n.repo}`
        text.setAttribute('width', n.w.toString())
        text.setAttribute('x', (n.x + n.w / 2).toString())
        text.setAttribute('y', (n.y + n.h / 2).toString())
        g.appendChild(text)

        context.appendChild(g)
    })
}

type Active = {
    repo: string
    project: Project
    clear(): void
}

const App: Component = () => {
    const [active, setActive] = createStore<Active>({
        repo: 'i007c/apollo',
        get project() {
            let p = projects[this.repo]
            if (!p) return { repo: '', detail: '', url: '', datetime: 0 }
            return p
        },
        clear() {},
    })

    onMount(() => {
        onresize = () => {
            svg.viewBox.baseVal.width = (innerWidth / 100) * 75
            svg.viewBox.baseVal.height = innerHeight
        }
        svg.viewBox.baseVal.width = (innerWidth / 100) * 75
        svg.viewBox.baseVal.height = innerHeight
    })

    createEffect(
        on(
            () => {
                graph.edges
                graph.nodes
            },
            () => {
                if (!state.td) {
                    const v = svg.viewBox.baseVal
                    const tz = v.width / (graph.root.w + graph.root.w * 0.1)
                    setState({
                        tz,
                        tx: -graph.root.x * tz + v.width / 2,
                        ty: graph.root.y,
                        td: true,
                    })
                }
                render_data(graph.nodes, graph.edges)
                if (active.repo) {
                    let g = svg.querySelector<SVGGElement>(
                        '[data-repo="' + active.repo + '"]'
                    )
                    if (g) set_active_g(g)
                }
            },
            { defer: false }
        )
    )

    function set_active_g(g: SVGGElement) {
        let repo = g.getAttribute('data-repo')
        if (!repo) return

        let el = g.querySelector('rect')!
        let edges = svg.querySelectorAll<SVGPathElement>(
            '[data-repos*=" ' + repo + ' "]'
        )

        active.clear()
        setActive({
            repo,
            clear() {
                el.classList.remove('active')
                edges.forEach(e => e.classList.remove('active'))
                setActive({ repo: '' })
            },
        })

        edges.forEach(e => e.classList.add('active'))
        el.classList.add('active')

        const { x, y, width, height } = el.getBBox()
        const v = svg.viewBox.baseVal
        const z = 1.5
        setState({
            tz: z,
            tx: -x * z + v.width / 2 - width,
            ty: -y * z + v.height / 2 - height,
        })
    }

    return (
        <main>
            <svg
                ref={svg}
                viewBox={`0 0 ${(innerWidth / 100) * 75} ${innerHeight}`}
                onContextMenu={e => {
                    e.preventDefault()

                    const v = svg.viewBox.baseVal
                    const tz = v.width / (graph.root.w + graph.root.w * 0.1)
                    setState({
                        tz,
                        tx: -graph.root.x * tz + v.width / 2,
                        ty: graph.root.y * tz + v.height,
                    })
                }}
                onWheel={e => {
                    if (drag.active) return

                    const x = e.clientX - svg.viewBox.baseVal.width / 2
                    const y = e.clientY - svg.viewBox.baseVal.height / 2
                    let a = e.deltaY > 0 ? 0.9 : 1.1
                    let new_tz = state.tz * a

                    if (new_tz > 0.1 && new_tz < 2) {
                        setState(
                            produce(s => {
                                s.tz = new_tz
                                s.tx = x - (x - s.tx) * a
                                s.ty = y - (y - s.ty) * a
                            })
                        )
                    }
                }}
                onDblClick={e => {
                    if (e.target.tagName != 'svg') return

                    // const v = svg.viewBox.baseVal

                    setState({ tz: 0.75 })
                    // transform.x =
                    //     -(e.clientX - transform.x - v.width / 2) / transform.z

                    // const { x, y, width, height } = el.getBBox()
                    //         const z = 1.5
                    //         transform.z = z
                    //         transform.x = -x * z + v.width / 2 - width
                    //         transform.y = -y * z + v.height / 2 - height
                }}
                onMouseDown={e => {
                    if (e.button) return

                    drag = {
                        active: true,
                        moved: false,
                        x: e.clientX,
                        y: e.clientY,
                    }

                    if (!e.target) return

                    if (e.target.tagName == 'path') {
                        let repo = e.target.getAttribute('data-target')
                        if (!repo) return

                        let g = svg.querySelector<SVGGElement>(
                            '[data-repo="' + repo + '"]'
                        )
                        if (g) set_active_g(g)
                    } else if (e.target.tagName == 'rect') {
                        if (e.target.parentElement!.tagName == 'g') {
                            // @ts-ignore
                            set_active_g(e.target.parentElement)
                        }
                    }
                }}
                onMouseUp={() => {
                    drag.active = false
                }}
                onMouseLeave={() => {
                    drag.active = false
                }}
                onMouseMove={e => {
                    const { left } = e.currentTarget.getBoundingClientRect()

                    active_node_text.setAttribute(
                        'x',
                        (e.clientX + left).toString()
                    )
                    active_node_text.setAttribute(
                        'y',
                        (e.clientY - 32).toString()
                    )

                    if (drag.active) {
                        setState(s => ({
                            tx: s.tx + (e.clientX - drag.x) * 1,
                            ty: s.ty + (e.clientY - drag.y) * 1,
                        }))
                        drag.x = e.clientX
                        drag.y = e.clientY
                        drag.moved = true
                    }
                }}
            >
                <defs>
                    <linearGradient id='branch' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0.1' stop-opacity='0'></stop>
                        <stop
                            offset='0.5'
                            stop-color='#008736'
                            stop-opacity='0.5'
                        ></stop>
                        <stop offset='.9' stop-opacity='0'></stop>
                    </linearGradient>
                    <linearGradient id='node_stk' x1='0' y1='0' x2='1' y2='1'>
                        <stop offset='0.2' stop-color='#008736'></stop>
                        <stop offset='0.5' stop-opacity='0'></stop>
                        <stop offset='0.8' stop-color='#008736'></stop>
                    </linearGradient>
                    <linearGradient id='node_stk_a' x1='0' y1='0' x2='1' y2='1'>
                        <stop offset='0.2' stop-color='#143fb4'></stop>
                        <stop offset='0.5' stop-opacity='0'></stop>
                        <stop offset='0.8' stop-color='#143fb4'></stop>
                    </linearGradient>
                </defs>

                <g
                    ref={context}
                    style={{
                        scale: state.tz,
                        translate: `${state.tx}px ${state.ty}px`,
                    }}
                ></g>

                <text
                    class='active-node'
                    ref={active_node_text}
                    display={state.tz < 0.7 ? '' : 'none'}
                >
                    {state.text}
                </text>
            </svg>
            <div class='info'>
                <div class='row'>
                    <label for='info_input_repo'>repo: </label>
                    <input
                        id='info_input_repo'
                        value={active.project.repo}
                        onInput={e => {
                            if (!active.repo) return

                            let nrepo = e.currentTarget.value
                            if (nrepo.length > 100 || nrepo.length < 3) return

                            setProjects(
                                produce(s => {
                                    if (s[nrepo]) return

                                    let p = s[active.repo]
                                    if (!p) return

                                    if (p.parent) {
                                        let pp = s[p.parent]!
                                        if (pp.childs) {
                                            let idx = pp.childs.indexOf(p.repo)
                                            if (idx != -1)
                                                pp.childs[idx] = nrepo
                                        }
                                    }

                                    if (p.childs) {
                                        p.childs.forEach(
                                            c => (s[c]!.parent = nrepo)
                                        )
                                    }

                                    s[nrepo] = p
                                    delete s[p.repo]
                                    p.repo = nrepo
                                    setActive({ repo: nrepo })
                                })
                            )
                        }}
                    />
                </div>

                <div class='row url'>
                    <div class='row'>
                        <label for='info_input_url'>url: </label>
                        <input
                            id='info_input_url'
                            value={active.project.url}
                            onInput={e => {
                                if (!active.repo) return

                                let new_url = e.currentTarget.value

                                setProjects(
                                    produce(s => {
                                        let p = s[active.repo]
                                        if (!p) return

                                        p.url = new_url
                                    })
                                )
                            }}
                        />
                    </div>
                    <a
                        class='project_url'
                        href={active.project.url}
                        target='_blank'
                    >
                        {(() => {
                            try {
                                return new URL(
                                    active.project.url
                                ).pathname.slice(1)
                            } catch {
                                return active.project.url
                            }
                        })()}
                    </a>
                </div>

                <div class='row col'>
                    <label for='info_input_detail'>detail: </label>
                    <textarea
                        id='info_input_detail'
                        rows='6'
                        value={active.project.detail}
                        onInput={e => {
                            if (!active.repo) return

                            setProjects(
                                produce(s => {
                                    let p = s[active.repo]
                                    if (!p) return
                                    p.detail = e.currentTarget.value
                                })
                            )
                        }}
                    />
                </div>
                <div class='row'>
                    <label for='info_input_datetime'>datetime: </label>
                    <input
                        id='info_input_datetime'
                        type='datetime-local'
                        value={new Date(active.project.datetime * 1000)
                            .toISOString()
                            .slice(0, -1)}
                        onChange={e => {
                            if (!active.repo) return

                            setProjects(
                                produce(s => {
                                    let p = s[active.repo]
                                    if (!p) return
                                    p.datetime =
                                        e.currentTarget.valueAsNumber / 1000
                                })
                            )
                        }}
                    />
                </div>
                <div class='row'>
                    <label for='info_input_timestamp'>timestamp: </label>
                    <input
                        type='number'
                        id='info_input_timestamp'
                        value={active.project.datetime}
                        onChange={e => {
                            if (!active.repo) return

                            setProjects(
                                produce(s => {
                                    let p = s[active.repo]
                                    if (!p) return
                                    let v = parseInt(e.currentTarget.value)
                                    if (isNaN(v)) return
                                    p.datetime = v
                                })
                            )
                        }}
                    />
                </div>
                <div class='row'>
                    <button
                        class='add'
                        style={{ '--color': 'var(--green)' }}
                        onClick={() => {
                            // if (!active.repo) return

                            let urepo = 'master/new'

                            let n = 1
                            while (urepo in projects) {
                                urepo = 'master/new-' + n
                                n++
                            }

                            setProjects(
                                produce(s => {
                                    let p = s[active.repo]

                                    s[urepo] = {
                                        repo: urepo,
                                        childs: [],
                                        detail: '',
                                        url: 'https://github.com/i007c/',
                                        datetime: ~~(
                                            new Date().getTime() / 1000
                                        ),
                                        parent: p ? p.repo : undefined,
                                    }

                                    if (!p) return

                                    if (!p.childs) {
                                        p.childs = [urepo]
                                    } else {
                                        p.childs.push(urepo)
                                    }
                                })
                            )
                        }}
                    >
                        add child
                    </button>
                    <button
                        class='del'
                        style={{ '--color': 'var(--red)' }}
                        onClick={() => {
                            if (!active.repo) return

                            setProjects(
                                produce(s => {
                                    let p = s[active.repo]
                                    if (!p) return

                                    if (p.parent) {
                                        let pp = s[p.parent]!
                                        if (pp.childs) {
                                            let idx = pp.childs.indexOf(p.repo)
                                            if (idx != -1)
                                                pp.childs.splice(idx, 1)
                                        }
                                    }

                                    if (p.childs) {
                                        p.childs.forEach(c => delete s[c])
                                    }

                                    delete s[p.repo]
                                })
                            )
                        }}
                    >
                        delete
                    </button>
                </div>
                <div class='row'>
                    <button
                        style={{
                            '--color': 'var(--accent)',
                        }}
                        onClick={() => {
                            console.log(projects)
                        }}
                    >
                        Log
                    </button>
                </div>
                <div class='row'>
                    <button
                        style={{
                            '--color': 'var(--green)',
                        }}
                        onClick={() => {
                            let e = document.createElement('input')
                            e.setAttribute('type', 'file')
                            e.setAttribute('accept', 'application/json')
                            e.onchange = async function () {
                                e.remove()
                                if (!e.files || !e.files.length) return
                                const file = e.files[0]!
                                if (file.type != 'application/json') return

                                setProjects(JSON.parse(await file.text()))
                            }
                            e.click()
                        }}
                    >
                        Import
                    </button>
                    <button
                        style={{
                            '--color': 'var(--accent)',
                        }}
                        onClick={() => {
                            const url = URL.createObjectURL(
                                new Blob([JSON.stringify(projects, null, 4)], {
                                    type: 'application/json',
                                })
                            )
                            chrome.downloads.download({
                                url,
                                filename: `delta/export-${now_iso()}.json`,
                            })
                        }}
                    >
                        Export
                    </button>
                </div>
            </div>
        </main>
    )
}

var clean_up = render(() => <App />, document.getElementById('root')!)
clean_up
