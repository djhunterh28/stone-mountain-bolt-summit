import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ultimate-DAnhRr51.js
var listGoals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("703f1a10b84575fe2772b961309ec240e702ed8eac53928bffa5bc61ebf9e022"));
var createGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3d0d670fa8baef5ec09998928396782e6f2aa69179dcef929f2390a2150ba498"));
var getPersonDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("89b325c3582e1eccf85e8385f69b32d39922577a0cb53ce880a2e9419a71d902"));
var getOrgDetail = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8dd2a408d8dff06e5fda84a188263c3945041c7798c3f893e1750d0905e25666"));
var enrichRecord = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aa83bb7557912eeda7ae5262f44babd5d63e26242af764991e491b98009fb77e"));
var cloneDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("76639507784af1105bd81d7721906ae45e2457e99bc430c691f6c5d5ebe53f94"));
var importDeals = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1593cb2b22470d55a55f8d88cbba480a4bde4893fd88277f5573fc1869bef1b3"));
var getAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ff2e035efdb2f33559f0c450ff7c3878eaf2bfb01f0614964b7620e5b00248f3"));
var createApiToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("934aadae5bb1c84bc9f039c0160948fdb3cf9cdce1a13e4c51d132df6ab37c91"));
var revokeToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e11833f5441d410f7a9ae47736d073b2e808190230cfd589515a6a9c31a928b3"));
var listChatbots = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("88372970f9e2b518caec60ac096e0b47e0e41a5b879e1453815b3a306e5043cd"));
var toggleChatbot = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3f5d83832ed1c235b63527f55e2a2865765df985f39c6b93ddc209a01b35cda3"));
var getSchedulerBySlug = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("48f33af40e10e3e328f918f452f990508397e21a52d4275e10a2ed7daa517dac"));
var getDocumentPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("04aad327692878cf5341b5b0a13d63bf9d048ae12fbf662564aca5c0a7259ae2"));
var listEnrollments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("385bc7a6617b054dfeacf4ae0c476816b2642eec8b059e14b8d99585f94b5805"));
var enrollSequence = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("4bde36a4a20b8df8c48647e11d7523bb4c6e265a9a380f23cbe9ab43d79ff74a"));
var runAutomation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("42fe9c1b9aa70a0720f5c9e7cb3d344561ce78cae597ade75c63cc11ca106d9f"));
//#endregion
export { toggleChatbot as _, enrollSequence as a, getOrgDetail as c, importDeals as d, listChatbots as f, runAutomation as g, revokeToken as h, enrichRecord as i, getPersonDetail as l, listGoals as m, createApiToken as n, getAdmin as o, listEnrollments as p, createGoal as r, getDocumentPublic as s, cloneDeal as t, getSchedulerBySlug as u };
