import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface SelectedComponent {
  nombre: string;
  ruta: string;
  categoria: string;
  tipo: string;
  selectionId: number;
  descripcion?: string;
  propiedades?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectGeneratorService {
  constructor() {}

  async generateAngularProject(components: SelectedComponent[], projectName: string = 'generated-angular-app'): Promise<void> {
    try {
      if (!components || components.length === 0) {
        throw new Error('No components provided for project generation');
      }

      const zip = new JSZip();
      
      // Create basic Angular project structure
      this.createProjectStructure(zip, projectName);
      
      // Generate components
      this.generateComponents(zip, components);
      
      // Generate routing
      this.generateRouting(zip, components);
      
      // Generate app.module.ts with imports
      this.generateAppModule(zip, components);
      
      // Generate package.json
      this.generatePackageJson(zip, projectName);
      
      // Generate the ZIP file and download
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${projectName}.zip`);
    } catch (error) {
      console.error('Error generating Angular project:', error);
      throw error;
    }
  }

  private createProjectStructure(zip: JSZip, projectName: string): void {
    // Create basic folder structure
    const srcFolder = zip.folder('src');
    const appFolder = srcFolder?.folder('app');
    const assetsFolder = srcFolder?.folder('assets');
    
    // Create angular.json
    zip.file('angular.json', this.getAngularJsonTemplate(projectName));
    
    // Create tsconfig.json and tsconfig.app.json
    zip.file('tsconfig.json', this.getTsConfigTemplate());
    zip.file('tsconfig.app.json', this.getTsConfigAppTemplate());
    
    // Create main.ts (standalone application)
    srcFolder?.file('main.ts', this.getMainTsTemplate());
    
    // Create index.html
    srcFolder?.file('index.html', this.getIndexHtmlTemplate(projectName));
    
    // Create styles.css
    srcFolder?.file('styles.css', this.getGlobalStylesTemplate());
    
    // Create favicon.ico (placeholder)
    srcFolder?.file('favicon.ico', '');
    
    // Create README.md
    zip.file('README.md', this.getReadmeTemplate(projectName));
  }

  private getIndexHtmlTemplate(projectName: string): string {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${this.pascalCase(projectName)}</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`;
  }

  private getGlobalStylesTemplate(): string {
    return `/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f5f5f5;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #1976d2;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-links {
  margin-top: 0.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.component-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.component-title {
  color: #1976d2;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.component-description {
  color: #666;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .component-container {
    padding: 1rem;
  }
}`;
  }

  private generateComponents(zip: JSZip, components: SelectedComponent[]): void {
    const appFolder = zip.folder('src')?.folder('app');
    
    components.forEach(component => {
      this.generateAngularArtifact(appFolder ?? null, component);
    });
  }

  private generateAngularArtifact(appFolder: JSZip | null, component: SelectedComponent): void {
    const itemPath = this.getItemPath(component.ruta, component.categoria);
    const itemFolder = this.createNestedFolder(appFolder ?? null, itemPath);
    const itemName = this.getItemName(component.ruta, component.categoria);
    const className = this.pascalCase(itemName);

    switch (component.categoria.toLowerCase()) {
      case 'componentes de ui':
        this.generateComponent(itemFolder, itemName, className, component);
        break;
      case 'servicios':
        this.generateService(itemFolder, itemName, className, component);
        break;
      case 'guards':
        this.generateGuard(itemFolder, itemName, className, component);
        break;
      case 'modelos':
        this.generateModel(itemFolder, itemName, className, component);
        break;
      default:
        // Default to component if category is unknown
        this.generateComponent(itemFolder, itemName, className, component);
        break;
    }
  }

  private generateComponent(folder: JSZip | null, itemName: string, className: string, component: SelectedComponent): void {
    // Component TypeScript file (standalone)
    folder?.file(`${itemName}.component.ts`, 
      this.getStandaloneComponentTsTemplate(className, itemName, component));
    
    // Component HTML file
    folder?.file(`${itemName}.component.html`, 
      this.getComponentHtmlTemplate(component));
    
    // Component CSS file
    folder?.file(`${itemName}.component.css`, 
      this.getComponentCssTemplate());
  }

  private generateService(folder: JSZip | null, itemName: string, className: string, component: SelectedComponent): void {
    folder?.file(`${itemName}.service.ts`, 
      this.getServiceTemplate(className, itemName, component));
  }

  private generateGuard(folder: JSZip | null, itemName: string, className: string, component: SelectedComponent): void {
    folder?.file(`${itemName}.guard.ts`, 
      this.getGuardTemplate(className, itemName, component));
  }

  private generateModel(folder: JSZip | null, itemName: string, className: string, component: SelectedComponent): void {
    folder?.file(`${itemName}.model.ts`, 
      this.getModelTemplate(className, itemName, component));
  }

  private generateRouting(zip: JSZip, components: SelectedComponent[]): void {
    const appFolder = zip.folder('src')?.folder('app');
    
    // Generate app.routes.ts (new routing approach)
    appFolder?.file('app.routes.ts', this.getRoutesTemplate(components));
  }

  private generateAppModule(zip: JSZip, components: SelectedComponent[]): void {
    const appFolder = zip.folder('src')?.folder('app');
    
    // Generate app.component.ts (standalone)
    appFolder?.file('app.component.ts', this.getStandaloneAppComponentTsTemplate());
    
    // Generate app.component.html
    appFolder?.file('app.component.html', this.getAppComponentHtmlTemplate());
    
    // Generate app.component.css
    appFolder?.file('app.component.css', this.getAppComponentCssTemplate());
    
    // Generate app.config.ts (new configuration approach)
    appFolder?.file('app.config.ts', this.getAppConfigTemplate());
  }

  private generatePackageJson(zip: JSZip, projectName: string): void {
    zip.file('package.json', this.getPackageJsonTemplate(projectName));
  }

  private getComponentHtmlTemplate(component: SelectedComponent): string {
    return `<div class="component-container">
  
  <div class="component-content">
    <p>Este es el componente <strong>${component.nombre}</strong> de la categoría <em>${component.categoria}</em>.</p>
    <p>Tipo: <span class="badge">${component.tipo}</span></p>
  </div>
</div>`;
  }

  private getComponentCssTemplate(): string {
    return ``;
  }

  private getAppComponentCssTemplate(): string {
    return `.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.nav-links {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.nav-links a:hover,
.nav-links a.active {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar h1 {
    font-size: 1.5rem;
  }
  
  .nav-links {
    margin-top: 0.5rem;
  }
  
  .nav-links a {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}`;
  }

  private getAngularJsonTemplate(projectName: string): string {
    return `{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "${projectName}": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "css",
          "standalone": true
        },
        "@schematics/angular:directive": {
          "standalone": true
        },
        "@schematics/angular:pipe": {
          "standalone": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/${projectName}",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "${projectName}:build:production"
            },
            "development": {
              "buildTarget": "${projectName}:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}`;
  }

  private getTsConfigAppTemplate(): string {
    return `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}`;
  }

  private getTsConfigTemplate(): string {
    return `{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}`;
  }

  private getMainTsTemplate(): string {
    return `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`;
  }

  private getStandaloneComponentTsTemplate(className: string, componentName: string, component: SelectedComponent): string {
    return `import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${componentName}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${componentName}.component.html',
  styleUrl: './${componentName}.component.css'
})
export class ${className}Component implements OnInit {
  // Component properties
  title = '${component.nombre}';
  description = '${component.descripcion || 'Generated component'}';

  constructor() { }

  ngOnInit(): void {
    console.log('${className}Component initialized');
  }

  onAction(): void {
    console.log('Primary action executed in ${className}Component');
    // Add your primary action logic here
  }

  onSecondaryAction(): void {
    console.log('Secondary action executed in ${className}Component');
    // Add your secondary action logic here
  }
}`;
  }

  private getServiceTemplate(className: string, serviceName: string, component: SelectedComponent): string {
    return `import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${className}Service {

  constructor() { }

  // Service methods for ${component.nombre}
  getData(): Observable<any[]> {
    // TODO: Implement actual data fetching logic
    console.log('${className}Service: getData called');
    return of([]);
  }

  getById(id: string | number): Observable<any> {
    // TODO: Implement get by id logic
    console.log('${className}Service: getById called with id:', id);
    return of({});
  }

  create(data: any): Observable<any> {
    // TODO: Implement create logic
    console.log('${className}Service: create called with data:', data);
    return of(data);
  }

  update(id: string | number, data: any): Observable<any> {
    // TODO: Implement update logic
    console.log('${className}Service: update called with id:', id, 'data:', data);
    return of(data);
  }

  delete(id: string | number): Observable<boolean> {
    // TODO: Implement delete logic
    console.log('${className}Service: delete called with id:', id);
    return of(true);
  }

  ${component.propiedades && component.propiedades.length > 0 ? 
    `// Custom methods based on properties
  ${component.propiedades.map(prop => 
    `// Property: ${JSON.stringify(prop)}`
  ).join('\n  ')}` : ''}
}`;
  }

  private getGuardTemplate(className: string, guardName: string, component: SelectedComponent): string {
    return `import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ${className}Guard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    console.log('${className}Guard: Checking access for route:', state.url);
    
    // TODO: Implement your guard logic here
    // Example: Check if user is authenticated, has permissions, etc.
    
    const hasAccess = this.checkAccess(route, state);
    
    if (!hasAccess) {
      console.log('${className}Guard: Access denied, redirecting...');
      // Redirect to login or unauthorized page
      this.router.navigate(['/login']);
      return false;
    }
    
    console.log('${className}Guard: Access granted');
    return true;
  }

  private checkAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // TODO: Implement your access checking logic
    // This could check:
    // - User authentication status
    // - User roles/permissions
    // - Route parameters
    // - Application state
    
    // For now, return true (allow access)
    // Replace with actual logic
    return true;
  }

  ${component.propiedades && component.propiedades.length > 0 ? 
    `// Guard configuration based on properties
  ${component.propiedades.map(prop => 
    `// Property: ${JSON.stringify(prop)}`
  ).join('\n  ')}` : ''}
}`;
  }

  private getModelTemplate(className: string, modelName: string, component: SelectedComponent): string {
    const properties = component.propiedades && component.propiedades.length > 0 
      ? component.propiedades.map(prop => {
          if (typeof prop === 'object' && prop.nombre && prop.tipo) {
            return `  ${prop.nombre}${prop.requerido === false ? '?' : ''}: ${this.mapTypeToTypescript(prop.tipo)};`;
          }
          return `  // Property: ${JSON.stringify(prop)}`;
        }).join('\n')
      : `  id: string | number;
  name: string;
  createdAt: Date;
  updatedAt: Date;`;

    return `// Model/Interface for ${component.nombre}
export interface ${className} {
${properties}
}

// Optional: Export as class if you need methods
export class ${className}Model implements ${className} {
${properties}

  constructor(data: Partial<${className}> = {}) {
    Object.assign(this, data);
  }

  // Add any model-specific methods here
  toString(): string {
    return JSON.stringify(this);
  }

  isValid(): boolean {
    // TODO: Implement validation logic
    return true;
  }
}

// Optional: Type guards
export function is${className}(obj: any): obj is ${className} {
  return obj && typeof obj === 'object';
}

// Optional: Default/empty instance
export const default${className}: ${className} = {} as ${className};`;
  }

  private mapTypeToTypescript(type: string): string {
    switch (type?.toLowerCase()) {
      case 'string':
      case 'text':
        return 'string';
      case 'number':
      case 'int':
      case 'integer':
      case 'float':
      case 'double':
        return 'number';
      case 'boolean':
      case 'bool':
        return 'boolean';
      case 'date':
      case 'datetime':
        return 'Date';
      case 'array':
        return 'any[]';
      case 'object':
        return 'any';
      default:
        return 'any';
    }
  }

  private getRoutesTemplate(components: SelectedComponent[]): string {
    // Only include components that are actual UI components in routes
    const uiComponents = components.filter(comp => 
      comp.categoria.toLowerCase() === 'components' || 
      comp.categoria.toLowerCase() === 'component'
    );

    if (uiComponents.length === 0) {
      return `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];`;
    }

    const imports = uiComponents.map(comp => {
      const className = this.pascalCase(this.getItemName(comp.ruta, comp.categoria));
      const path = this.getItemPath(comp.ruta, comp.categoria) + '/' + this.getItemName(comp.ruta, comp.categoria) + '.component';
      return `import { ${className}Component } from './${path}';`;
    }).join('\n');

    const routes = uiComponents.map(comp => {
      const className = this.pascalCase(this.getItemName(comp.ruta, comp.categoria));
      const routePath = this.kebabCase(this.getItemName(comp.ruta, comp.categoria));
      return `  { path: '${routePath}', component: ${className}Component }`;
    }).join(',\n');

    return `import { Routes } from '@angular/router';
${imports}

export const routes: Routes = [
${routes},
  { path: '', redirectTo: '/${this.kebabCase(this.getItemName(uiComponents[0]?.ruta || 'home', uiComponents[0]?.categoria || 'component'))}', pathMatch: 'full' },
  { path: '**', redirectTo: '/${this.kebabCase(this.getItemName(uiComponents[0]?.ruta || 'home', uiComponents[0]?.categoria || 'component'))}' }
];`;
  }

  private getStandaloneAppComponentTsTemplate(): string {
    return `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Generated Angular App';
}`;
  }

  private getAppConfigTemplate(): string {
    return `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};`;
  }

  private getAppComponentHtmlTemplate(): string {
    return `<div class="app-container">
  <nav class="navbar">
    <h1>{{ title }}</h1>
    <div class="nav-links">
      <!-- Navigation will be automatically generated based on routes -->
    </div>
  </nav>
  <main class="main-content">
    <router-outlet></router-outlet>
  </main>
</div>`;
  }

  private getPackageJsonTemplate(projectName: string): string {
    return `{
  "name": "${projectName}",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/platform-browser-dynamic": "^19.0.0",
    "@angular/router": "^19.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.0.0",
    "@angular/cli": "^19.0.0",
    "@angular/compiler-cli": "^19.0.0",
    "@types/jasmine": "~5.1.0",
    "@types/node": "^20.0.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.6.0"
  }
}`;
  }

  private getReadmeTemplate(projectName: string): string {
    return `# ${this.pascalCase(projectName)}

This project was generated with Angular CLI version 19.x.x and uses standalone components.

## Development server

Run \`ng serve\` for a dev server. Navigate to \`http://localhost:4200/\`. The application will automatically reload if you change any of the source files.

## Build

Run \`ng build\` to build the project. The build artifacts will be stored in the \`dist/\` directory.

## Features

- Angular 19+ with standalone components
- Modern routing configuration
- Responsive design
- TypeScript 5.6+

## Generated Components

This project includes the following generated components:
- Multiple components based on your selection
- Automatic routing configuration
- Modern Angular architecture

## Further help

To get more help on the Angular CLI use \`ng help\` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
`;
  }

  private getItemPath(ruta: string, categoria: string): string {
    // Convert "./lib/components/admin/tabla-datos/tabla-datos.component" to appropriate path
    let basePath = ruta.replace(/^\.\/lib\//, '').replace(/\/[^\/]+\.(component|service|guard|model)$/, '');
    
    // Ensure proper folder structure based on category
    switch (categoria.toLowerCase()) {
      case 'services':
      case 'service':
        basePath = basePath.replace(/^components\//, 'services/');
        break;
      case 'guards':
      case 'guard':
        basePath = basePath.replace(/^components\//, 'guards/');
        break;
      case 'models':
      case 'model':
      case 'interfaces':
      case 'interface':
        basePath = basePath.replace(/^components\//, 'models/');
        break;
    }
    
    return basePath;
  }

  private getItemName(ruta: string, categoria: string): string {
    // Extract item name from path
    const parts = ruta.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/\.(component|service|guard|model)$/, '');
  }

  private createNestedFolder(parentFolder: JSZip | null, path: string): JSZip | null {
    if (!parentFolder) return null;
    
    const parts = path.split('/');
    let currentFolder: JSZip | null = parentFolder;
    
    parts.forEach(part => {
      if (part && currentFolder) {
        currentFolder = currentFolder.folder(part);
      }
    });
    
    return currentFolder;
  }

  private pascalCase(str: string): string {
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }
}
