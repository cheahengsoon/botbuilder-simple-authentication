import { TurnContext, Activity } from 'botbuilder';
import { Request, Response, Next } from 'restify';
import { ProviderType } from './enums';

//--------------------------------------- CONFIGURATION -----------------------------------------//

export interface BotAuthenticationConfiguration {
	/**
     * Runs each converation turn. The middleware will prevent the bot logic from running when it returns false.
    */
	isUserAuthenticated: (context: TurnContext) => Promise<boolean> | boolean;
	/**
     * Runs when the user inputs the correct magic code. The middleware passes the user's access token.
    */
	onLoginSuccess: (context: TurnContext, accessToken: string, provider: ProviderType) => Promise<void> | void;
	/**
     * (Optional) Runs when the user inputs an incorrect magic code. The middleware will force another login attempt by default.
    */
	onLoginFailure?: (context: TurnContext, provider: ProviderType) => Promise<void> | void;
	/**
     * (Optional) Overrides the default Authentication Card. The middleware supplies the authorization uris necessary to build the card.
    */
	customAuthenticationCardGenerator?: (context: TurnContext, authorizationUris: ProviderAuthorizationUri[]) => Promise<Partial<Activity>> | Partial<Activity>;
    /**
     * (Optional) Overrides the default magic code display page. The server endpoint provided will receive a redirect with the magic code in the query string.
    */
	customMagicCodeRedirectEndpoint?: string;
    /**
     * (Optional) Message sent on first conversation turn where the user is not authenticated, immediately prior to the Authentication Card. 
    */
	noUserFoundMessage?: string;
    /**
     * (Optional) Configuration object that enables Facebook authentication
    */
	facebook?: ProviderConfiguration;
    /**
     * (Optional) Configuration object that enables Azure AD V2 authentication
    */
	azureADv2?: AzureADv2Configuration;
    /**
     * (Optional) Configuration object that enables Google authentication
    */
	google?: ProviderConfiguration;
    /**
     * (Optional) Configuration object that enables GitHub authentication
    */
	github?: ProviderConfiguration;
}

export interface ProviderConfiguration {
    /**
     * ClientId taken from the provider's authentication application.
    */
	clientId: string;
    /**
     * ClientSecret taken from the provider's authentication application.
    */
	clientSecret: string;
    /**
     * (Optional) Scopes that the user will be asked to consent to as part of the authentication flow.
    */
	scopes?: string[];
    /**
     * (Optional) Text displayed inside the button that triggers the provider's authentication flow.
    */
	buttonText?: string;
}

export interface AzureADv2Configuration extends ProviderConfiguration {
    /**
     * (Optional) Organizational tenant domain.
    */
	tenant?: string;
    /**
     * (Optional) Identifier of the WebAPI that your client wants to access on behalf of the user.
    */
	resource?: string
}

export interface ProviderAuthorizationUri {
    /**
     * Selected authentication provider
    */
	provider: ProviderType;
    /**
     * Uri that triggers authentication flow once opened.
    */
	authorizationUri: string;
}

//--------------------------------- PROVIDER DEFAULT OPTIONS ----------------------------------//

export interface DefaultProviderOptions {
    /**
     * Facebook default options.
    */
	facebook: ProviderDefaults;
    /**
     * Azure AD V2 default options.
    */
	azureADv2: AzureADv2Defaults;
    /**
     * Google default options.
    */
	google: ProviderDefaults;
    /**
     * GitHub default options.
    */
	github: ProviderDefaults;
}

export interface ProviderDefaults {
    /**
     * Scopes that the user will be asked to consent to as part of the authentication flow.
    */
	scopes: string[];
    /**
     * Text displayed inside the button that triggers the provider's authentication flow.
    */
	buttonText: string;
}

export interface AzureADv2Defaults extends ProviderDefaults {
    /**
     * Organizational tenant domain.
    */
	tenant: string;
    /**
     * Identifier of the WebAPI that your client wants to access on behalf of the user.
    */
	resource: string;
}