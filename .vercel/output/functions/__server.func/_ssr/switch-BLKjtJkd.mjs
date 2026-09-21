import { t as cn } from "./utils-BjcRTCQS.mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/switch-BLKjtJkd.js
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-accent shadow-[var(--shadow-border)] transition-colors data-[state=checked]:bg-primary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-4 translate-x-0.5 rounded-full bg-foreground transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-primary-foreground" })
	});
}
//#endregion
export { Switch as t };
