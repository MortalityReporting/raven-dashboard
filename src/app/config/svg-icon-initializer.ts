import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Initializer function to register custom SVG icons with MatIconRegistry.
 * This runs during application bootstrap via provideAppInitializer.
 *
 * @param matIconRegistry - The Material icon registry service
 * @param domSanitizer - The DOM sanitizer service
 */
export function initializeSvgIcons(
  matIconRegistry: MatIconRegistry,
  domSanitizer: DomSanitizer
): void {
  // Use absolute path from root to ensure it works in both dev and production
  const path = '/assets/files/svg';

  const icons = [
    'menu',
    'home',
    'event_admin',
    'event_register',
    'testing_event',
    'record-viewer',
    'record-import',
    'record-comparison',
    'fhir-validator',
    'workflow-simulator',
    'admin_panel'
  ];

  icons.forEach(iconName => {
    const iconUrl = `${path}/${iconName}.svg`;
    matIconRegistry.addSvgIcon(
      iconName,
      domSanitizer.bypassSecurityTrustResourceUrl(iconUrl)
    );
  });
}
