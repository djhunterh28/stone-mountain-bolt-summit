import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/smtp-CmmXK4E5.js
var getSmtpDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4ff6727966562d05e00920cc6a782645374cf1a133ea543cdbd67952fe546320"));
var sendSmtpTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ba256cd1dc44feae38f5faab0fee5f0fefc881d7cc78d24e36e81bb6d4f6f776"));
var testSmtp = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("f763442e2e59fe5ab669240ab3d5ae649d5429dd38dcc12200190ba113e7fd25"));
var runSmtpWorkflows = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("53d872dd62853c1eb7c46df4bfe2ffb706de8b07a61c98f261a2023295ebab68"));
var toggleSmtpWorkflow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fd65f0d7774f04314df9869a73f7ecc0ae5f16fcf602f0eb1f10a1d990671bf8"));
var trackSmtp = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("2be1a2654a8227d530241aff131e6749079033a2bb0fdc15022b304042fe0201"));
//#endregion
export { toggleSmtpWorkflow as a, testSmtp as i, runSmtpWorkflows as n, trackSmtp as o, sendSmtpTemplate as r, getSmtpDesk as t };
