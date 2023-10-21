import { createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'

type Repo = string

type Project = {
    repo: Repo
    url: string
    parent?: Repo
    childs?: Repo[]
    detail: string
    datetime: number
}
type Projects = {
    [k: Repo]: Project
}

const DEFAULT_PROJECTS: Projects = {}

const local = localStorage.getItem('projects')
const [projects, setProjects] = createStore<Projects>(
    local ? JSON.parse(local) : DEFAULT_PROJECTS
)
createEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
})

export { projects, setProjects }
export type { Repo, Project, Projects }
