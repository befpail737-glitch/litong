'use client'

export interface AccessibilityConfig {
  enableKeyboardNavigation?: boolean
  enableScreenReader?: boolean
  enableFocusManagement?: boolean
  enableColorContrast?: boolean
  enableAriaLabels?: boolean
  enableSemanticHTML?: boolean
  contrastRatio?: 'AA' | 'AAA'
  debug?: boolean
  autoFix?: boolean
}

export interface AccessibilityAudit {
  element: HTMLElement
  rule: string
  severity: 'error' | 'warning' | 'info'
  message: string
  wcagLevel: 'A' | 'AA' | 'AAA'
  wcagCriterion: string
  suggestion?: string
  autoFixable?: boolean
}

export interface ColorContrastResult {
  ratio: number
  aaCompliant: boolean
  aaaCompliant: boolean
  foreground: string
  background: string
}

export interface FocusManagementOptions {
  skipLinks?: boolean
  focusTrap?: boolean
  focusIndicators?: boolean
  tabOrder?: boolean
}

// WCAG 2.1 Compliance implementation
export class WCAGCompliance {
  private config: Required<AccessibilityConfig>
  private observers: Array<MutationObserver | IntersectionObserver> = []
  private focusStack: HTMLElement[] = []
  private currentDialog: HTMLElement | null = null
  private skipLinkContainer: HTMLElement | null = null

  constructor(config: AccessibilityConfig = {}) {
    this.config = {
      enableKeyboardNavigation: true,
      enableScreenReader: true,
      enableFocusManagement: true,
      enableColorContrast: true,
      enableAriaLabels: true,
      enableSemanticHTML: true,
      contrastRatio: 'AA',
      debug: process.env.NODE_ENV === 'development',
      autoFix: false,
      ...config
    }

    if (typeof window !== 'undefined') {
      this.initialize()
    }
  }

  private initialize(): void {
    // Initialize keyboard navigation
    if (this.config.enableKeyboardNavigation) {
      this.setupKeyboardNavigation()
    }

    // Initialize focus management
    if (this.config.enableFocusManagement) {
      this.setupFocusManagement()
    }

    // Initialize screen reader support
    if (this.config.enableScreenReader) {
      this.setupScreenReaderSupport()
    }

    // Setup mutation observer for dynamic content
    this.setupMutationObserver()

    // Run initial audit
    if (this.config.debug) {
      setTimeout(() => this.auditPage(), 1000)
    }
  }

