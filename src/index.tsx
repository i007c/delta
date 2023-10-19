/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { Component, createEffect, onCleanup, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import 'style/index.scss'

// var canvas: HTMLCanvasElement
// var context: CanvasRenderingContext2D
var context: SVGGElement
var svg: SVGSVGElement
const SVGNS = 'http://www.w3.org/2000/svg'

import { graph, Project, projects } from 'stores'
import type { GraphNode, GraphEdge } from 'stores'
import { createStore } from 'solid-js/store'

var ANIME: NodeJS.Timer
var transform = {
    x: 0,
    y: 0,
    z: 2,
}

var drag = {
    active: false,
    x: 0,
    y: 0,
}

// function random(min: number, max: number) {
//     return Math.random() * (max - min) + min
// }

// function getCubicBezierXYatPercent(a: Pos, b: Pos, pct: number) {
//     let c1 = { x: a.x, y: b.y }
//     let c2 = { x: b.x, y: a.y }
//
//     var x = CubicN(pct, a.x, c1.x, c2.x, b.x)
//     var y = CubicN(pct, a.y, c1.y, c2.y, b.y)
//     return { x: x, y: y }
// }
//
// function CubicN(pct: number, a: number, b: number, c: number, d: number) {
//     var t2 = pct * pct
//     var t3 = t2 * pct
//     return (
//         a +
//         (-a * 3 + pct * (3 * a - a * pct)) * pct +
//         (3 * b + pct * (-6 * b + b * 3 * pct)) * pct +
//         (c * 3 - c * 3 * pct) * t2 +
//         d * t3
//     )
// }
//
// type Particle = {
//     a: Pos
//     b: Pos
//     x: number
//     y: number
//     pct: number
//     color: string
//     update(): void
// }
//
// function MakeParticle(a: Pos, b: Pos): Particle {
//     return {
//         a,
//         b,
//         pct: 0,
//         color: PATH_COLOR,
//         // color: '#f2f2f2',
//         x: a.x,
//         y: a.y,
//         update() {
//             if (this.pct >= 1) {
//                 this.pct = 0
//                 this.x = a.x
//                 this.y = a.y
//             }
//
//             // context.globalAlpha = 0.1
//             context.beginPath()
//             let { x, y } = getCubicBezierXYatPercent(this.a, this.b, this.pct)
//             // context.moveTo(this.x, this.y)
//             // context.lineTo(x, y)
//             // this.x = x
//             // this.y = y
//             context.arc(x, y, PATH_W / 2, 0, 2 * Math.PI)
//
//             context.fillStyle = this.color
//             context.fill()
//             // context.strokeStyle = this.color
//             // context.stroke()
//
//             this.pct += 0.001
//         },
//     }
// }
//
// const particles: Particle[] = []
//
// function update_particles(project: Project) {
//     project.childs.forEach(p => {
//         particles.push(MakeParticle(project.pos, p.pos))
//         // particles.push(MakeParticle(project.pos, p.pos, -0.1, '#f2f2f2'))
//         update_particles(p)
//     })
// }
//
// data.childs.forEach((p, i) => {
//     let sw = ROOT_W / data.childs.length
//     let x = sw / 2 + i * sw
//     x -= ROOT_W / 2
//     particles.push(MakeParticle({ y: 2040, x, w: 0, h: 0 }, p.pos))
//     update_particles(p)
// })

// function draw_project(p: Project) {
//     let x = p.pos.x
//     let y = p.pos.y
//
//     if (
//         mouse.x >= x - BOX_W / 2 &&
//         mouse.x <= x + BOX_W / 2 &&
//         mouse.y >= y - BOX_H / 2 &&
//         mouse.y <= y + BOX_H / 2
//     ) {
//         context.beginPath()
//         context.lineWidth = 10
//         context.strokeStyle = PATH_COLOR
//         context.roundRect(
//             p.pos.x - BOX_W / 2,
//             p.pos.y - BOX_H / 2,
//             BOX_W,
//             BOX_H,
//             10
//         )
//
//         context.stroke()
//     }
//
//     context.globalAlpha = 1
//     context.beginPath()
//     context.strokeStyle = '#f6b232'
//     // context.arc(p.pos.x, p.pos.y, PCW, 0, 2 * Math.PI)
//     context.roundRect(
//         p.pos.x - BOX_W / 2,
//         p.pos.y - BOX_H / 2,
//         BOX_W,
//         BOX_H,
//         10
//     )
//     context.lineWidth = 1
//     context.stroke()
//
//     context.fillStyle = '#f2f2f2'
//     context.font = 'bold 18px monospace'
//     context.textAlign = 'center'
//     context.fillText(p.repo, p.pos.x, p.pos.y)
// }
//
// function draw_curve(a: Pos, b: Pos) {
//     context.beginPath()
//     context.moveTo(a.x, a.y)
//     let c1 = { x: a.x, y: b.y }
//     let c2 = { x: b.x, y: a.y }
//     context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, b.x, b.y)
//     context.lineWidth = PATH_W
//     context.stroke()
// }

// function draw_box(p: Project) {
//     // context.globalAlpha = 0.01
//     context.strokeStyle = 'red'
//     context.fillStyle = 'red'
//     context.lineWidth = 3
//
//     let x = p.pos.x - p.pos.w / 2
//     let y = p.pos.y - PCW * 2
//
//     if (
//         mouse.x >= x &&
//         mouse.x <= x + p.pos.w &&
//         mouse.y >= y &&
//         mouse.y <= y + PCW * 4
//     ) {
//         context.fillStyle = '#f001'
//         // context.strokeStyle = 'red'
//         // context.fillRect(x, y, p.pos.w, p.pos.h)
//         // context.strokeRect(x, y, p.pos.w, p.pos.h)
//     } else {
//         context.fillStyle = '#04040400'
//     }
//
//     // context.strokeRect(x, y, p.pos.w, p.pos.h)
//     context.fillRect(x, y, p.pos.w, PCW * 4)
// }

function render_data(nodes: GraphNode[], edges: GraphEdge[]) {
    // context.beginPath()
    // context.fillStyle = 'red'
    // context.arc(0, 0, 50, 0, 2 * Math.PI)
    // context.fill()
    // context.closePath()
    // function pre(project: Project) {
    //     project.childs.forEach(p => {
    //         pre(p)
    //         // draw_box(p)
    //     })
    //     // draw_box(project)
    // }
    // data.childs.forEach(pre)
    // context.fillStyle = 'rgb(4, 4, 4, 0.05)'
    // context.fillRect(-10000, -10000, 20000, 20000)
    //
    // particles.forEach(p => p.update())
    //
    // function post(project: Project) {
    //     project.childs.forEach(p => {
    //         post(p)
    //         draw_project(p)
    //     })
    //     draw_project(project)
    // }
    //
    // data.childs.forEach(post)
    //
    //
    // context.globalAlpha = 1

    edges.forEach(({ s, c, d, e }) => {
        let path_data = `M ${s.x} ${s.y} C ${c.x} ${c.y} ${d.x} ${d.y} ${e.x} ${e.y}`
        let path = document.createElementNS(SVGNS, 'path')
        path.setAttribute('d', path_data)
        context.appendChild(path)

        // let line = document.createElementNS(SVGNS, 'line')
        // line.setAttributeNS(null, 'x1', '0')
        // line.setAttributeNS(null, 'x2', '10')
        // line.setAttributeNS(null, 'y1', '0')
        // line.setAttributeNS(null, 'y1', '0')
        //
        // let anime = document.createElementNS(SVGNS, 'animateMotion')
        // anime.setAttributeNS(null, 'dur', '10s')
        // anime.setAttributeNS(null, 'repeatCount', 'indefinite')
        // anime.setAttributeNS(null, 'path', path_data)
        // line.appendChild(anime)

        // context.appendChild(line)
    })

    nodes.forEach(n => {
        let rect = document.createElementNS(SVGNS, 'rect')
        rect.setAttribute('x', n.x.toString())
        rect.setAttribute('y', n.y.toString())
        rect.setAttribute('width', n.w.toString())
        rect.setAttribute('height', n.h.toString())
        rect.setAttribute('rx', '10')
        rect.setAttribute('data-path', n.path)
        context.appendChild(rect)
        let text = document.createElementNS(SVGNS, 'text')
        text.textContent = `${n.n} - ${n.repo}`
        text.setAttribute('width', n.w.toString())
        text.setAttribute('x', (n.x + n.w / 2).toString())
        text.setAttribute('y', (n.y + n.h / 2).toString())
        text.setAttribute('text-anchor', 'middle')
        context.appendChild(text)
        // text.setAttributeNS(null, )
        // context.beginPath()
        // context.roundRect(n.x, n.y, n.w, n.h, 10)
        // context.strokeStyle = '#f6b232'
        // context.stroke()
        // context.closePath()
    })
}

// function update_canvas() {
//     const rec = canvas.getBoundingClientRect()
//
//     const width = ~~rec.width
//     const height = ~~rec.height
//
//     canvas.width = width
//     canvas.height = height
//
//     // context.fillStyle = 'rgb(4, 4, 4, 1)'
//     // context.fillRect(-10000, -10000, 20000, 20000)
//
//     context.translate(canvas.width / 2, canvas.height / 2)
//     context.scale(camera.zoom, camera.zoom)
//     context.translate(
//         -canvas.width / 2 + camera.x,
//         -canvas.height / 2 + camera.y
//     )
//     context.clearRect(0, 0, width, height)
//     render_data()
//
//     // context.clearRect(0, 0, canvas.width, canvas.height)
//
//     // particles.forEach(p => (p.pct = 1))
//     //
//     // function iterate(project: Project) {
//     //     project.childs.forEach(p => {
//     //         context.globalAlpha = 0.1
//     //         context.strokeStyle = PATH_COLOR
//     //         draw_curve(project.pos, p.pos)
//     //         iterate(p)
//     //         draw_project(p)
//     //     })
//     //     draw_project(project)
//     // }
//     //
//     // data.childs.forEach((p, i) => {
//     //     let sw = ROOT_W / data.childs.length
//     //     let x = sw / 2 + i * sw
//     //     x -= ROOT_W / 2
//     //
//     //     context.globalAlpha = 0.1
//     //     context.strokeStyle = PATH_COLOR
//     //     draw_curve({ y: 2040, x, w: 0, h: 0 }, p.pos)
//     //     context.beginPath()
//     //     context.moveTo(x, 2040)
//     //     context.lineTo(x, 20000)
//     //     context.lineWidth = PATH_W
//     //     context.strokeStyle = PATH_COLOR
//     //     context.stroke() //     iterate(p)
//     // })
// }

function update_viewbox() {
    context.style.scale = transform.z.toString()
    context.style.translate = `${transform.x}px ${transform.y}px`
}

type Active = {
    project: Project
    clear(): void
}

const App: Component = () => {
    const [active, setActive] = createStore<Active>({
        project: {
            repo: '',
            datetime: 0,
            detail: '',
        },
        clear() {},
    })

    onMount(() => {
        // const { width, height } = svg.viewBox.baseVal

        transform.x = -900
        transform.y = 300

        update_viewbox()
        // render_data()

        // ANIME = setInterval(render_data, 1)
    })

    createEffect(() => {
        render_data(graph.nodes, graph.edges)
    })

    onCleanup(() => {
        clearInterval(ANIME)
    })

    return (
        <main>
            <svg
                onClick={e => {
                    if (e.target && e.target.tagName == 'rect') {
                        let path = e.target.getAttribute('data-path')
                        if (path) {
                            let keys = path.split(':')
                            let obj = projects
                            for (let i = 0; i < keys.length; i++) {
                                let r = keys[i]!
                                if (!obj[r]) break

                                let p = obj[r]!

                                if (i == keys.length - 1) {
                                    if (p.repo == r) {
                                        let el = e.target as SVGRectElement
                                        active.clear()
                                        setActive({
                                            project: p,
                                            clear() {
                                                el.style.stroke = ''
                                            },
                                        })
                                        el.style.stroke = 'url(#node_stk_a)'
                                        return
                                    }
                                }

                                if (!p.childs) {
                                    break
                                }

                                obj = p.childs
                            }
                        }
                    }

                    active.clear()
                    setActive({
                        project: { repo: '', detail: '', datetime: 0 },
                    })
                }}
                ref={svg}
                viewBox='0 0 1000 1000'
                onContextMenu={e => {
                    e.preventDefault()
                    const { width, height } = svg.viewBox.baseVal

                    transform.x = width / 2
                    transform.y = height / 2
                    update_viewbox()
                }}
                onWheel={e => {
                    if (drag.active) return

                    const x = e.clientX - svg.viewBox.baseVal.width / 2
                    const y = e.clientY - svg.viewBox.baseVal.height / 2
                    let a = 1.1

                    if (e.deltaY > 0) {
                        a = 0.9
                    }

                    let oz = transform.z
                    transform.z *= a

                    if (transform.z > 0.1 && transform.z < 2) {
                        transform.x = x - (x - transform.x) * a
                        transform.y = y - (y - transform.y) * a
                        update_viewbox()
                    } else {
                        transform.z = oz
                    }
                }}
                onMouseDown={e => {
                    if (e.button) return

                    drag = {
                        active: true,
                        x: e.clientX,
                        y: e.clientY,
                    }
                }}
                onMouseUp={() => {
                    drag.active = false
                }}
                onMouseLeave={() => {
                    drag.active = false
                }}
                onMouseMove={e => {
                    if (drag.active) {
                        transform.x += e.clientX - drag.x
                        transform.y += e.clientY - drag.y
                        drag.x = e.clientX
                        drag.y = e.clientY

                        update_viewbox()
                    }
                }}
            >
                <defs>
                    <linearGradient id='branch' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='.1' stop-opacity='0'></stop>
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

                <g ref={context}>
                    <line
                        stroke-width={4}
                        stroke='darkorange'
                        x1={-2000}
                        y1={0}
                        x2={2000}
                        y2={0}
                    />
                    <line
                        stroke-width={4}
                        stroke='darkorange'
                        x1={0}
                        y1={-2000}
                        x2={0}
                        y2={2000}
                    />
                </g>
            </svg>
            <div class='info'>
                <div class='row'>
                    <label for='info_input_repo'>repo: </label>
                    <input id='info_input_repo' value={active.project.repo} />
                </div>

                <div class='row col'>
                    <label for='info_input_detail'>detail: </label>
                    <textarea
                        id='info_input_detail'
                        rows='6'
                        value={active.project.detail}
                    />
                </div>
                <div class='row'>
                    <label for='info_input_datetime'>datetime: </label>
                    <input id='info_input_datetime' type='datetime-local' />
                </div>
                <div class='row'>
                    <label for='info_input_timestamp'>timestamp: </label>
                    <input
                        id='info_input_timestamp'
                        value={active.project.datetime}
                    />
                </div>
                <div class='row'>
                    <button class='add'>add child</button>
                    <button class='del'>delete</button>
                </div>
            </div>
            {/*<canvas
                style={{ width: '75%', height: '100%' }}
                ref={e => {
                    canvas = e
                    context = canvas.getContext('2d')!
                }}
                onMouseDown={e => {
                    drag = {
                        active: true,
                        x: ~~(e.clientX / camera.zoom - camera.x),
                        y: ~~(e.clientY / camera.zoom - camera.y),
                    }
                }}
                onMouseUp={() => {
                    drag.active = false
                }}
                onMouseLeave={() => {
                    drag.active = false
                }}
                onMouseMove={e => {
                    if (drag.active) {
                        camera.x = ~~(e.clientX / camera.zoom - drag.x)
                        camera.y = ~~(e.clientY / camera.zoom - drag.y)
                        update_canvas()
                    }

                    // camera.y = Math.max(-400, camera.y)

                    let j = (camera.x - canvas.width / 2) * camera.zoom
                    j += canvas.width / 2

                    let k = (camera.y - canvas.height / 2) * camera.zoom
                    k += canvas.height / 2

                    // console.log(-canvas.width / 2 + camera.x, j)
                    // j = -canvas.width / 2 + camera.x
                    // -canvas.height / 2 + camera.y

                    // let { x, y } = e.target.getBoundingClientRect()

                    mouse.x = -(j - e.clientX) / camera.zoom
                    mouse.y = -(k - e.clientY) / camera.zoom
                    // mouse.x = ~~((e.clientX - x - camera.x) / camera.zoom)
                    // mouse.y = ~~((e.clientY - y - camera.y) / camera.zoom)
                    // mouse.y = ~~((e.clientY - y) / camera.zoom - camera.y)
                }}
                onWheel={e => {
                    if (drag.active) return
                    let amount = -e.deltaY * 0.0005
                    camera.zoom += amount
                    // camera.zoom -= 0.25
                    camera.zoom = Math.max(camera.zoom, 0.1)

                    update_canvas()
                }}
            />*/}
        </main>
    )
}

var clean_up = render(() => <App />, document.getElementById('root')!)
clean_up
