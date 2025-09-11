// Accessibility module exports

// WCAG Compliance
export {
  WCAGCompliance,
  getWCAGCompliance,
  initAccessibility,
  checkColorContrast,
  announceToScreenReader,
  auditPageAccessibility,
  type AccessibilityConfig,
  type AccessibilityAudit,
  type ColorContrastResult,
  type FocusManagementOptions
} from './wcag-compliance';

// Keyboard Navigation
export {
  KeyboardNavigation,
  getKeyboardNavigation,
  initKeyboardNavigation,
  registerNavigationGroup,
  focusElement,
  trapFocus,
  releaseFocus,
  type KeyboardNavigationConfig,
  type NavigationGroup,
  type FocusableElement
} from './keyboard-navigation';

// Comprehensive accessibility initialization
export function initializeAccessibility(config: {
  wcag?: import('./wcag-compliance').AccessibilityConfig
  keyboard?: import('./keyboard-navigation').KeyboardNavigationConfig
  autoStart?: boolean
} = {}) {
  if (typeof window === 'undefined') {
    // Server-side: return null implementations
    return {
      wcagCompliance: null,
      keyboardNavigation: null,
      isInitialized: false
    };
  }

  const { autoStart = true } = config;

  let wcagCompliance: import('./wcag-compliance').WCAGCompliance | null = null;
  let keyboardNavigation: import('./keyboard-navigation').KeyboardNavigation | null = null;

  if (autoStart) {
    const { initAccessibility } = require('./wcag-compliance');
    const { initKeyboardNavigation } = require('./keyboard-navigation');

    wcagCompliance = initAccessibility(config.wcag);
    keyboardNavigation = initKeyboardNavigation(config.keyboard);

    // Cross-system integration
    setupAccessibilityIntegration(wcagCompliance, keyboardNavigation);
  }

  return {
    wcagCompliance,
    keyboardNavigation,
    isInitialized: autoStart
  };
}

function setupAccessibilityIntegration(
  wcag: import('./wcag-compliance').WCAGCompliance | null,
  keyboard: import('./keyboard-navigation').KeyboardNavigation | null
) {
  if (!wcag || !keyboard) return;

  // Integration logic could be added here
  // For example: coordinate focus management with WCAG announcements

  if (process.env.NODE_ENV === 'development') {
    console.log('Accessibility systems integrated');
  }
}

