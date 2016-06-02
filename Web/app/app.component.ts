import { Component } from '@angular/core';
import { HTTP_PROVIDERS, Http } from '@angular/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes } from '@angular/router';

import { OAuthService } from 'angular2-oauth2/oauth-service';

import { HomeComponent } from './main/home.component';
import { SecureComponent } from './secure/secure.component';

@Component({
    selector: 'my-app',
    providers: [OAuthService, ROUTER_PROVIDERS],
    directives: [ROUTER_DIRECTIVES],
    template: require('./app.component.html')
    //  styles: [require('./app.component.scss')],
})
@Routes([
    { path: '/', component: HomeComponent },
    { path: '/secure', component: SecureComponent },
])
export class AppComponent {

    private client: any;
    private mgr: any;

    constructor(private oauthService: OAuthService, private http: Http, private router : Router) { //private api: ApiService) {

        router.changes.subscribe(next => {
            console.log('Route changed to');
            console.log(router);
            if (router.urlTree._root.children.length > 0) {
                var segment = router.urlTree._root.children[0].value.segment;
                console.log(segment);
                if (segment == "secure" && !this.name) {
                    this.login();
                }
            }
        });

        console.log('App initializing');
        this.oauthService.loginUrl = window.location.protocol + "//" + window.location.host + "/connect/authorize",
        this.oauthService.redirectUri = window.location.origin + "?login";
        this.oauthService.clientId = "js_oidc";
        this.oauthService.issuer = "http://docker";
        this.oauthService.scope = "openid profile email api1 api2";
        this.oauthService.oidc = true;
        this.oauthService.setStorage(sessionStorage);
        this.oauthService.logoutUrl = "/ui/logout";
        this.oauthService.tryLogin({}
        );

    }

    public login() {
        this.oauthService.initImplicitFlow();
    }

    public logout() {
        this.oauthService.logOut();
    }

    public get name() {
        let claims = this.oauthService.getIdentityClaims();
        if (!claims) return null;
        return claims.given_name;
    }
}