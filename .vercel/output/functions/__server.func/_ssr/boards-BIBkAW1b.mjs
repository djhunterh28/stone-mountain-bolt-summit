import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/boards-BIBkAW1b.js
var listBoards = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2d7e3cf7426e24c3c40abfeca88f81e98cf80670f2f4d83308ee70d0ce2732f0"));
var createBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("aa9ceb8ba0f696dabafa5dd4a373ddb3a0bd907cd7c46175209575a7791d86c2"));
var rotateBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ae92cbedca0d43ad1dcb0bb971c160a439ffb95b1b1cb0d3fa8bff36d51d1e0a"));
var revokeBoard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("3d2e7d72539bf5f631fd9159eb4e6752b3b416b8358d2ebbc01f6fd4afcd2ccc"));
var getBoardPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("cc890b99bd9742106809b56754591022242404c753194613f207d0e9a0213b40"));
//#endregion
export { rotateBoard as a, revokeBoard as i, getBoardPublic as n, listBoards as r, createBoard as t };
