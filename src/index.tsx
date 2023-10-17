/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { Component, onCleanup, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import 'style/index.scss'

var canvas: HTMLCanvasElement
var context: CanvasRenderingContext2D

import {
    data,
    Project,
    Pos,
    BOX_W,
    BOX_H,
    PATH_W,
    PATH_COLOR,
    ROOT_W,
} from './data'

const PCW = 128
const LW = 32

var ANIME: NodeJS.Timer

// function random(min: number, max: number) {
//     return Math.random() * (max - min) + min
// }

function getCubicBezierXYatPercent(a: Pos, b: Pos, pct: number) {
    let c1 = { x: a.x, y: b.y }
    let c2 = { x: b.x, y: a.y }

    var x = CubicN(pct, a.x, c1.x, c2.x, b.x)
    var y = CubicN(pct, a.y, c1.y, c2.y, b.y)
    return { x: x, y: y }
}

function CubicN(pct: number, a: number, b: number, c: number, d: number) {
    var t2 = pct * pct
    var t3 = t2 * pct
    return (
        a +
        (-a * 3 + pct * (3 * a - a * pct)) * pct +
        (3 * b + pct * (-6 * b + b * 3 * pct)) * pct +
        (c * 3 - c * 3 * pct) * t2 +
        d * t3
    )
}

type Particle = {
    a: Pos
    b: Pos
    x: number
    y: number
    pct: number
    color: string
    update(): void
}

function MakeParticle(a: Pos, b: Pos): Particle {
    return {
        a,
        b,
        pct: 0,
        color: PATH_COLOR,
        // color: '#f2f2f2',
        x: a.x,
        y: a.y,
        update() {
            if (this.pct >= 1) {
                this.pct = 0
                this.x = a.x
                this.y = a.y
            }

            // context.globalAlpha = 0.1
            context.beginPath()
            let { x, y } = getCubicBezierXYatPercent(this.a, this.b, this.pct)
            // context.moveTo(this.x, this.y)
            // context.lineTo(x, y)
            // this.x = x
            // this.y = y
            context.arc(x, y, LW / 2, 0, 2 * Math.PI)

            context.fillStyle = this.color
            context.fill()
            // context.strokeStyle = this.color
            // context.stroke()

            this.pct += 0.001
        },
    }
}

const particles: Particle[] = []

function update_particles(project: Project) {
    project.childs.forEach(p => {
        particles.push(MakeParticle(project.pos, p.pos))
        // particles.push(MakeParticle(project.pos, p.pos, -0.1, '#f2f2f2'))
        update_particles(p)
    })
}

data.childs.forEach((p, i) => {
    let sw = ROOT_W / data.childs.length
    let x = sw / 2 + i * sw
    x -= ROOT_W / 2
    particles.push(MakeParticle({ y: 2040, x, w: 0, h: 0 }, p.pos))
    update_particles(p)
})

var camera = {
    x: -573,
    y: -90,
    zoom: 0.1,
}
var mouse = {
    x: 0,
    y: 0,
}
var drag = {
    active: false,
    x: 0,
    y: 0,
}

function draw_project(p: Project) {
    // let x = p.pos.x - p.pos.w / 2
    // let y = p.pos.y - PCW * 2

    // if (
    //     mouse.x >= x &&
    //     mouse.x <= x + p.pos.w &&
    //     mouse.y >= y &&
    //     mouse.y <= y + PCW * 4
    // ) {
    //     if (
    //         Math.pow(mouse.x - p.pos.x, 2) + Math.pow(mouse.y - p.pos.y, 2) <
    //         Math.pow(PCW, 2)
    //     ) {
    //         // context.globalAlpha = 0.5
    //         context.beginPath()
    //         context.lineWidth = 10
    //         context.strokeStyle = PATH_COLOR
    //         context.arc(p.pos.x, p.pos.y, PCW, 0, 2 * Math.PI)
    //         context.stroke()
    //     }
    // }

    context.globalAlpha = 1
    context.beginPath()
    context.fillStyle = '#f6b232'
    // context.arc(p.pos.x, p.pos.y, PCW, 0, 2 * Math.PI)
    context.roundRect(
        p.pos.x - BOX_W / 2,
        p.pos.y - BOX_H / 2,
        BOX_W,
        BOX_H,
        10
    )
    context.fill()

    context.fillStyle = '#111'
    context.font = 'normal 18px monospace'
    context.fillText(p.title, p.pos.x - PCW, p.pos.y)
}

function draw_curve(a: Pos, b: Pos) {
    context.beginPath()
    context.moveTo(a.x, a.y)
    let c1 = { x: a.x, y: b.y }
    let c2 = { x: b.x, y: a.y }
    context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, b.x, b.y)
    context.lineWidth = LW
    context.stroke()
}

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

function render_data() {
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

    context.fillStyle = 'rgb(4, 4, 4, 0.05)'
    context.fillRect(-10000, -10000, 20000, 20000)

    particles.forEach(p => p.update())

    function post(project: Project) {
        project.childs.forEach(p => {
            post(p)
            draw_project(p)
        })
        draw_project(project)
    }

    data.childs.forEach(post)
}

function update_canvas() {
    canvas.width = innerWidth
    canvas.height = innerHeight

    context.fillStyle = 'rgb(4, 4, 4, 1)'
    context.fillRect(-10000, -10000, 20000, 20000)

    context.translate(canvas.width / 2, canvas.height / 2)
    context.scale(camera.zoom, camera.zoom)
    context.translate(
        -canvas.width / 2 + camera.x,
        -canvas.height / 2 + camera.y
    )
    // context.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach(p => (p.pct = 1))

    function iterate(project: Project) {
        project.childs.forEach(p => {
            context.globalAlpha = 0.1
            context.strokeStyle = PATH_COLOR
            draw_curve(project.pos, p.pos)
            iterate(p)
            draw_project(p)
        })
        draw_project(project)
    }

    data.childs.forEach((p, i) => {
        let sw = ROOT_W / data.childs.length
        let x = sw / 2 + i * sw
        x -= ROOT_W / 2

        context.globalAlpha = 0.1
        context.strokeStyle = PATH_COLOR
        draw_curve({ y: 2040, x, w: 0, h: 0 }, p.pos)
        context.beginPath()
        context.moveTo(x, 2040)
        context.lineTo(x, 20000)
        context.lineWidth = LW
        context.strokeStyle = PATH_COLOR
        context.stroke()
        iterate(p)
    })
}

const App: Component = () => {
    onMount(() => {
        onresize = () => {
            update_canvas()
        }

        update_canvas()
        render_data()

        ANIME = setInterval(render_data, 1)
    })

    onCleanup(() => {
        clearInterval(ANIME)
    })

    return (
        <main>
            <canvas
                width={innerWidth}
                height={innerHeight}
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

                    // console.log(camera.x)

                    // camera.y = Math.max(-400, camera.y)

                    let j = (camera.x - innerWidth / 2) * camera.zoom
                    j += innerWidth / 2

                    let k = (camera.y - innerHeight / 2) * camera.zoom
                    k += innerHeight / 2

                    // let { x, y } = e.target.getBoundingClientRect()

                    mouse.x = -(j - e.clientX) / camera.zoom
                    mouse.y = -(k - e.clientY) / camera.zoom
                    // mouse.x = ~~((e.clientX - x - camera.x) / camera.zoom)
                    // mouse.y = ~~((e.clientY - y - camera.y) / camera.zoom)
                    // console.log(mouse.x, mouse.y)
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
            />
        </main>
    )
}

var clean_up = render(() => <App />, document.getElementById('root')!)
clean_up
