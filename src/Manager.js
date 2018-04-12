import zenscroll from 'zenscroll'
import { debounce } from './utils/func'
import { getBestAnchorGivenScrollLocation, getScrollTop } from './utils/scroll'
import { getHash, updateHash, removeHash } from './utils/hash'

const defaultConfig = {
  offset: 0,
  scrollDuration: 400,
  keepLastAnchorHash: false
}


class Manager {
  constructor() {
    this.anchors = {}
    this.forcedHash = false
    this.config = defaultConfig

    this.scrollHandler = debounce(this.handleScroll, 100)
    this.forceHashUpdate = debounce(this.handleHashChange, 1)
  }

  setContainer = () => {
    // if we have a containerId, find the scrolling container, else set it to window
    if (this.config.containerId) {
      this.config.container = document.getElementById(this.config.containerId)
    } else {
      this.config.container = window
    }
  }

  addListeners = () => {
    this.config.container.addEventListener('scroll', this.scrollHandler, false)
    this.config.container.addEventListener('hashchange', this.handleHashChange)
  }

  removeListeners = () => {
    this.config.container.removeEventListener('scroll', this.scrollHandler, false)
    this.config.container.removeEventListener('hashchange', this.handleHashChange)
  }

  configure = (config) => {
    this.config = {
      ...defaultConfig,
      ...config
    }
  }

  goToTop = () => {
    if (getScrollTop() === 0) return
    this.forcedHash = true
    (container).scroll(0,0)
    removeHash()
  }

  addAnchor = (id, component) => {
    // if container is not set, set container
    if (!this.config.container) {
      this.setContainer()
    }
    // if this is the first anchor, set up listeners
    if (Object.keys(this.anchors).length === 0) {
      this.addListeners()
    }
    this.forceHashUpdate()
    this.anchors[id] = component
  }

  removeAnchor = (id) => {
    delete this.anchors[id]
    // if this is the last anchor, remove listeners
    if (Object.keys(this.anchors).length === 0) {
      this.removeListeners()
    }
  }

  handleScroll = () => {
    const {offset, keepLastAnchorHash} = this.config
    const bestAnchorId = getBestAnchorGivenScrollLocation(this.anchors, offset)

    if (bestAnchorId && getHash() !== bestAnchorId) {
      this.forcedHash = true
      updateHash(bestAnchorId, false)
    } else if (!bestAnchorId && !keepLastAnchorHash) {
      removeHash()
    }
  }

  handleHashChange = (e) => {
    if (this.forcedHash) {
      this.forcedHash = false
    } else {
      this.goToSection(getHash())
    }
  }

  goToSection = (id) => {
    let element = this.anchors[id]
    if (element) {
      zenscroll.center(element, this.config.scrollDuration, this.config.offset)
    } else {
      // make sure that standard hash anchors don't break.
      // simply jump to them.
      element = document.getElementById(id)
      if (element) {
        zenscroll.center(element, 0, this.config.offset)
      }
    }
  }
}

export default new Manager()
