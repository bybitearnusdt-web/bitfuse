// Mobile navigation utilities for accessibility and focus management

export class MobileNavigation {
  private static focusableElements = [
    'button',
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ];

  /**
   * Trap focus within a container element
   */
  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      this.focusableElements.join(',')
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus the first element initially
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  /**
   * Handle ESC key to close drawer
   */
  static handleEscapeKey(callback: () => void): () => void {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }

  /**
   * Prevent body scroll when drawer is open
   */
  static preventBodyScroll(prevent: boolean): void {
    if (prevent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Set up ARIA attributes for mobile drawer
   */
  static setupDrawerAria(
    button: HTMLElement,
    drawer: HTMLElement,
    isOpen: boolean
  ): void {
    const drawerId = drawer.id || 'mobile-drawer';
    drawer.id = drawerId;
    
    button.setAttribute('aria-controls', drawerId);
    button.setAttribute('aria-expanded', isOpen.toString());
    button.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', 'Navigation menu');
  }
}