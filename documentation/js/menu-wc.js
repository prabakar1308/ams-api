'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ams-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' : 'data-bs-target="#xs-controllers-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' :
                                            'id="xs-controllers-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' : 'data-bs-target="#xs-injectables-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' :
                                        'id="xs-injectables-links-module-AppModule-2abe90f275e25c1b84c5f58c04b0f1f3e8dceca42d1f67d5c849a10520370c7e28fadd403c22aef363ce5fbac91cc6d613a0fccec4f208bbd34498bdf4673510"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' :
                                            'id="xs-controllers-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' :
                                        'id="xs-injectables-links-module-AuthModule-7185a0972cb9aa7ed0af5bc32446bf04febf44150753afe25d4a1f6fdf30546abfe6cd610b4bf4fc9dded56277f7079c50df9b8740e95bcf5c7d2f0386f27a79"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link" >DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' : 'data-bs-target="#xs-controllers-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' :
                                            'id="xs-controllers-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' }>
                                            <li class="link">
                                                <a href="controllers/DashboardController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' : 'data-bs-target="#xs-injectables-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' :
                                        'id="xs-injectables-links-module-DashboardModule-93232dfdafab4321ce7d812ec479fd2e09729e28807fd930b86717b7107ab03166e163b6c0491774e2c77634415db20d04f0445a8393ce640979bee2a7061bcf"' }>
                                        <li class="link">
                                            <a href="injectables/DashboardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DashboardService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MasterModule.html" data-type="entity-link" >MasterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' : 'data-bs-target="#xs-controllers-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' :
                                            'id="xs-controllers-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' }>
                                            <li class="link">
                                                <a href="controllers/MasterController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MasterController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' : 'data-bs-target="#xs-injectables-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' :
                                        'id="xs-injectables-links-module-MasterModule-6e613b9b762a71fd5fd88f630c5603c51d7ffa1ad0f80aa84c85c9b523693f7ef1755955dd3efb3850df16d536362b1ca6ff8490a126dda7e7ef36aeb567814c"' }>
                                        <li class="link">
                                            <a href="injectables/MasterService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MasterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' :
                                            'id="xs-controllers-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' :
                                        'id="xs-injectables-links-module-UsersModule-9f36e72b7fa0663bce0a3eae4d85ce19fa7420f8a6e94791ec3b7a05e35ba20ffb7b4649ebf869e2c437fa3990e21da6bc84029a4cac64d0d51303c66f9169b2"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DashboardController.html" data-type="entity-link" >DashboardController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MasterController.html" data-type="entity-link" >MasterController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserRequestDto.html" data-type="entity-link" >CreateUserRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserResponseDto.html" data-type="entity-link" >CreateUserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWorksheetDto.html" data-type="entity-link" >CreateWorksheetDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUserParamDto.html" data-type="entity-link" >GetUserParamDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchUserDto.html" data-type="entity-link" >PatchUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchWorksheetDto.html" data-type="entity-link" >PatchWorksheetDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MasterService.html" data-type="entity-link" >MasterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});