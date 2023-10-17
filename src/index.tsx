/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { Component, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import 'style/index.scss'

var canvas: HTMLCanvasElement
var context: CanvasRenderingContext2D

type Project = {
    childs: Project[]
    title: string
    detail: string
    pos: {
        y: number
        x: number
        w: number
    }
}

const data: Project = {
    title: 'root',
    detail: '',
    pos: { y: 0, x: 0, w: 0 },
    childs: [
        {
            title: 'project 1',
            detail: 'projects detail\nnewline',
            pos: { x: 0, y: 0, w: 0 },
            childs: [
                {
                    title: 'project 1.1',
                    pos: { x: 0, y: 0, w: 0 },
                    detail: 'projects detail\nnewline',
                    childs: [],
                },
                {
                    title: 'project 1.2',
                    pos: { x: 0, y: 0, w: 0 },
                    detail: 'projects detail\nnewline',
                    childs: [],
                },
                {
                    title: 'project 1.3',
                    pos: { x: 0, y: 0, w: 0 },
                    detail: 'projects detail\nnewline',
                    childs: [],
                },
            ],
        },
        {
            title: 'project 2',
            pos: { x: 0, y: 0, w: 0 },
            detail: 'projects detail\nnewline',
            childs: [
                {
                    title: 'project 2.1',
                    pos: { x: 0, y: 0, w: 0 },
                    detail: 'projects detail\nnewline',
                    childs: [],
                },
                {
                    title: 'project 2.2',
                    pos: { x: 0, y: 0, w: 0 },
                    detail: 'projects detail\nnewline',
                    childs: [],
                },
                {
                    title: 'project 2.3',
                    detail: 'projects detail\nnewline',
                    pos: { x: 0, y: 0, w: 0 },
                    childs: [],
                },
            ],
        },
    ],
}

function update_project_positions() {
    function inner(project: Project): number {
        let w = 0
        project.childs.forEach(p => {
            if (!p.childs.length) p.pos.w = 30 + 40 + 30
            p.pos.w += inner(p)
            w += p.pos.w
        })
        return w
    }

    inner(data)
}
update_project_positions()
console.log(data)

function render_data() {
    function draw_circle(p: Project) {
        context.beginPath()
        context.fillStyle = '#f6b232'
        context.arc(p.pos.x, p.pos.y, 40, 0, 2 * Math.PI)
        context.fill()
    }

    function draw_curve(a: Project, b: Project) {
        context.beginPath()
        context.moveTo(a.pos.x, a.pos.y)
        let abcy = b.pos.y + (a.pos.y - b.pos.y) / 4
        let abcx = b.pos.x + (a.pos.x - b.pos.x) / 4

        let c1 = { x: b.pos.x, y: a.pos.y }
        let c2 = { x: abcx, y: abcy }

        context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, b.pos.x, b.pos.y)
        context.lineWidth = 4
        context.strokeStyle = 'red'
        context.stroke()
    }

    function iterate(project: Project) {
        project.childs.forEach(p => {
            draw_curve(project, p)
            iterate(p)
            draw_circle(p)
        })
    }

    iterate(data)
}
const App: Component = () => {
    onMount(() => {
        render_data()
    })

    return (
        <main>
            <canvas
                width={2048}
                height={2048}
                ref={e => {
                    canvas = e
                    context = canvas.getContext('2d')!
                }}
            />
            <button class='btn' onclick={render_data}>
                Render
            </button>
        </main>
    )
}

var clean_up = render(() => <App />, document.getElementById('root')!)
clean_up
