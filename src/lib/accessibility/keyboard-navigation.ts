'use client'

export interface KeyboardNavigationConfig {
  enableTabTrapping?: boolean
  enableSkipLinks?: boolean
  enableArrowNavigation?: boolean
  enableEscapeHandling?: boolean
  enableRovingTabIndex?: boolean
  focusRingColor?: string
  focusRingWidth?: string
  announceNavigation?: boolean
  debug?: boolean
}

export interface NavigationGroup {
  container: HTMLElement
  items: HTMLElement[]
  orientation: 'horizontal' | 'vertical' | 'both'
  wrap?: boolean
  activeIndex: number
}

export interface FocusableElement {
  element: HTMLElement
  tabIndex: number
  role?: string
  isVisible: boolean
  isEnabled: boolean
}

// Keyboard Navigation implementation
export class KeyboardNavigation {
  private config: Required<KeyboardNavigationConfig>
  private navigationGroups = new Map<HTMLElement, NavigationGroup>()
  private focusStack: HTMLElement[] = []
  private skipLinks: HTMLElement[] = []
  private eventListeners: Array<{ element: EventTarget; type: string; listener: EventListener }> = []

  constructor(config: KeyboardNavigationConfig = {}) {
    this.config = {
      enableTabTrapping: true,
      enableSkipLinks: true,
      enableArrowNavigation: true,
      enableEscapeHandling: true,
      enableRovingTabIndex: true,
      focusRingColor: '#0066cc',
      focusRingWidth: '2px',
      announceNavigation: true,
      debug: process.env.NODE_ENV === 'development',
      ...config
    }

    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize(): void {
    this.setupGlobalKeyboardHandlers()
    
    if (this.config.enableSkipLinks) {
      this.createSkipLinks()
    }

    this.setupFocusStyles()
    this.scanForNavigationGroups()
    
    // Setup mutation observer for dynamic content
    this.setupMutationObserver()

    if (this.config.debug) {
      console.log('Keyboard navigation initialized')
    }
  }

  private setupGlobalKeyboardHandlers(): void {
    const keydownHandler = (event: KeyboardEvent) => {
      this.handleGlobalKeydown(event)
    }

    const focusHandler = (event: FocusEvent) => {
      this.handleFocusChange(event)
    }

    document.addEventListener('keydown', keydownHandler)
    document.addEventListener('focusin', focusHandler)

    this.eventListeners.push(
      { element: document, type: 'keydown', listener: keydownHandler },
      { element: document, type: 'focusin', listener: focusHandler }
    )
  }

  private handleGlobalKeydown(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement
    
    switch (event.key) {
      case 'Tab':
        this.handleTabNavigation(event)
        break
      case 'Escape':
        if (this.config.enableEscapeHandling) {
          this.handleEscapeKey(event)
        }
        break
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (this.config.enableArrowNavigation) {
          this.handleArrowNavigation(event, activeElement)
        }
        break
      case 'Home':
      case 'End':
        this.handleHomeEndNavigation(event, activeElement)
        break
      case 'Enter':
      case ' ':
        this.handleActivation(event, activeElement)
        break
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement
    const focusTrappedContainer = activeElement?.closest('[data-focus-trap="true"]')

    if (focusTrappedContainer && this.config.enableTabTrapping) {
      this.trapFocus(event, focusTrappedContainer as HTMLElement)
    }

    // Update roving tab index groups
    if (this.config.enableRovingTabIndex) {
      this.updateRovingTabIndex(activeElement)
    }
  }

  private handleArrowNavigation(event: KeyboardEvent, activeElement: HTMLElement): void {
    const group = this.findNavigationGroup(activeElement)
    if (!group) return

    const { items, orientation, wrap, activeIndex } = group
    let newIndex = activeIndex

    switch (event.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = this.getPreviousIndex(activeIndex, items.length, wrap)
          event.preventDefault()
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          newIndex = this.getNextIndex(activeIndex, items.length, wrap)
          event.preventDefault()
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = this.getPreviousIndex(activeIndex, items.length, wrap)
          event.preventDefault()
        }
        break
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          newIndex = this.getNextIndex(activeIndex, items.length, wrap)
          event.preventDefault()
        }
        break
    }

    if (newIndex !== activeIndex) {
      this.focusItem(group, newIndex)
    }
  }

