import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('@components/home').then(m => m.HomeComponent)
    },
    {
        path: 'upload',
        loadComponent: () =>
            import('@components/upload').then(m => m.UploadComponent)
    }, 
    {
        path: 'workspace',
        loadComponent: () =>
            import('@components/workspace').then(m => m.WorkspaceComponent)
    }
];
