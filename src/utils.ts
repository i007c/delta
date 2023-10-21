const now_iso = () => {
    const date = new Date()
    let out = ''

    out += date.getFullYear() + '-'
    out += date.getMonth() + '-'
    out += date.getDate() + '_'

    out += date.getHours() + '-'
    out += date.getMinutes() + '-'
    out += date.getSeconds() + '-'
    out += date.getMilliseconds()

    return out
}

export { now_iso }
