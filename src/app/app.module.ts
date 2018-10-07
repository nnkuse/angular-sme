import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ApplicationErrorHandle } from './app.error-handle';
import { RefreshTokenInterceptor } from './interceptors/refresh-token.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TranslateModule } from '@ngx-translate/core';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppsModule } from './main/apps/apps.module';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from './material.module';
import { MAT_DATE_LOCALE } from '@angular/material';

const appRoutes: Routes = [
    {
        path: 'auth',
        loadChildren: './main/login/login.module#LoginModule'
    },
    {
        path: 'apps',
        loadChildren: './main/apps/apps.module#AppsModule',
    },
    {
        path: 'error',
        loadChildren: './main/not-found/not-found.module#NotFoundModule'
    },
    { 
        path: '', 
        redirectTo: 'apps/sme/lists',
        pathMatch: 'full'
    },
    // {
    //     path: '**',
    //     redirectTo: 'error/404',
    // },
    
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MaterialModule,
        NgxSpinnerModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        AppsModule
        
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
        { provide: ErrorHandler, useClass: ApplicationErrorHandle },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
