// import { Component, OnInit, Directive, ElementRef, DynamicComponentLoader, Attribute } from '@angular/core';
// import { ROUTER_PROVIDERS, ROUTER_DIRECTIVES, Router, Routes, RouterOutlet } from '@angular/router';

// import { Http } from '@angular/http';

// import { OAuthService } from 'angular2-oauth2/oauth-service';


// @Directive({
//   selector: 'router-outlet'
// })
// export class LoggedInRouterOutlet extends RouterOutlet {
//   publicRoutes: Array<any>;
//   private parentRouter: Router;
// //  private userService: UserService;

//   constructor(
//     _elementRef: ElementRef, _loader: DynamicComponentLoader,
//     _parentRouter: Router, @Attribute('name') nameAttr: string,
// //    userService: UserService
//   ) {
//     super(_elementRef, _loader, _parentRouter, nameAttr);

//     this.parentRouter = _parentRouter;
// //    this.userService = userService;
//     this.publicRoutes = [
//       '', 'login', 'signup'
//     ];
//   }

// //   activate(instruction: ComponentInstruction) {
// //     if (this._canActivate(instruction.urlPath)) {
// //       return super.activate(instruction);
// //     }

// //     this.parentRouter.navigate(['Login']);
// //   }

//   _canActivate(url) {
// //    return this.publicRoutes.indexOf(url) !== -1 || this.userService.isLoggedIn()
//   }
// }