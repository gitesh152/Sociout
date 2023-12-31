const select = (el, all = false) => {
    el = el.trim()
    if (all) {
        return [...document.querySelectorAll(el)]
    } else {
        return document.querySelector(el)
    }
}
const on = (type, el, listener, all = false) => {
    if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
        select(el, all).addEventListener(type, listener)
    }
}
if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
        select('body').classList.toggle('toggle-sidebar')
    })
}

if (select('.toggle-chatbox-btn')) {
    on('click', '.toggle-chatbox-btn', function (e) {
        select('body').classList.toggle('toggle-chatbox')
    })
}


/**
   * Easy on scroll event listener 
   */
const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
}

/**
  * Back to top button
  */
let backtotop = select('.back-to-top')
if (backtotop) {
    const toggleBacktotop = () => {
        if (window.scrollY > 100) {
            backtotop.classList.add('active')
        } else {
            backtotop.classList.remove('active')
        }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
}

