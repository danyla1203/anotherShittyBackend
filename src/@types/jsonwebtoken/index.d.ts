/// <reference types="node" />

export type Secret =
    | string
    | Buffer
    | { key: string | Buffer; passphrase: string };

export interface VerifyOptions {
    algorithms?: Algorithm[];
    audience?: string | RegExp | Array<string | RegExp>;
    clockTimestamp?: number;
    clockTolerance?: number;
    /** return an object with the decoded `{ payload, header, signature }` instead of only the usual content of the payload. */
    complete?: boolean;
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    jwtid?: string;
    /**
     * If you want to check `nonce` claim, provide a string value here.
     * It is used on Open ID for the ID Tokens. ([Open ID implementation notes](https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes))
     */
    nonce?: string;
    subject?: string;
    /**
     * @deprecated
     * Max age of token
     */
    maxAge?: string;
}
declare module "jsonwebtoken" {
    export function verify<T>(token: string, secretOrPublicKey: Secret, options?: VerifyOptions): T;
}