  private handleHomeEndNavigation(event: KeyboardEvent, activeElement: HTMLElement): void {
    const group = this.findNavigationGroup(activeElement)
    if (!group) return

    let newIndex: number
    
    if (event.key === 'Home') {
      newIndex = 0
    } else {
      newIndex = group.items.length - 1
    }

    event.preventDefault()
    this.focusItem(group, newIndex)
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement

    // Close expanded elements
    const expandedElement = activeElement.closest('[aria-expanded="true"]')
    if (expandedElement) {
      expandedElement.setAttribute('aria-expanded', 'false')
      event.preventDefault()
      return
    }

    // Close dialogs/modals
    const dialog = activeElement.closest('[role="dialog"], .modal, .popup')
    if (dialog) {
      this.closeDialog(dialog as HTMLElement)
      event.preventDefault()
      return
    }

    // Restore focus from stack
    if (this.focusStack.length > 0) {
      const previousElement = this.focusStack.pop()
      if (previousElement) {
        previousElement.focus()
        event.preventDefault()
      }
    }
  }

  private handleActivation(event: KeyboardEvent, activeElement: HTMLElement): void {
    const role = activeElement.getAttribute('role')
    const tagName = activeElement.tagName.toLowerCase()

    // Handle custom interactive elements
    if (role === 'button' || role === 'menuitem' || role === 'tab' || role === 'option') {
      if (event.key === 'Enter' || (event.key === ' ' && role === 'button')) {
        event.preventDefault()
        activeElement.click()
        return
      }
    }

    // Handle links with role
    if (role === 'link') {
      if (event.key === 'Enter') {
        event.preventDefault()
        activeElement.click()
        return
      }
    }

    // Handle custom elements with click handlers
    if (tagName === 'div' || tagName === 'span') {
      if (activeElement.hasAttribute('tabindex') && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        activeElement.click()
      }
    }
  }

  private handleFocusChange(event: FocusEvent): void {
    const element = event.target as HTMLElement
    
    if (this.config.announceNavigation) {
      this.announceFocusChange(element)
    }

    // Update navigation group state
    const group = this.findNavigationGroup(element)
    if (group) {
      const index = group.items.indexOf(element)
      if (index !== -1) {
        group.activeIndex = index
      }
    }
  }

  // Skip Links
  private createSkipLinks(): void {
    const skipLinksData = [
      { href: '#main-content', label: 'Skip to main content', key: 'main' },
      { href: '#navigation', label: 'Skip to navigation', key: 'nav' },
      { href: '#search', label: 'Skip to search', key: 'search' },
      { href: '#footer', label: 'Skip to footer', key: 'footer' }
    ]

    const container = document.createElement('nav')
    container.className = 'skip-links'
    container.setAttribute('aria-label', 'Skip navigation links')
    container.style.cssText = `
      position: absolute;
      top: -100px;
      left: 0;
      z-index: 10000;
      width: 100%;
    `

    skipLinksData.forEach(({ href, label, key }) => {
      const targetExists = document.querySelector(href)
      if (!targetExists) return

      const link = document.createElement('a')
      link.href = href
      link.textContent = label
      link.className = 'skip-link'
      link.setAttribute('data-skip-target', key)
      
      link.style.cssText = `
        position: absolute;
        left: 6px;
        top: 7px;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        font-size: 14px;
        font-weight: 600;
        transition: top 0.2s ease;
        transform: translateY(-100px);
      `

      // Show on focus
      link.addEventListener('focus', () => {
        link.style.transform = 'translateY(0)'
      })

      link.addEventListener('blur', () => {
        link.style.transform = 'translateY(-100px)'
      })

      // Handle click
      link.addEventListener('click', (event) => {
        event.preventDefault()
        const target = document.querySelector(href) as HTMLElement
        if (target) {
          this.focusElement(target)
          this.announceNavigation(`Skipped to ${label.toLowerCase()}`)
        }
      })

      container.appendChild(link)
      this.skipLinks.push(link)
    })

    document.body.insertBefore(container, document.body.firstChild)
  }

  // Navigation Groups
  public registerNavigationGroup(
    container: HTMLElement,
    options: {
      selector?: string
      orientation?: 'horizontal' | 'vertical' | 'both'
      wrap?: boolean
      rovingTabIndex?: boolean
    } = {}
  ): NavigationGroup {
    const {
      selector = '[role="menuitem"], [role="tab"], [role="option"], button, a',
      orientation = 'vertical',
      wrap = true,
      rovingTabIndex = this.config.enableRovingTabIndex
    } = options

    const items = Array.from(container.querySelectorAll(selector)) as HTMLElement[]
    const visibleItems = items.filter(item => this.isElementVisible(item))

    const group: NavigationGroup = {
      container,
      items: visibleItems,
      orientation,
      wrap,
      activeIndex: 0
    }

    this.navigationGroups.set(container, group)

    // Setup roving tab index if enabled
    if (rovingTabIndex) {
      this.setupRovingTabIndex(group)
    }

    // Mark container
    container.setAttribute('data-navigation-group', 'true')

    if (this.config.debug) {
      console.log('Registered navigation group:', group)
    }

    return group
  }

