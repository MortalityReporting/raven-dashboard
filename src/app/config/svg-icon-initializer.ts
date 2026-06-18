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
  const path = 'assets/files/svg';

  const icons = [
    'menu',
    'home',
    'chevron_right',
    'event_admin',
    'event_register',
    'testing_event',
    'arrow_down',
    'record-viewer',
    'record-import',
    'record-comparison',
    'fhir-validator',
    'workflow-simulator',
    'admin_panel'
  ];

  icons.forEach(iconName => {
    matIconRegistry.addSvgIcon(
      iconName,
      domSanitizer.bypassSecurityTrustResourceUrl(`${path}/${iconName}.svg`)
    );
  });
}
