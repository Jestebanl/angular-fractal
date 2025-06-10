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
      const componentPath = this.getComponentPath(component.ruta);
      const componentFolder = this.createNestedFolder(appFolder ?? null, componentPath);
      
      // Generate component files
      const componentName = this.getComponentName(component.ruta);
      const className = this.pascalCase(componentName);
      
      // Component TypeScript file (standalone)
      componentFolder?.file(`${componentName}.component.ts`, 
        this.getStandaloneComponentTsTemplate(className, componentName, component));
      
      // Component HTML file
      componentFolder?.file(`${componentName}.component.html`, 
        this.getComponentHtmlTemplate(component));
      
      // Component CSS file
      componentFolder?.file(`${componentName}.component.css`, 
        this.getComponentCssTemplate());
    });
  }

  private getComponentHtmlTemplate(component: SelectedComponent): string {
    return `<div class="component-container">
  <h2 class="component-title">{{ title }}</h2>
  <p class="component-description">{{ description }}</p>
  
  <div class="component-content">
    <p>Este es el componente <strong>${component.nombre}</strong> de la categoría <em>${component.categoria}</em>.</p>
    <p>Tipo: <span class="badge">${component.tipo}</span></p>
    
    ${component.propiedades && component.propiedades.length > 0 ? `
    <div class="properties-section">
      <h3>Propiedades:</h3>
      <ul class="properties-list">
        ${component.propiedades.map(prop => `<li>${JSON.stringify(prop)}</li>`).join('')}
      </ul>
    </div>
    ` : ''}
  </div>
</div>`;
  }

  private getComponentCssTemplate(): string {
    return ``;
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

  private getAppComponentCssTemplate(): string {
    return ``;
  }

  private generatePackageJson(zip: JSZip, projectName: string): void {
    zip.file('package.json', this.getPackageJsonTemplate(projectName));
  }

  private getComponentPath(ruta: string): string {
    // Convert "./lib/components/admin/tabla-datos/tabla-datos.component" to "components/admin/tabla-datos"
    return ruta.replace(/^\.\/lib\//, '').replace(/\/[^\/]+\.component$/, '');
  }

  private getComponentName(ruta: string): string {
    // Extract component name from path
    const parts = ruta.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace('.component', '');
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

  // Updated template methods for Angular 19+
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
}`;
  }

  private getRoutesTemplate(components: SelectedComponent[]): string {
    const imports = components.map(comp => {
      const className = this.pascalCase(this.getComponentName(comp.ruta));
      const path = this.getComponentPath(comp.ruta) + '/' + this.getComponentName(comp.ruta) + '.component';
      return `import { ${className}Component } from './${path}';`;
    }).join('\n');

    const routes = components.map(comp => {
      const className = this.pascalCase(this.getComponentName(comp.ruta));
      const routePath = this.kebabCase(this.getComponentName(comp.ruta));
      return `  { path: '${routePath}', component: ${className}Component }`;
    }).join(',\n');

    return `import { Routes } from '@angular/router';
${imports}

export const routes: Routes = [
${routes},
  { path: '', redirectTo: '/${this.kebabCase(this.getComponentName(components[0]?.ruta || 'home'))}', pathMatch: 'full' },
  { path: '**', redirectTo: '/${this.kebabCase(this.getComponentName(components[0]?.ruta || 'home'))}' }
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
}
