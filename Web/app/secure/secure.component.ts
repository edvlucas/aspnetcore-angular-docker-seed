import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { OAuthService } from 'angular2-oauth2/oauth-service';

@Component({
    moduleId: module.id,
    template: require('./secure.component.html')
})
export class SecureComponent implements OnInit {
    constructor(private oauthService: OAuthService, private http: Http) {
    }

    public get name() {
        let claims = this.oauthService.getIdentityClaims();
        if (!claims) return null;
        return claims.given_name;
    }

    ngOnInit() {

    }
}