  private setupRovingTabIndex(group: NavigationGroup): void {
    group.items.forEach((item, index) => {
      // Set initial tab index
      item.tabIndex = index === 0 ? 0 : -1

      // Store original tab index
      if (!item.hasAttribute('data-original-tabindex')) {
        item.setAttribute('data-original-tabindex', item.tabIndex.toString())
      }
    })
  }

  private updateRovingTabIndex(activeElement: HTMLElement): void {
    const group = this.findNavigationGroup(activeElement)
    if (!group) return

    group.items.forEach((item, index) => {
      item.tabIndex = item === activeElement ? 0 : -1
    })
  }

  private scanForNavigationGroups(): void {
    // Auto-detect common navigation patterns
    const patterns = [
      { selector: '[role="menubar"]', orientation: 'horizontal' as const },
      { selector: '[role="menu"]', orientation: 'vertical' as const },
      { selector: '[role="tablist"]', orientation: 'horizontal' as const },
      { selector: '[role="listbox"]', orientation: 'vertical' as const },
      { selector: 'nav ul', orientation: 'vertical' as const },
      { selector: '.tabs', orientation: 'horizontal' as const },
      { selector: '.menu', orientation: 'vertical' as const }
    ]

    patterns.forEach(({ selector, orientation }) => {
      const containers = document.querySelectorAll(selector)
      containers.forEach(container => {
        if (!this.navigationGroups.has(container as HTMLElement)) {
          this.registerNavigationGroup(container as HTMLElement, { orientation })
        }
      })
    })
  }

  // Focus Management
  public focusElement(element: HTMLElement, options: { preventScroll?: boolean } = {}): void {
    if (!this.isElementFocusable(element)) {
      // Make element focusable temporarily
      element.tabIndex = -1
    }

    element.focus({ preventScroll: options.preventScroll })

    // Ensure element is visible
    if (!options.preventScroll) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }

