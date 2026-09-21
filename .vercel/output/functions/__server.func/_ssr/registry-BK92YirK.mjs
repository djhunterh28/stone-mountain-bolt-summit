import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/registry-BK92YirK.js
var getRegistryDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ce908b95d660187b423d9c2d3468bd7083e29cb9e2923a15ed369678caf8229e"));
var savePerson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d205aea8d22b473e1e46c8d82795b77e9e8a1de364011be3833f351f67c509b0"));
var geocodePerson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4d894afcaf762f462c5ed9bd40a7e3ff2f8cfc2dbfaa1e4d46e1e2bc73f9b409"));
var getClientHistory = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("00e14d6e738a4c55e0d24a4b7edabb61157c561319f03a4b46f02f5c50736305"));
//#endregion
export { savePerson as i, getClientHistory as n, getRegistryDesk as r, geocodePerson as t };