// Accessibility utilities
export const AccessibilityUtils = {
  // Check if element is visible to screen readers
  isElementVisible: (element: HTMLElement): boolean => {
    const style = window.getComputedStyle(element);

    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      style.opacity === '0' ||
      element.hasAttribute('hidden') ||
      element.getAttribute('aria-hidden') === 'true'
    );
  },

  // Get accessible name for an element
  getAccessibleName: (element: HTMLElement): string => {
    // Check aria-label
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel.trim();

    // Check aria-labelledby
    const ariaLabelledby = element.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
      const labelElements = ariaLabelledby.split(' ')
        .map(id => document.getElementById(id))
        .filter(Boolean);

      if (labelElements.length > 0) {
        return labelElements.map(el => el!.textContent?.trim()).join(' ');
      }
    }

    // Check title attribute
    const title = element.title;
    if (title) return title.trim();

    // For form controls, check associated label
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label && label.textContent) {
        return label.textContent.trim();
      }
    }

    // Check text content
    const textContent = element.textContent?.trim();
    if (textContent) return textContent;

    // For images, check alt text
    if (element.tagName === 'IMG') {
      return (element as HTMLImageElement).alt;
    }

    return '';
  },

  // Check if element has accessible name
  hasAccessibleName: (element: HTMLElement): boolean => {
    return AccessibilityUtils.getAccessibleName(element).length > 0;
  },

  // Get role of element (explicit or implicit)
  getElementRole: (element: HTMLElement): string => {
    // Check explicit role
    const explicitRole = element.getAttribute('role');
    if (explicitRole) return explicitRole;

    // Determine implicit role based on tag
    const tagName = element.tagName.toLowerCase();
    const implicitRoles: Record<string, string> = {
      'a': element.hasAttribute('href') ? 'link' : 'generic',
      'button': 'button',
      'input': getInputRole(element as HTMLInputElement),
      'select': 'combobox',
      'textarea': 'textbox',
      'h1': 'heading',
      'h2': 'heading',
      'h3': 'heading',
      'h4': 'heading',
      'h5': 'heading',
      'h6': 'heading',
      'main': 'main',
      'nav': 'navigation',
      'header': 'banner',
      'footer': 'contentinfo',
      'section': 'region',
      'article': 'article',
      'aside': 'complementary',
      'ul': 'list',
      'ol': 'list',
      'li': 'listitem',
      'table': 'table',
      'img': element.getAttribute('alt') === '' ? 'presentation' : 'img'
    };

    return implicitRoles[tagName] || 'generic';
  },

  // Check if element is focusable
  isFocusable: (element: HTMLElement): boolean => {
    // Check if element is disabled
    if (element.hasAttribute('disabled') ||
        element.getAttribute('aria-disabled') === 'true') {
      return false;
    }

    // Check if element is visible
    if (!AccessibilityUtils.isElementVisible(element)) {
      return false;
    }

    // Check tabindex
    const tabIndex = element.tabIndex;
    if (tabIndex < 0) return false;

    // Check if element is naturally focusable
    const tagName = element.tagName.toLowerCase();
    const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];

    if (focusableTags.includes(tagName)) {
      // Special case for links - they need href to be focusable
      if (tagName === 'a') {
        return element.hasAttribute('href');
      }
      return true;
    }

    // Check if element has tabindex or interactive role
    return tabIndex >= 0 || element.hasAttribute('role');
  },

  // Create screen reader only text
  createSROnlyElement: (text: string): HTMLElement => {
    const element = document.createElement('span');
    element.textContent = text;
    element.className = 'sr-only';

    // Ensure styles are applied
    element.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;

    return element;
  },

  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const regionId = priority === 'assertive' ? 'aria-live-assertive' : 'aria-live-polite';
    let region = document.getElementById(regionId);

    if (!region) {
      region = document.createElement('div');
      region.id = regionId;
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }

    region.textContent = message;

    // Clear after announcement
    setTimeout(() => {
      region!.textContent = '';
    }, 1000);
  },

  // Check color contrast
  checkContrast: (foreground: string, background: string): {
    ratio: number
    aaCompliant: boolean
    aaaCompliant: boolean
  } => {
    const fgLuminance = AccessibilityUtils.getRelativeLuminance(foreground);
    const bgLuminance = AccessibilityUtils.getRelativeLuminance(background);

    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);

    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      ratio,
      aaCompliant: ratio >= 4.5,
      aaaCompliant: ratio >= 7
    };
  },

  // Calculate relative luminance
  getRelativeLuminance: (color: string): number => {
    const rgb = AccessibilityUtils.colorToRGB(color);

    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  // Convert color to RGB
  colorToRGB: (color: string): { r: number; g: number; b: number } => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return { r, g, b };
  },

  // Validate heading hierarchy
  validateHeadingHierarchy: (): Array<{
    element: HTMLHeadingElement
    level: number
    issue: string
  }> => {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLHeadingElement[];
    const issues: Array<{ element: HTMLHeadingElement; level: number; issue: string }> = [];

    let previousLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));

      if (previousLevel === 0 && level !== 1) {
        issues.push({
          element: heading,
          level,
          issue: 'Page should start with h1'
        });
      } else if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push({
          element: heading,
          level,
          issue: `Heading level skipped (h${previousLevel} to h${level})`
        });
      }

      previousLevel = level;
    });

    return issues;
  },

  // Check for missing alt text
  findImagesWithoutAlt: (): HTMLImageElement[] => {
    const images = Array.from(document.querySelectorAll('img')) as HTMLImageElement[];
    return images.filter(img => !img.hasAttribute('alt'));
  },

  // Check for form controls without labels
  findUnlabeledFormControls: (): HTMLElement[] => {
    const controls = Array.from(document.querySelectorAll('input, select, textarea')) as HTMLElement[];

    return controls.filter(control => {
      if (!control.id) return true;

      const hasLabel = document.querySelector(`label[for="${control.id}"]`) !== null;
      const hasAriaLabel = control.hasAttribute('aria-label');
      const hasAriaLabelledby = control.hasAttribute('aria-labelledby');

      return !hasLabel && !hasAriaLabel && !hasAriaLabelledby;
    });
  }
};

// Helper function for input roles
function getInputRole(input: HTMLInputElement): string {
  const type = input.type.toLowerCase();

  const typeRoleMap: Record<string, string> = {
    'button': 'button',
    'submit': 'button',
    'reset': 'button',
    'checkbox': 'checkbox',
    'radio': 'radio',
    'range': 'slider',
    'email': 'textbox',
    'password': 'textbox',
    'search': 'searchbox',
    'tel': 'textbox',
    'text': 'textbox',
    'url': 'textbox'
  };

  return typeRoleMap[type] || 'textbox';
}

