import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CZC9dlvp.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-CPfUIDme.js
var REVIEW_PLATFORMS = [
	{
		id: "google",
		label: "Google",
		href: "https://search.google.com/local/writereview?placeid=Hurricane+Productions"
	},
	{
		id: "yelp",
		label: "Yelp",
		href: "https://www.yelp.com/writeareview/biz/hurricane-productions-brooklyn"
	},
	{
		id: "facebook",
		label: "Facebook",
		href: "https://www.facebook.com/hurricaneproductions/reviews"
	},
	{
		id: "weddingwire",
		label: "WeddingWire",
		href: "https://www.weddingwire.com/reviews"
	},
	{
		id: "theknot",
		label: "The Knot",
		href: "https://www.theknot.com/marketplace/write-a-review"
	},
	{
		id: "zola",
		label: "Zola",
		href: "https://www.zola.com/wedding-vendors"
	}
];
var getReviewsDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b77d13c292d940ba431314ffff791dda1b062a8c906718b73a3f395ef64cf30f"));
var saveReviewSchedule = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9c432fce86eef8141c7628c824c9f18f019fab894388a55a7fe96f21fc887a0d"));
var requestReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d4a50053643a2dc0f984e127996474bc9bb6f3ab6d393397b0c81a9ef985f36e"));
var runDueReviews = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("779bf453d73212b0a60fc77eb6b07bb688ab37c7de8a69e212eb82182465e735"));
var getReviewPublic = createServerFn({ method: "GET" }).validator((input) => input).handler(createSsrRpc("f40ee66a0bce12efdc31dd9431ff8622519268ef1b9c1eb5144adf713677fc08"));
var submitReview = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("872ada1a3b888c756effb4aae6dcc43ce60df290eeb08760f6b1abc3ee93e426"));
var clickReviewPlatform = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("f51221b3bceb108c05cb5e24030f539e39b23a56a702b6bc05652b8d7490cb41"));
var getDirectoryProfile = createServerFn({ method: "GET" }).handler(createSsrRpc("707e5641948e0384511619753e2fed42e1997d5d034de63017a582b8684818c1"));
//#endregion
export { getReviewsDesk as a, saveReviewSchedule as c, getReviewPublic as i, submitReview as l, clickReviewPlatform as n, requestReview as o, getDirectoryProfile as r, runDueReviews as s, REVIEW_PLATFORMS as t };
