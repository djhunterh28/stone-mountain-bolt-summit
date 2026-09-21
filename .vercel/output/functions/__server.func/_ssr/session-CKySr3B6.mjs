import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-CKySr3B6.js
var getClientPortal = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("5dcd57298f120afd583a6d09fd2f8dacdc4e36d67541058e098eba806942ee59"));
var payPortalInvoice = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("dccbb00666e960a161b9fa5b69a20c51d4825b39818fee62ea21d5bce07dcaaa"));
var signPortalContract = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d33dc1ad2b5c738b04657b08bf38e237df663ba41ed3ffe5c5da006ee7f6362e"));
var requestPortalLink = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("223f255b921cde62159644a9b50364dcccf3017d4e66ad0b10e054c550398147"));
var getPortalLinkDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4b0bbbf8257bce6214c07bfdb299df25960b086946923d4712ff406936ea131f"));
var mintPortalLink = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("903bcb30365e64e18f36479bc6ca399955205c3dc075354c1372baea30ba1d96"));
var revokePortalLink = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("151501a2ccc8ce4a96ef618166fef67344e7f518388bb3f150b353d0eac5aa67"));
//#endregion
export { requestPortalLink as a, payPortalInvoice as i, getPortalLinkDesk as n, revokePortalLink as o, mintPortalLink as r, signPortalContract as s, getClientPortal as t };
