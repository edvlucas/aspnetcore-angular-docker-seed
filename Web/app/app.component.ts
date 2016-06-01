import { Component } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Routes } from '@angular/router';

import { OAuthService } from 'angular2-oauth2/oauth-service';

import { HomeComponent } from './main/home.component';
import { SecureComponent } from './secure/secure.component';

var oidc = require('oidc-client');

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

  constructor(private oauthService: OAuthService) { //private api: ApiService) {

    console.log('App initializing');
    console.log(oidc);
    
    oidc.Log.logger = console;
    oidc.Log.level = oidc.Log.INFO;

    var settings = {
      authority: '/',
      client_id: 'js_oidc',
      redirect_uri: window.location.protocol + "//" + window.location.host + "?login",
      post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "?logout",
      response_type: 'id_token token',
      scope: 'openid email roles',
      filterProtocolClaims: true,
      loadUserInfo: true
    };
    this.client = new oidc.OidcClient(settings);
    

    console.log('Checking if this is a login callback');
    if (window.location.href.indexOf("?login") >= 0) {
      this.processSigninResponse();
    }
    else if (window.location.href.indexOf("?logout") >= 0) {
        // processSignoutResponse();
    }
  }

  public login() {
    //this.oauthService.initImplicitFlow();
    this.client.createSigninRequest({ data: { bar: 15 } }).then(function (req) {
      console.log("signin request", req, "<a href='" + req.url + "'>go signin</a>");
      window.location = req.url;
    }).catch(function (err) {
      console.log(err);
    });
  }

  private signinResponse;
  processSigninResponse() {
    debugger;
    this.client.processSigninResponse().then(function (response) {
      this.signinResponse = response;
      console.log("signin response", this.signinResponse);
    }).catch(function (err) {
      console.log(err);
    });
  }
}