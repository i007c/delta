export type Pos = {
    y: number
    x: number
    w: number
    h: number
}
export type Project = {
    childs: Project[]
    title: string
    detail: string
    repo: string
    start: number
    pos: Pos
}

type Basic = (number | Basic)[]

function make_data(input: Basic, lvl: number): Project {
    return {
        title: `pr ${lvl}`,
        detail: 'this is a simple and multiline description\nand this is the second like',
        repo: 'i007c/delta',
        start: 1697557689,
        pos: { x: 0, y: 0, w: 0, h: 0 },
        childs: input.map((n, i) => {
            if (Array.isArray(n)) return make_data(n, lvl + 1)
            return {
                childs: [],
                title: 'project level: ' + lvl + ' idx: ' + i,
                pos: { x: 0, y: 0, w: 0, h: 0 },
                detail: 'this is a simple and multiline description\nand this is the second like',
                repo: 'i007c/delta',
                start: 1697557689,
            }
        }),
    }
}

const data = make_data(
    [[1, 1, 1, 1, 1], 1, [1, 1, 1], [1, [1, [1, 1, 1, 1]]]],
    0
)

export const BOX_W = 128
export const BOX_H = 128
export const PADDING = 64
export const PATH_W = 16
export const PATH_COLOR = '#008736'
export const ROOT_W = 256

function update_project_positions() {
    let y = 2048

    function calc_width(project: Project, level: number) {
        let w = 0
        let h = 0
        let l = 1

        project.childs.forEach(p => {
            p.pos.y = y - level * BOX_H * 2

            if (p.childs.length) {
                let res = calc_width(p, level + 1)
                p.pos.w = res.w
                // p.pos.h = res.h
                l += res.l
            } else {
                p.pos.w = BOX_W + PADDING * 2
                // p.pos.h = BOX_H + 400
            }

            w += p.pos.w
            // h += p.pos.h
        })

        project.pos.w = w
        // project.pos.h = (l + 1) * (BOX_H + 400)

        return { w, h, l }
    }
    data.pos.x = 0
    data.pos.y = 2048
    calc_width(data, 1)

    function calc_x(project: Project, x: number) {
        project.childs.forEach(p => {
            p.pos.x = x + p.pos.w / 3
            calc_x(p, x)
            x += p.pos.w
        })
    }
    calc_x(data, -data.pos.w / 2)
}
update_project_positions()

export { data }
