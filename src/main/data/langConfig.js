import Store from 'electron-store'

export default new Store({
    defaults: {
        LANGUAGE: 'en'
    },
    name: 'LangConfig'
})
