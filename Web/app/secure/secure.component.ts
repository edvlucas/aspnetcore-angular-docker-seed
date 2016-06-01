import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular2-oauth2/oauth-service';

@Component({
    moduleId: module.id,
    template: require('./secure.component.html')
})
export class SecureComponent implements OnInit {
    constructor(private oauthService: OAuthService) {
        var at = this.oauthService.getAccessToken();
        console.log(at);

        var it = this.oauthService.getIdToken();
        console.log(it);

        var c = this.oauthService.getIdentityClaims();
        console.log(c);

    }

    ngOnInit() {

    }
}