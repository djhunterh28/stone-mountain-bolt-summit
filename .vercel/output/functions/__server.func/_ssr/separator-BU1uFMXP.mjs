import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./utils-DLVA4J7b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/separator-BU1uFMXP.js
var import_jsx_runtime = require_jsx_runtime();
function Separator({ className, orientation = "horizontal" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)
	});
}
//#endregion
export { Separator as t };
