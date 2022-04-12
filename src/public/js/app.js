
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const MACINTOSH = 'darkMode'
const body = $("body")
const darkModeBtn = $('.dark-mode-btn')
const lightModeBtn = $('.light-mode-btn')

$('#onSidebar').onclick = function() {
    $('#sidebar').classList.toggle('active')
    $('#content').classList.toggle('active')
    body.classList.toggle('overflow-x')
}

const bgMode = {
    config: JSON.parse(localStorage.getItem(MACINTOSH)) || {},

    setConfig(key, value) {
        this.config[key] = value
        localStorage.setItem(MACINTOSH, JSON.stringify(this.config))
    },

    loadConfig() {
        this.darkMode = this.config.darkMode
    },

    darkMode() {
        var _this = this
        _this.loadConfig()
        if (_this.darkMode)
            body.classList.add('dark')
        else
            body.classList.remove('dark')


        darkModeBtn.onclick = function() {
            body.classList.add('dark')
            _this.loadConfig()
            _this.setConfig('darkMode', true)
        }
        lightModeBtn.onclick = function() {
            body.classList.remove('dark')
            _this.loadConfig()
            _this.setConfig('darkMode', false)
        }
    },

}
bgMode.darkMode()

function getParent(element, selector) {
    while (element.parentElement) {
        if (element.parentElement.matches(selector)) return element.parentElement
        element = element.parentElement
    }
}

var searchInput = document.querySelector('header .navbar-search-input')
var searchSubmit = document.querySelector('header .search-submit')
const func = {
    handleSearchInput() {
        searchSubmit.onclick = function (e) {
          if(searchInput.value.trim() === '')
            e.preventDefault()
      }
    },

    start() {
      this.handleSearchInput()
    }

}


func.start()
