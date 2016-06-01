import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes } from '@angular/router';

import { OAuthService } from 'angular2-oauth2/oauth-service';

import { HomeComponent } from './main/home.component';
import { SecureComponent } from './secure/secure.component';

//var oidc = require('oidc-client');

declare var window: any;

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

    constructor(private oauthService: OAuthService) { //private api: ApiService) {

        console.log('App initializing');
        // console.log(oidc);

        // oidc.Log.logger = console;
        // oidc.Log.level = oidc.Log.INFO;

        // var settings = {
        //   authority: '/',
        //   client_id: 'js_oidc',
        //   redirect_uri: window.location.protocol + "//" + window.location.host + "?login",
        //   post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "?logout",
        //   response_type: 'id_token token',
        //   scope: 'openid email roles',
        //   filterProtocolClaims: true,
        //   loadUserInfo: true
        // };
        // this.client = new oidc.OidcClient(settings);
    

        // console.log('Checking if this is a login callback');
        // if (window.location.href.indexOf("?login") >= 0) {
        //   this.processSigninResponse();
        // }
        // else if (window.location.href.indexOf("?logout") >= 0) {
        //     // processSignoutResponse();
        // }
    
        var config = {
            authority: "/",
            client_id: "js_oidc",
            redirect_uri: window.location.protocol + "//" + window.location.host + "?login",
            post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "?logout",
            // these two will be done dynamically from the buttons clicked, but are
            // needed if you want to use the silent_renew
            response_type: "id_token token",
            scope: "openid profile email api1 api2",
            // this will toggle if profile endpoint is used
            load_user_profile: true,
            // silent renew will get a new access_token via an iframe 
            // just prior to the old access_token expiring (60 seconds prior)
            silent_redirect_uri: window.location.protocol + "//" + window.location.host + "/silent_renew.html",
            silent_renew: false,
            // this will allow all the OIDC protocol claims to be visible in the window. normally a client app 
            // wouldn't care about them or want them taking up space
            filter_protocol_claims: false
        };
        this.mgr = new window.OidcTokenManager(config);
        this.mgr.addOnTokenObtained(function() {
            console.log("token obtained");
        });
        this.mgr.addOnTokenRemoved(function() {
            console.log("token token removed");
            //showTokens();
        });
        // debugger;

        if (window.location.href.indexOf("?login") >= 0) {
            this.mgr.processTokenCallbackAsync().then(function() {
                var hash = window.location.hash.substr(1);
                var result = hash.split('&').reduce(function(result, item) {
                    var parts = item.split('=');
                    result[parts[0]] = parts[1];
                    return result;
                }, {});
                console.log('Login result = ');
                console.log(result);
            }, function(error) {
                console.log('Login error = ');
                console.error(error);
            });
        }
        if (window.location.href.indexOf("?logout") >= 0) {
            this.mgr.removeToken();
        }
    }

    public login() {
        this.mgr.redirectForToken();
    }

    public logout() {
        window.location.href = "/ui/logout";
    }

    // public login() {
    //     //this.oauthService.initImplicitFlow();
    //     this.client.createSigninRequest({ data: { bar: 15 } }).then(function(req) {
    //         console.log("signin request", req, "<a href='" + req.url + "'>go signin</a>");
    //         window.location = req.url;
    //     }).catch(function(err) {
    //         console.log(err);
    //     });
    // }

    private signinResponse;
    processSigninResponse() {
        debugger;
        this.client.processSigninResponse().then(function(response) {
            this.signinResponse = response;
            console.log("signin response", this.signinResponse);
        }).catch(function(err) {
            console.log(err);
        });
    }
}