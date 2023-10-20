import { createStore } from 'solid-js/store'

type Repo = string

type Project = {
    repo: Repo
    parent?: Repo
    childs?: Repo[]
    detail: string
    datetime: number
}
type Projects = {
    [k: Repo]: Project
}

export type { Repo, Project, Projects }

let DEFAULT: Projects = {
    'i007c/test': {
        repo: 'i007c/test',
        detail: '',
        datetime: 12,
        childs: ['i007c/t1', 'i007c/t2', 'i007c/t3', 'i007c/t4', 'i007c/t5'],
    },
    'i007c/t1': {
        parent: 'i007c/test',
        repo: 'i007c/t1',
        detail: '',
        datetime: 12,
    },
    'i007c/t2': {
        parent: 'i007c/test',
        repo: 'i007c/t2',
        detail: '',
        datetime: 12,
    },
    'i007c/t3': {
        parent: 'i007c/test',
        repo: 'i007c/t3',
        detail: '',
        datetime: 12,
    },
    'i007c/t4': {
        parent: 'i007c/test',
        repo: 'i007c/t4',
        detail: '',
        datetime: 12,
    },
    'i007c/t5': {
        parent: 'i007c/test',
        repo: 'i007c/t5',
        detail: '',
        datetime: 12,
        childs: ['i007c/t51', 'i007c/t52'],
    },

    'i007c/t51': {
        parent: 'i007c/t5',
        repo: 'i007c/t51',
        detail: '',
        datetime: 12,
    },
    'i007c/t52': {
        parent: 'i007c/t5',
        repo: 'i007c/t52',
        detail: '',
        datetime: 12,
    },

    'i007c/delta': {
        repo: 'i007c/delta',
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
        childs: ['i007c/donkeyobj', 'i007c/hera'],
    },
    'i007c/donkeyobj': {
        parent: 'i007c/apollo',
        repo: 'i007c/donkeyobj',
        detail: '.obj file parser',
        datetime: 1688903670,
    },
    'i007c/hera': {
        parent: 'i007c/apollo',
        repo: 'i007c/hera',
        detail: 'image viewer',
        datetime: 1689800497,
    },
}

DEFAULT = {
    'i007c/test': {
        repo: 'i007c/test',
        detail: '',
        datetime: 12,
        childs: ['i007c/t1', 'i007c/t2', 'i007c/t3', 'i007c/t4', 'i007c/t5'],
    },
    'i007c/t1': {
        parent: 'i007c/test',
        repo: 'i007c/t1',
        detail: '',
        datetime: 12,
    },
    'i007c/t2': {
        parent: 'i007c/test',
        repo: 'i007c/t2',
        detail: '',
        datetime: 12,
    },
    'i007c/t3': {
        parent: 'i007c/test',
        repo: 'i007c/t3',
        detail: '',
        datetime: 12,
    },
    'i007c/t4': {
        parent: 'i007c/test',
        repo: 'i007c/t4',
        detail: '',
        datetime: 12,
    },
    'i007c/t5': {
        parent: 'i007c/test',
        repo: 'i007c/t5',
        detail: '',
        datetime: 12,
        childs: ['i007c/t51', 'i007c/t52'],
    },
    'i007c/t51': {
        parent: 'i007c/t5',
        repo: 'i007c/t51',
        detail: '',
        datetime: 12,
    },
    'i007c/t52': {
        parent: 'i007c/t5',
        repo: 'i007c/t52',
        detail: '',
        datetime: 12,
    },
    'i007c/delta': {
        repo: 'i007c/delta',
        detail: 'project tree viewer',
        datetime: 1697501934,
        childs: [
            'master/new',
            'master/new-1',
            'master/new-2',
            'master/new-3',
            'master/new-4',
            'master/new-5',
            'master/new-6',
            'master/new-7',
            'master/new-8',
            'master/new-9',
            'master/new-10',
            'master/new-11',
            'master/new-12',
            'master/new-13',
            'master/new-14',
        ],
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
        childs: ['i007c/donkeyobj', 'i007c/hera'],
    },
    'i007c/donkeyobj': {
        parent: 'i007c/apollo',
        repo: 'i007c/donkeyobj',
        detail: '.obj file parser',
        datetime: 1688903670,
    },
    'i007c/hera': {
        parent: 'i007c/apollo',
        repo: 'i007c/hera',
        detail: 'image viewer',
        datetime: 1689800497,
    },
    'master/new': {
        repo: 'master/new',
        childs: [],
        detail: '',
        datetime: 1697747954,
        parent: 'i007c/delta',
    },
    'master/new-1': {
        repo: 'master/new-1',
        childs: [],
        detail: '',
        datetime: 1697747956,
        parent: 'i007c/delta',
    },
    'master/new-2': {
        repo: 'master/new-2',
        childs: [],
        detail: '',
        datetime: 1697747956,
        parent: 'i007c/delta',
    },
    'master/new-3': {
        repo: 'master/new-3',
        childs: [],
        detail: '',
        datetime: 1697747956,
        parent: 'i007c/delta',
    },
    'master/new-4': {
        repo: 'master/new-4',
        childs: [],
        detail: '',
        datetime: 1697747956,
        parent: 'i007c/delta',
    },
    'master/new-5': {
        repo: 'master/new-5',
        childs: [],
        detail: '',
        datetime: 1697747956,
        parent: 'i007c/delta',
    },
    'master/new-6': {
        repo: 'master/new-6',
        childs: [],
        detail: '',
        datetime: 1697747957,
        parent: 'i007c/delta',
    },
    'master/new-7': {
        repo: 'master/new-7',
        childs: ['master/new-15'],
        detail: '',
        datetime: 1697747957,
        parent: 'i007c/delta',
    },
    'master/new-8': {
        repo: 'master/new-8',
        childs: [],
        detail: '',
        datetime: 1697747957,
        parent: 'i007c/delta',
    },
    'master/new-9': {
        repo: 'master/new-9',
        childs: [],
        detail: '',
        datetime: 1697747957,
        parent: 'i007c/delta',
    },
    'master/new-10': {
        repo: 'master/new-10',
        childs: [],
        detail: '',
        datetime: 1697747957,
        parent: 'i007c/delta',
    },
    'master/new-11': {
        repo: 'master/new-11',
        childs: [],
        detail: '',
        datetime: 1697747957,
        parent: 'i007c/delta',
    },
    'master/new-12': {
        repo: 'master/new-12',
        childs: [],
        detail: '',
        datetime: 1697747958,
        parent: 'i007c/delta',
    },
    'master/new-13': {
        repo: 'master/new-13',
        childs: [],
        detail: '',
        datetime: 1697747960,
        parent: 'i007c/delta',
    },
    'master/new-14': {
        repo: 'master/new-14',
        childs: [],
        detail: '',
        datetime: 1697747960,
        parent: 'i007c/delta',
    },
    'master/new-15': {
        repo: 'master/new-15',
        childs: [],
        detail: '',
        datetime: 0,
        parent: 'master/new-7',
    },
}

const [projects, setProjects] = createStore(DEFAULT)

export { projects, setProjects }
