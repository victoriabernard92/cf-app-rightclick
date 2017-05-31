(function () {
  'use strict'
  // If Browser won't be compatible
  if (!window.addEventListener) { return }
  var options = { window: window }
  var Right_Click = {'options': {} }
  var currSelection
  var formats = {} // dict of formats that are enabled
  function updateOpts () {
    Right_Click.options = options
    for (var key in options.modifiers) { // temporarily set formats var TODO change to when button is enabeld
      if (Right_Click.options.modifiers[key]) {
        formats[key] = true
      } else {
        formats[key] = false
      }
    }
  }
  if (typeof window.INSTALL_OPTIONS === 'object') {
    for (var key in INSTALL_OPTIONS) {
      options[key] = INSTALL_OPTIONS[key]
      Right_Click.options[key] = options[key]
      //pop open menu
      // openMenu()
    }
  } else { // Just for when we are development mode from browser to simulate
    var options = {
      'backgroundColor': '#FFFFFF',
      'modifiers': {
        'bold': true,
        'backColor': false,
        'italic': true,
        'fontName': false,
        'strikeThrough': true,
        'underline': true,
        'justifyCenter': true,
        'justifyFull': true,
        'justifyLeft': true,
        'justifyRight': true
      }
    }
    for (var key in options) { Right_Click.options[key] = options[key] }
  }

  // call set by install.json "execute": "INSTALL_SCOPE.setOptions(INSTALL_OPTIONS)"
  // apps team provides INSTALL_OPTIONS and the excution of this function granted line aboeve is in install.json
  window.INSTALL_SCOPE = {
    setOptions: function (opts) {
      for (var key in opts) {
        Right_Click.options[key] = opts[key]
        updateOpts()
        openMenu()
      }
    }
  }

  function menuClicked () {
    currSelection = window.getSelection()
   // this is the button
   // Toggle the menu button that was clicked
    if (this.getAttribute('active') == 'true') { this.setAttribute('active', 'false') } else { this.setAttribute('active', 'true') }

    console.log('menu click')
     // if something was selection was this button was toggled, toggle that selection's balue for this type
    var type = this.firstChild.id
    document.body.setAttribute('contenteditable', true)
    document.execCommand(type, false, '') // toggle the type of whatever is selected
    document.body.setAttribute('contenteditable', false)
  }

  var currMenu

  function closeMenu () {
    currMenu.close()
    currMenu = undefined
  }

  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateOpts)
  } else {
    updateOpts()
  }
  document.addEventListener('contextmenu', function (e) { // function e sam a e =>
  // Prevents right click from default from opening
    e.preventDefault()
    openMenu(e)
  })
  function openMenu(e){
    if (currMenu) {
      closeMenu()
      return
    }
    var menu = new Menu()
    currMenu = menu
    // Display menu
    console.log(e, "last pos" + menu.lastposx)

    var pos = menu.getPosition(e)
    currSelection = window.getSelection()
    menu.displayAt(pos.x, pos.y)

  }
// from install.json varibles/type varible from execCommand(type) TO the dictionary for the buttons specified in bootstrap
// key avalible https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
// values avalible https://www.w3schools.com/icons/icons_reference.asp
  var iconDict = {
    'bold': 'format_bold',
    'backColor': 'highlight',
    'italic': 'format_italic',
    'fontName': 'code',
    'strikeThrough': 'format_strikethrough',
    'underline': 'format_underlined',
    'justifyCenter': 'format_align_center',
    'justifyFull': 'format_align_justify',

    'justifyLeft': 'format_align_left',
    'justifyRight': 'format_align_right'

  }
  function Menu () {
  // hold DOM element.
  // createElement to actually make the div
    this.el = document.createElement('div')
  // set absolute pos
    this.el.style.position = 'absolute'
    this.el.className = 'cf-menu'
    this.el.style.backgroundColor = Right_Click.options.backgroundColor
    this.lastposx = window.innerWidth / 2;
    this.lastposy = window.innerHeight / 2;
  // Push all enabled options into arr
    var arr = []
    var keys = Right_Click.options.modifiers
    for (key in keys) {
      if (Right_Click.options.modifiers[key]) {
        arr.push(key)
      }
    }

    var menuHTMLString = `<div class="btn-group">`
    var buttonBar = document.createElement('div')/// ?? I don't have to worry about cleaning up from memory right?
    buttonBar.className = 'btn-group'
    buttonBar.style.backgroundColor = Right_Click.options.backgroundColor

    for (var item in arr) {
    // buttonBar.chi
      var button = document.createElement('button')
      button.className = 'btn btn-info'
      button.type = 'button'
      button.setAttribute('active', 'false')
      var icon = document.createElement('i')
      icon.className = 'material-icons'
      icon.id = arr[item]
      icon.innerHTML = iconDict[arr[item]]
      button.appendChild(icon)
      button.addEventListener('click', menuClicked)
      buttonBar.appendChild(button)
    }

    this.el.appendChild(buttonBar)
  } // if we didn't include the prototype we would have to include this function in the constructor e.g.  function Menu()
  Menu.prototype.displayAt = function (x, y) {
  // set style postiton
    if (!x || !y){
      x = this.lastposx
      y = this.lastposy
    }
    this.el.style.left = x + 'px'
    this.el.style.top = y + 'px'
    console.log(x)

  // use appendChild to get DOM to actually show
    document.body.appendChild(this.el)
  }
  Menu.prototype.close = function () {
  // removeChild
    if (this.el) { document.body.removeChild(this.el) }
  }
  Menu.prototype.getPosition = function (e) {
    // var posx = 0
    // var posy = 0
     var posx = this.lastposx
     var posy = this.lastposy


    if (!e) var e = window.event

    if (e.pageX || e.pageY) {
      posx = e.pageX
      posy = e.pageY
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft +
                      document.documentElement.scrollLeft
      posy = e.clientY + document.body.scrollTop +
                      document.documentElement.scrollTop
    }
    this.lastposy = posy
    this.lastposx = posx
    console.log(this.asdads)
    if(posx === 0 && posy === 0 ){
      console.log(this.asdads)
      return {
        x: this.lastposy,
        y: this.lastposx
      }
    }
    return {
      x: posx,
      y: posy
    }
  }
})()