  // Keyboard Navigation
  private setupKeyboardNavigation(): void {
    // Add skip links
    this.addSkipLinks()

    // Handle tab navigation
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardNavigation(event)
    })

    // Ensure all interactive elements are focusable
    this.ensureFocusableElements()

    // Add visible focus indicators
    this.addFocusIndicators()
  }

  private addSkipLinks(): void {
    const skipLinks = [
      { href: '#main', text: 'Skip to main content' },
      { href: '#navigation', text: 'Skip to navigation' },
      { href: '#footer', text: 'Skip to footer' }
    ]

    const container = document.createElement('div')
    container.className = 'skip-links'
    container.setAttribute('aria-label', 'Skip links')
    
    const styles = `
      .skip-links {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10000;
      }
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px 12px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        font-size: 14px;
        transition: top 0.2s;
      }
      .skip-link:focus {
        top: 0;
      }
    `

    // Add styles
    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    skipLinks.forEach(({ href, text }) => {
      const link = document.createElement('a')
      link.href = href
      link.textContent = text
      link.className = 'skip-link'
      container.appendChild(link)
    })

    document.body.insertBefore(container, document.body.firstChild)
    this.skipLinkContainer = container
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    const activeElement = document.activeElement as HTMLElement

    switch (event.key) {
      case 'Tab':
        // Handle tab trapping in modals
        if (this.currentDialog) {
          this.trapFocusInDialog(event, this.currentDialog)
        }
        break

      case 'Escape':
        // Close modals/dropdowns
        this.handleEscapeKey(event)
        break

      case 'Enter':
      case ' ':
        // Activate custom interactive elements
        this.handleActivation(event, activeElement)
        break

      case 'ArrowDown':
      case 'ArrowUp':
        // Handle arrow key navigation in menus/lists
        this.handleArrowNavigation(event, activeElement)
        break
    }
  }

  private trapFocusInDialog(event: KeyboardEvent, dialog: HTMLElement): void {
    const focusableElements = this.getFocusableElements(dialog)
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

  private handleEscapeKey(event: KeyboardEvent): void {
    // Close current modal/dropdown
    if (this.currentDialog) {
      this.closeDialog(this.currentDialog)
      event.preventDefault()
    }

    // Close expanded menus
    const expandedMenus = document.querySelectorAll('[aria-expanded="true"]')
    expandedMenus.forEach(menu => {
      menu.setAttribute('aria-expanded', 'false')
    })
  }

  private handleActivation(event: KeyboardEvent, element: HTMLElement): void {
    if (!element) return

    const role = element.getAttribute('role')
    const tagName = element.tagName.toLowerCase()

    // Handle custom buttons
    if (role === 'button' || (tagName === 'div' && element.hasAttribute('tabindex'))) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        element.click()
      }
    }

    // Handle menu items
    if (role === 'menuitem') {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        element.click()
      }
    }
  }

  private handleArrowNavigation(event: KeyboardEvent, element: HTMLElement): void {
    const role = element.getAttribute('role')
    const parent = element.closest('[role="menu"], [role="listbox"], [role="tablist"]')

    if (!parent) return

    const items = Array.from(parent.querySelectorAll('[role="menuitem"], [role="option"], [role="tab"]'))
    const currentIndex = items.indexOf(element)

    let nextIndex: number
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % items.length
    } else {
      nextIndex = (currentIndex - 1 + items.length) % items.length
    }

    event.preventDefault()
    ;(items[nextIndex] as HTMLElement)?.focus()
  }

  // Focus Management
  private setupFocusManagement(): void {
    // Track focus changes
    document.addEventListener('focusin', (event) => {
      this.onFocusChange(event.target as HTMLElement)
    })

    // Handle page navigation
    window.addEventListener('hashchange', () => {
      this.manageFocusOnNavigation()
    })

    // Add focus indicators
    this.addFocusIndicators()
  }

  private addFocusIndicators(): void {
    const styles = `
      *:focus-visible {
        outline: 2px solid #0066cc !important;
        outline-offset: 2px !important;
        border-radius: 2px !important;
      }
      
      .focus-indicator {
        box-shadow: 0 0 0 2px #0066cc, 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
      }
      
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `

    const styleSheet = document.createElement('style')
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)
  }

  private onFocusChange(element: HTMLElement): void {
    if (!element) return

    // Announce focus changes for screen readers
    this.announceFocusChange(element)

    // Ensure focus is visible
    this.ensureFocusVisible(element)
  }

  private announceFocusChange(element: HTMLElement): void {
    const ariaLabel = element.getAttribute('aria-label')
    const ariaLabelledby = element.getAttribute('aria-labelledby')
    const title = element.title
    
    if (ariaLabel || ariaLabelledby || title) {
      // Element already has accessible name
      return
    }

    // Add aria-label if missing for important elements
    const role = element.getAttribute('role')
    const tagName = element.tagName.toLowerCase()

    if (role === 'button' || tagName === 'button') {
      const text = element.textContent?.trim()
      if (text && !ariaLabel) {
        element.setAttribute('aria-label', text)
      }
    }
  }

  private ensureFocusVisible(element: HTMLElement): void {
    // Scroll element into view if needed
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    })

    // Add temporary focus indicator
    element.classList.add('focus-indicator')
    setTimeout(() => {
      element.classList.remove('focus-indicator')
    }, 200)
  }

  private manageFocusOnNavigation(): void {
    // Focus main content after navigation
    const main = document.querySelector('main, #main, [role="main"]') as HTMLElement
    if (main) {
      main.focus()
    }
  }

  // Screen Reader Support
  private setupScreenReaderSupport(): void {
    // Add live regions
    this.addLiveRegions()

    // Enhance form labels
    this.enhanceFormLabels()

    // Add image alt text validation
    this.validateImages()

    // Setup ARIA landmarks
    this.setupLandmarks()
  }

  private addLiveRegions(): void {
    // Add polite live region for general announcements
    const politeRegion = document.createElement('div')
    politeRegion.id = 'aria-live-polite'
    politeRegion.setAttribute('aria-live', 'polite')
    politeRegion.setAttribute('aria-atomic', 'true')
    politeRegion.className = 'sr-only'
    document.body.appendChild(politeRegion)

    // Add assertive live region for urgent announcements
    const assertiveRegion = document.createElement('div')
    assertiveRegion.id = 'aria-live-assertive'
    assertiveRegion.setAttribute('aria-live', 'assertive')
    assertiveRegion.setAttribute('aria-atomic', 'true')
    assertiveRegion.className = 'sr-only'
    document.body.appendChild(assertiveRegion)
  }

  private enhanceFormLabels(): void {
    const inputs = document.querySelectorAll('input, select, textarea')
    
    inputs.forEach(input => {
      const id = input.id
      if (!id) return

      const label = document.querySelector(`label[for="${id}"]`)
      if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        console.warn('Form control missing label:', input)
      }

      // Add required indicator
      if (input.hasAttribute('required')) {
        const requiredIndicator = document.createElement('span')
        requiredIndicator.textContent = ' *'
        requiredIndicator.setAttribute('aria-label', 'required')
        requiredIndicator.className = 'required-indicator'
        
        if (label) {
          label.appendChild(requiredIndicator)
        }
      }
    })
  }

  private validateImages(): void {
    const images = document.querySelectorAll('img')
    
    images.forEach(img => {
      if (!img.alt && img.alt !== '') {
        console.warn('Image missing alt text:', img)
        if (this.config.autoFix) {
          img.alt = 'Image'
        }
      }

      // Check for decorative images
      if (img.alt === '' && !img.hasAttribute('role')) {
        img.setAttribute('role', 'presentation')
      }
    })
  }

  private setupLandmarks(): void {
    // Ensure main landmark exists
    let main = document.querySelector('main, [role="main"]')
    if (!main) {
      main = document.querySelector('#main, .main-content')
      if (main && !main.hasAttribute('role')) {
        main.setAttribute('role', 'main')
      }
    }

    // Ensure navigation landmark
    const nav = document.querySelector('nav, [role="navigation"]')
    if (nav && !nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation')
    }

    // Ensure banner landmark
    const header = document.querySelector('header, [role="banner"]')
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner')
    }

    // Ensure contentinfo landmark
    const footer = document.querySelector('footer, [role="contentinfo"]')
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo')
    }
  }

  // Color Contrast Checking
  public checkColorContrast(element: HTMLElement): ColorContrastResult {
    const styles = window.getComputedStyle(element)
    const foreground = styles.color
    const background = styles.backgroundColor

    const ratio = this.calculateContrastRatio(foreground, background)
    
    return {
      ratio,
      aaCompliant: ratio >= 4.5,
      aaaCompliant: ratio >= 7,
      foreground,
      background
    }
  }

  private calculateContrastRatio(foreground: string, background: string): number {
    const fgLuminance = this.getRelativeLuminance(foreground)
    const bgLuminance = this.getRelativeLuminance(background)
    
    const lighter = Math.max(fgLuminance, bgLuminance)
    const darker = Math.min(fgLuminance, bgLuminance)
    
    return (lighter + 0.05) / (darker + 0.05)
  }

  private getRelativeLuminance(color: string): number {
    // Convert color to RGB values
    const rgb = this.colorToRGB(color)
    
    // Convert to relative luminance
    const rsRGB = rgb.r / 255
    const gsRGB = rgb.g / 255
    const bsRGB = rgb.b / 255

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  private colorToRGB(color: string): { r: number; g: number; b: number } {
    // Create a temporary element to compute color
    const div = document.createElement('div')
    div.style.color = color
    document.body.appendChild(div)
    
    const computedColor = window.getComputedStyle(div).color
    document.body.removeChild(div)

    // Parse rgb() or rgba() format
    const matches = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    
    if (matches) {
      return {
        r: parseInt(matches[1]),
        g: parseInt(matches[2]),
        b: parseInt(matches[3])
      }
    }

    // Default to black if parsing fails
    return { r: 0, g: 0, b: 0 }
  }

  // Dialog Management
  public openDialog(dialog: HTMLElement, options: { focusElement?: HTMLElement } = {}): void {
    // Save current focus
    this.focusStack.push(document.activeElement as HTMLElement)
    
    // Set current dialog
    this.currentDialog = dialog

    // Set ARIA attributes
    dialog.setAttribute('aria-modal', 'true')
    dialog.setAttribute('role', 'dialog')
    
    if (!dialog.hasAttribute('aria-labelledby') && !dialog.hasAttribute('aria-label')) {
      const title = dialog.querySelector('h1, h2, h3, h4, h5, h6, .modal-title')
      if (title) {
        const titleId = title.id || `dialog-title-${Date.now()}`
        title.id = titleId
        dialog.setAttribute('aria-labelledby', titleId)
      }
    }

    // Add inert to background content
    this.addInertToBackground(dialog)

    // Focus management
    const focusElement = options.focusElement || this.getFocusableElements(dialog)[0]
    if (focusElement) {
      focusElement.focus()
    }

    // Announce dialog opening
    this.announceToScreenReader('Dialog opened')
  }

  public closeDialog(dialog: HTMLElement): void {
    // Remove ARIA attributes
    dialog.removeAttribute('aria-modal')
    
    // Remove inert from background
    this.removeInertFromBackground()
    
    // Restore focus
    const previousFocus = this.focusStack.pop()
    if (previousFocus) {
      previousFocus.focus()
    }

    // Clear current dialog
    this.currentDialog = null

    // Announce dialog closing
    this.announceToScreenReader('Dialog closed')
  }

  private addInertToBackground(dialog: HTMLElement): void {
    const allElements = document.querySelectorAll('body > *')
    allElements.forEach(element => {
      if (!dialog.contains(element as Node) && element !== dialog) {
        (element as HTMLElement).setAttribute('inert', '')
      }
    })
  }

  private removeInertFromBackground(): void {
    const inertElements = document.querySelectorAll('[inert]')
    inertElements.forEach(element => {
      element.removeAttribute('inert')
    })
  }

  // Utility Methods
  private getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]:not([disabled])'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
  }

  private ensureFocusableElements(): void {
    // Ensure custom interactive elements are focusable
    const customButtons = document.querySelectorAll('[role="button"]:not([tabindex])')
    customButtons.forEach(button => {
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0')
      }
    })

    const customLinks = document.querySelectorAll('[role="link"]:not([tabindex])')
    customLinks.forEach(link => {
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0')
      }
    })
  }

  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite'
    const region = document.getElementById(regionId)
    
    if (region) {
      region.textContent = message
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = ''
      }, 1000)
    }
  }

  // Mutation Observer for dynamic content
  private setupMutationObserver(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.processNewElement(node as HTMLElement)
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    this.observers.push(observer)
  }

  private processNewElement(element: HTMLElement): void {
    // Validate new images
    const images = element.querySelectorAll('img')
    images.forEach(img => {
      if (!img.alt && img.alt !== '') {
        console.warn('Dynamically added image missing alt text:', img)
      }
    })

    // Ensure focusable elements have proper attributes
    const focusableElements = this.getFocusableElements(element)
    focusableElements.forEach(el => {
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && !el.textContent?.trim()) {
        console.warn('Focusable element lacks accessible name:', el)
      }
    })
  }

  // Page Audit
  public auditPage(): AccessibilityAudit[] {
    const audits: AccessibilityAudit[] = []

    // Check for missing alt text
    const images = document.querySelectorAll('img')
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        audits.push({
          element: img,
          rule: 'alt-text',
          severity: 'error',
          message: 'Image is missing alt attribute',
          wcagLevel: 'A',
          wcagCriterion: '1.1.1',
          suggestion: 'Add descriptive alt text or alt="" for decorative images',
          autoFixable: false
        })
      }
    })

    // Check form labels
    const inputs = document.querySelectorAll('input, select, textarea')
    inputs.forEach(input => {
      const id = input.id
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`)
        if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
          audits.push({
            element: input as HTMLElement,
            rule: 'form-label',
            severity: 'error',
            message: 'Form control is missing a label',
            wcagLevel: 'A',
            wcagCriterion: '3.3.2',
            suggestion: 'Add a label element or aria-label attribute',
            autoFixable: false
          })
        }
      }
    })

    // Check color contrast
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a')
    textElements.forEach(element => {
      if (element.textContent?.trim()) {
        const contrast = this.checkColorContrast(element as HTMLElement)
        const requiredRatio = this.config.contrastRatio === 'AAA' ? 7 : 4.5
        
        if (contrast.ratio < requiredRatio) {
          audits.push({
            element: element as HTMLElement,
            rule: 'color-contrast',
            severity: 'error',
            message: `Color contrast ratio ${contrast.ratio.toFixed(2)} is below ${this.config.contrastRatio} standard (${requiredRatio})`,
            wcagLevel: this.config.contrastRatio,
            wcagCriterion: '1.4.3',
            suggestion: 'Increase color contrast or change color scheme',
            autoFixable: false
          })
        }
      }
    })

    // Check heading hierarchy
    this.checkHeadingHierarchy(audits)

    // Check landmarks
    this.checkLandmarks(audits)

    if (this.config.debug) {
      console.group('Accessibility Audit Results')
      console.log(`Found ${audits.length} issues:`)
      audits.forEach(audit => {
        console.log(`${audit.severity.toUpperCase()}: ${audit.message}`, audit.element)
      })
      console.groupEnd()
    }

    return audits
  }

  private checkHeadingHierarchy(audits: AccessibilityAudit[]): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1))
      
      if (previousLevel > 0 && level > previousLevel + 1) {
        audits.push({
          element: heading as HTMLElement,
          rule: 'heading-hierarchy',
          severity: 'warning',
          message: `Heading level skipped (h${previousLevel} to h${level})`,
          wcagLevel: 'AA',
          wcagCriterion: '1.3.1',
          suggestion: 'Use headings in logical order without skipping levels',
          autoFixable: false
        })
      }
      
      previousLevel = level
    })
  }

  private checkLandmarks(audits: AccessibilityAudit[]): void {
    const main = document.querySelector('main, [role="main"]')
    if (!main) {
      audits.push({
        element: document.body,
        rule: 'landmarks',
        severity: 'warning',
        message: 'Page is missing main landmark',
        wcagLevel: 'AA',
        wcagCriterion: '1.3.6',
        suggestion: 'Add <main> element or role="main"',
        autoFixable: true
      })
    }
  }

  // Generate accessibility report
  public generateAccessibilityReport(): {
    score: number
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
    audits: AccessibilityAudit[]
    summary: {
      errors: number
      warnings: number
      info: number
    }
    recommendations: string[]
  } {
    const audits = this.auditPage()
    
    const summary = {
      errors: audits.filter(a => a.severity === 'error').length,
      warnings: audits.filter(a => a.severity === 'warning').length,
      info: audits.filter(a => a.severity === 'info').length
    }

    // Calculate score
    let score = 100
    score -= summary.errors * 15
    score -= summary.warnings * 5
    score -= summary.info * 1
    score = Math.max(0, score)

    // Assign grade
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
    if (score >= 95) grade = 'A+'
    else if (score >= 90) grade = 'A'
    else if (score >= 80) grade = 'B'
    else if (score >= 70) grade = 'C'
    else if (score >= 60) grade = 'D'
    else grade = 'F'

    // Generate recommendations
    const recommendations: string[] = []
    
    if (summary.errors > 0) {
      recommendations.push('Fix critical accessibility errors immediately')
    }
    
    if (summary.warnings > 0) {
      recommendations.push('Address accessibility warnings for better compliance')
    }

    const commonIssues = audits.reduce((acc, audit) => {
      acc[audit.rule] = (acc[audit.rule] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(commonIssues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .forEach(([rule]) => {
        switch (rule) {
          case 'alt-text':
            recommendations.push('Add alt text to all images')
            break
          case 'color-contrast':
            recommendations.push('Improve color contrast ratios')
            break
          case 'form-label':
            recommendations.push('Ensure all form controls have labels')
            break
        }
      })

    return { score, grade, audits, summary, recommendations }
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.focusStack = []
    this.currentDialog = null
    
    if (this.skipLinkContainer) {
      this.skipLinkContainer.remove()
    }
  }
}

// Singleton instance
let wcagCompliance: WCAGCompliance | null = null

export function getWCAGCompliance(config?: AccessibilityConfig): WCAGCompliance {
  if (!wcagCompliance && typeof window !== 'undefined') {
    wcagCompliance = new WCAGCompliance(config)
  }
  return wcagCompliance!
}

export function initAccessibility(config?: AccessibilityConfig): WCAGCompliance {
  return getWCAGCompliance(config)
}

// Utility functions
export function checkColorContrast(element: HTMLElement): ColorContrastResult {
  const compliance = getWCAGCompliance()
  return compliance.checkColorContrast(element)
}

export function announceToScreenReader(message: string, priority?: 'polite' | 'assertive'): void {
  const compliance = getWCAGCompliance()
  compliance.announceToScreenReader(message, priority)
}

export function auditPageAccessibility(): AccessibilityAudit[] {
  const compliance = getWCAGCompliance()
  return compliance.auditPage()
}

export default WCAGCompliance