import { createStore } from 'solid-js/store'

type Repo = string

type Project = {
    repo: Repo
    childs?: Projects
    detail: string
    datetime: number
}
type Projects = {
    [k: Repo]: Project
}

export type { Repo, Project, Projects }

const DEFAULT: Projects = {
    'i007c/test': {
        repo: 'i007c/test',
        detail: '',
        datetime: 12,
        childs: {
            'i007c/t1': {
                repo: 'i007c/t1',
                detail: '',
                datetime: 12,
            },
            'i007c/t2': {
                repo: 'i007c/t2',
                detail: '',
                datetime: 12,
            },
            'i007c/t3': {
                repo: 'i007c/t3',
                detail: '',
                datetime: 12,
            },
            'i007c/t4': {
                repo: 'i007c/t4',
                detail: '',
                datetime: 12,
            },
            'i007c/t5': {
                repo: 'i007c/t5',
                detail: '',
                datetime: 12,
                childs: {
                    'i007c/t51': {
                        repo: 'i007c/t51',
                        detail: '',
                        datetime: 12,
                    },
                    'i007c/t52': {
                        repo: 'i007c/t52',
                        detail: '',
                        datetime: 12,
                    },
                },
            },
        },
    },
    'i007c/delta': {
        repo: 'i007c/deltaa',
        detail: 'project tree viewer',
        datetime: 1697501934,
    },
    'i007c/cerberus': {
        repo: 'i007c/cerberus',
        detail: 'image board viewer',
        datetime: 1671183647,
    },
    'i007c/apollo': {
        repo: 'i007c/apollo',
        detail: 'custom game engine',
        datetime: 1685738315,
        childs: {
            'i007c/donkeyobj': {
                repo: 'i007c/donkeyobj',
                detail: '.obj file parser',
                datetime: 1688903670,
            },
            'i007c/hera': {
                repo: 'i007c/hera',
                detail: 'image viewer',
                datetime: 1689800497,
            },
        },
    },
}

const [projects, setProjects] = createStore(DEFAULT)

export { projects, setProjects }
