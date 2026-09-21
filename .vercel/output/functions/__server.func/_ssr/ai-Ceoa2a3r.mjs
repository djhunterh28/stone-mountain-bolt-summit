import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./utils-DLVA4J7b.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-Ceoa2a3r.js
var runAi = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("872aff95bbd2b2990f74de83c4c87fa871e48b382e7004319f3244896988b90e"));
//#endregion
export { runAi as t };