// Accessibility testing utilities
export const AccessibilityTesting = {
  // Run basic accessibility audit
  auditPage: async (): Promise<{
    score: number
    issues: Array<{
      type: string
      severity: 'error' | 'warning' | 'info'
      message: string
      element?: HTMLElement
    }>
    recommendations: string[]
  }> => {
    const issues: Array<{
      type: string
      severity: 'error' | 'warning' | 'info'
      message: string
      element?: HTMLElement
    }> = [];

    // Check for missing alt text
    const imagesWithoutAlt = AccessibilityUtils.findImagesWithoutAlt();
    imagesWithoutAlt.forEach(img => {
      issues.push({
        type: 'missing-alt-text',
        severity: 'error',
        message: 'Image missing alt attribute',
        element: img
      });
    });

    // Check for unlabeled form controls
    const unlabeledControls = AccessibilityUtils.findUnlabeledFormControls();
    unlabeledControls.forEach(control => {
      issues.push({
        type: 'missing-label',
        severity: 'error',
        message: 'Form control missing label',
        element: control
      });
    });

    // Check heading hierarchy
    const headingIssues = AccessibilityUtils.validateHeadingHierarchy();
    headingIssues.forEach(({ element, issue }) => {
      issues.push({
        type: 'heading-hierarchy',
        severity: 'warning',
        message: issue,
        element
      });
    });

    // Check for missing landmarks
    const hasMain = document.querySelector('main, [role="main"]') !== null;
    if (!hasMain) {
      issues.push({
        type: 'missing-landmark',
        severity: 'warning',
        message: 'Page missing main landmark'
      });
    }

    // Calculate score
    const errorCount = issues.filter(issue => issue.severity === 'error').length;
    const warningCount = issues.filter(issue => issue.severity === 'warning').length;
    const score = Math.max(0, 100 - (errorCount * 15) - (warningCount * 5));

    // Generate recommendations
    const recommendations: string[] = [];
    if (imagesWithoutAlt.length > 0) {
      recommendations.push('Add alt text to all images');
    }
    if (unlabeledControls.length > 0) {
      recommendations.push('Add labels to all form controls');
    }
    if (headingIssues.length > 0) {
      recommendations.push('Fix heading hierarchy');
    }
    if (!hasMain) {
      recommendations.push('Add main landmark to page');
    }

    return { score, issues, recommendations };
  },

  // Test keyboard navigation
  testKeyboardNavigation: (): Promise<{
    focusableElements: HTMLElement[]
    tabOrder: HTMLElement[]
    issues: string[]
  }> => {
    return new Promise((resolve) => {
      const focusableElements = Array.from(document.querySelectorAll(`
        a[href],
        button:not([disabled]),
        input:not([disabled]):not([type="hidden"]),
        select:not([disabled]),
        textarea:not([disabled]),
        [tabindex]:not([tabindex="-1"])
      `)) as HTMLElement[];

      const tabOrder: HTMLElement[] = [];
      const issues: string[] = [];

      let currentIndex = 0;

      const testNext = () => {
        if (currentIndex >= focusableElements.length) {
          resolve({ focusableElements, tabOrder, issues });
          return;
        }

        const element = focusableElements[currentIndex];
        element.focus();

        // Check if element is actually focused
        if (document.activeElement === element) {
          tabOrder.push(element);
        } else {
          issues.push(`Element cannot receive focus: ${element.tagName}`);
        }

        currentIndex++;
        setTimeout(testNext, 10); // Small delay to allow focus to settle
      };

      testNext();
    });
  }
};

// Accessibility constants and guidelines
export const WCAG_GUIDELINES = {
  // WCAG 2.1 Success Criteria
  LEVEL_A: [
    '1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.3.2', '1.3.3',
    '1.4.1', '1.4.2', '2.1.1', '2.1.2', '2.1.4', '2.2.1', '2.2.2',
    '2.3.1', '2.4.1', '2.4.2', '2.4.3', '2.4.4', '3.1.1', '3.2.1',
    '3.2.2', '3.3.1', '3.3.2', '4.1.1', '4.1.2'
  ],

  LEVEL_AA: [
    '1.2.4', '1.2.5', '1.4.3', '1.4.4', '1.4.5', '2.4.5', '2.4.6',
    '2.4.7', '3.1.2', '3.2.3', '3.2.4', '3.3.3', '3.3.4'
  ],

  LEVEL_AAA: [
    '1.2.6', '1.2.7', '1.2.8', '1.2.9', '1.4.6', '1.4.7', '1.4.8',
    '1.4.9', '2.1.3', '2.2.3', '2.2.4', '2.2.5', '2.3.2', '2.4.8',
    '2.4.9', '2.4.10', '3.1.3', '3.1.4', '3.1.5', '3.1.6', '3.2.5',
    '3.3.5', '3.3.6'
  ],

  // Color contrast ratios
  CONTRAST_RATIOS: {
    AA_NORMAL: 4.5,
    AA_LARGE: 3,
    AAA_NORMAL: 7,
    AAA_LARGE: 4.5
  },

  // Recommended practices
  BEST_PRACTICES: [
    'Use semantic HTML elements',
    'Provide alternative text for images',
    'Ensure sufficient color contrast',
    'Make all functionality keyboard accessible',
    'Use headings to organize content',
    'Provide labels for form controls',
    'Use ARIA attributes appropriately',
    'Test with screen readers',
    'Follow consistent navigation patterns',
    'Provide skip links for keyboard users'
  ]
} as const;

export default {
  initializeAccessibility,
  AccessibilityUtils,
  AccessibilityTesting,
  WCAG_GUIDELINES
};
