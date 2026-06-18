import { inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Initializer function to register custom SVG icons with MatIconRegistry.
 * This runs during application bootstrap via provideAppInitializer.
 */
export function initializeSvgIcons(): void {
  const matIconRegistry = inject(MatIconRegistry);
  const domSanitizer = inject(DomSanitizer);
  const path = 'assets/files/svg';

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
    matIconRegistry.addSvgIcon(
      iconName,
      domSanitizer.bypassSecurityTrustResourceUrl(`${path}/${iconName}.svg`)
    );
  });
}