  public trapFocus(event: KeyboardEvent, container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement?.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement?.focus()
    }
  }

  public pushFocus(element: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement
    if (currentFocus && currentFocus !== element) {
      this.focusStack.push(currentFocus)
    }
  }

  public popFocus(): HTMLElement | null {
    const element = this.focusStack.pop()
    if (element) {
      this.focusElement(element)
      return element
    }
    return null
  }

  private closeDialog(dialog: HTMLElement): void {
    // Remove focus trap
    dialog.removeAttribute('data-focus-trap')
    
    // Dispatch close event
    const closeEvent = new CustomEvent('dialog:close', {
      detail: { dialog },
      bubbles: true
    })
    dialog.dispatchEvent(closeEvent)

    // Restore focus
    this.popFocus()
  }

  // Helper Methods
  private findNavigationGroup(element: HTMLElement): NavigationGroup | null {
    for (const [container, group] of this.navigationGroups.entries()) {
      if (container.contains(element) || group.items.includes(element)) {
        return group
      }
    }
    return null
  }

  private focusItem(group: NavigationGroup, index: number): void {
    if (index < 0 || index >= group.items.length) return

    const item = group.items[index]
    group.activeIndex = index

    // Update roving tab index
    if (this.config.enableRovingTabIndex) {
      group.items.forEach((item, i) => {
        item.tabIndex = i === index ? 0 : -1
      })
    }

    this.focusElement(item)
  }

  private getNextIndex(currentIndex: number, length: number, wrap: boolean): number {
    if (currentIndex < length - 1) {
      return currentIndex + 1
    }
    return wrap ? 0 : currentIndex
  }

  private getPreviousIndex(currentIndex: number, length: number, wrap: boolean): number {
    if (currentIndex > 0) {
      return currentIndex - 1
    }
    return wrap ? length - 1 : currentIndex
  }

  private getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      '[role="button"]:not([aria-disabled="true"])',
      '[role="link"]:not([aria-disabled="true"])',
      '[role="menuitem"]:not([aria-disabled="true"])',
      '[role="tab"]:not([aria-disabled="true"])'
    ].join(', ')

    return Array.from(container.querySelectorAll(selector))
      .filter(element => this.isElementVisible(element as HTMLElement)) as HTMLElement[]
  }

  private isElementFocusable(element: HTMLElement): boolean {
    if (element.tabIndex < 0) return false
    if (element.hasAttribute('disabled')) return false
    if (element.getAttribute('aria-disabled') === 'true') return false
    if (!this.isElementVisible(element)) return false
    
    return true
  }

  private isElementVisible(element: HTMLElement): boolean {
    if (element.offsetParent === null) return false
    if (window.getComputedStyle(element).visibility === 'hidden') return false
    if (window.getComputedStyle(element).display === 'none') return false
    
    return true
  }

  private setupFocusStyles(): void {
    const style = document.createElement('style')
    style.textContent = `
      /* Enhanced focus styles */
      *:focus-visible {
        outline: ${this.config.focusRingWidth} solid ${this.config.focusRingColor} !important;
        outline-offset: 2px !important;
      }
      
      /* Skip links styles */
      .skip-link:focus {
        outline: ${this.config.focusRingWidth} solid #fff !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px ${this.config.focusRingColor} !important;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        *:focus-visible {
          outline: 3px solid !important;
          outline-offset: 2px !important;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .skip-link {
          transition: none !important;
        }
      }
    `
    document.head.appendChild(style)
  }

  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false

      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              
              // Check if new navigation groups were added
              if (element.matches('[role="menu"], [role="menubar"], [role="tablist"], nav ul')) {
                shouldRescan = true
              }
            }
          })
        }
      })

      if (shouldRescan) {
        this.scanForNavigationGroups()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // Announcement methods
  private announceFocusChange(element: HTMLElement): void {
    const label = this.getAccessibleName(element)
    const role = element.getAttribute('role') || element.tagName.toLowerCase()
    
    if (label) {
      this.announceNavigation(`${label}, ${role}`)
    }
  }

  private getAccessibleName(element: HTMLElement): string {
    // Check aria-label
    const ariaLabel = element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel

    // Check aria-labelledby
    const ariaLabelledby = element.getAttribute('aria-labelledby')
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby)
      if (labelElement) return labelElement.textContent?.trim() || ''
    }

    // Check title
    const title = element.title
    if (title) return title

    // Check text content
    const text = element.textContent?.trim()
    if (text) return text

    // Check alt for images
    if (element.tagName === 'IMG') {
      return (element as HTMLImageElement).alt
    }

    return ''
  }

  private announceNavigation(message: string): void {
    if (!this.config.announceNavigation) return

    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // Public API methods
  public getNavigationGroups(): NavigationGroup[] {
    return Array.from(this.navigationGroups.values())
  }

  public removeNavigationGroup(container: HTMLElement): boolean {
    const group = this.navigationGroups.get(container)
    if (!group) return false

    // Restore original tab indexes
    group.items.forEach(item => {
      const originalTabIndex = item.getAttribute('data-original-tabindex')
      if (originalTabIndex !== null) {
        item.tabIndex = parseInt(originalTabIndex)
        item.removeAttribute('data-original-tabindex')
      }
    })

    container.removeAttribute('data-navigation-group')
    return this.navigationGroups.delete(container)
  }

  public refreshNavigationGroups(): void {
    // Clear existing groups
    this.navigationGroups.clear()
    
    // Rescan for groups
    this.scanForNavigationGroups()
  }

  public destroy(): void {
    // Remove event listeners
    this.eventListeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener)
    })
    this.eventListeners = []

    // Clear navigation groups
    this.navigationGroups.clear()

    // Remove skip links
    this.skipLinks.forEach(link => link.remove())
    this.skipLinks = []

    // Clear focus stack
    this.focusStack = []
  }
}

// Singleton instance
let keyboardNavigation: KeyboardNavigation | null = null

export function getKeyboardNavigation(config?: KeyboardNavigationConfig): KeyboardNavigation {
  if (!keyboardNavigation && typeof window !== 'undefined') {
    keyboardNavigation = new KeyboardNavigation(config)
  }
  return keyboardNavigation!
}

export function initKeyboardNavigation(config?: KeyboardNavigationConfig): KeyboardNavigation {
  return getKeyboardNavigation(config)
}

// Utility functions
export function registerNavigationGroup(
  container: HTMLElement,
  options?: Parameters<KeyboardNavigation['registerNavigationGroup']>[1]
): NavigationGroup {
  const nav = getKeyboardNavigation()
  return nav.registerNavigationGroup(container, options)
}

export function focusElement(element: HTMLElement, options?: { preventScroll?: boolean }): void {
  const nav = getKeyboardNavigation()
  nav.focusElement(element, options)
}

export function trapFocus(container: HTMLElement): void {
  container.setAttribute('data-focus-trap', 'true')
}

export function releaseFocus(container: HTMLElement): void {
  container.removeAttribute('data-focus-trap')
}

export default KeyboardNavigation