import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-BjcRTCQS.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as signIn, t as authClient } from "./client-CVqXY6bk.mjs";
import { o as GROK_PROVIDERS } from "./server-DC_NIGmU.mjs";
import { r as getPortalBrand } from "./brand-BeQEY2zF.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { At as issueOtp, X as useCurrentUserState, Y as HpMark, ct as Input, lt as Button, pt as checkEmailGate, sn as verifyOtp, st as Label } from "./router-o_A6MRMh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-Dr3mXqIF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Separator({ className, orientation = "horizontal" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "separator",
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)
	});
}
function Mark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className,
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "5",
				width: "3.2",
				height: "14",
				rx: "0.6",
				fill: "currentColor",
				opacity: "0.95"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "9.4",
				y: "8",
				width: "3.2",
				height: "11",
				rx: "0.6",
				fill: "currentColor",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14.8",
				y: "3",
				width: "3.2",
				height: "16",
				rx: "0.6",
				fill: "currentColor"
			})
		]
	});
}
function GoogleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.04h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.43Z",
				opacity: "0.9"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M12 22c2.7 0 4.96-.9 6.62-2.34l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.58A10 10 0 0 0 12 22Z",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M6.42 13.99A6.01 6.01 0 0 1 6.1 12c0-.69.12-1.36.32-1.99V7.43H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.57l3.35-2.58Z",
				opacity: "0.55"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "currentColor",
				d: "M12 5.88c1.47 0 2.79.5 3.82 1.5l2.86-2.86C16.95 2.9 14.7 2 12 2A10 10 0 0 0 3.07 7.43l3.35 2.58C7.2 7.64 9.4 5.88 12 5.88Z",
				opacity: "0.75"
			})
		]
	});
}
function XMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		className: "size-4",
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			fill: "currentColor",
			d: "M14.7 10.35 21.2 3h-1.54l-5.66 6.4L9.47 3H3.5l6.82 9.7L3.5 21h1.54l5.97-6.75L14.53 21h5.97l-5.8-10.65Zm-2.11 2.39-.7-1-5.5-7.86h2.37l4.45 6.36.69 1 5.78 8.26h-2.37l-4.72-6.76Z"
		})
	});
}
function Login() {
	const { user, isPending } = useCurrentUserState();
	const portalMode = typeof window !== "undefined" && (new URLSearchParams(window.location.search).get("portal") === "1" || window.location.hostname.startsWith("portal."));
	const b = useQuery({
		queryKey: ["portal-brand"],
		queryFn: () => getPortalBrand(),
		enabled: portalMode
	}).data;
	const [mode, setMode] = (0, import_react.useState)("in");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [otpSent, setOtpSent] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)("idle");
	const [error, setError] = (0, import_react.useState)(null);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", { className: "hidden bg-sidebar lg:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex items-center justify-center px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-40 animate-pulse rounded-md bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-full animate-pulse rounded-md bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-full animate-pulse rounded-md bg-muted" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-full animate-pulse rounded-md bg-muted" })
				]
			})
		})]
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/home" });
	async function onEmailSubmit(e) {
		e.preventDefault();
		setError(null);
		setBusy("email");
		try {
			if (mode === "up") {
				if (!(await checkEmailGate({ data: { email: email.trim() } })).ok) throw new Error("This email is not in the Pipedrive contact book.");
				if (!otpSent) {
					const sent = await issueOtp({ data: {
						email: email.trim(),
						purpose: "register"
					} });
					if (!sent.ok) throw new Error("Could not send a verification code.");
					setOtpSent(sent.demoCode);
					setBusy("idle");
					return;
				}
				const v = await verifyOtp({ data: {
					email: email.trim(),
					code: otp,
					purpose: "register"
				} });
				if (!v.ok) throw new Error(v.error ?? "Invalid code.");
				const { error: err } = await authClient.signUp.email({
					name: name.trim() || email.split("@")[0] || "Northline",
					email: email.trim(),
					password,
					callbackURL: "/home"
				});
				if (err) throw new Error(err.message ?? "Could not create account");
			} else {
				const { error: err } = await authClient.signIn.email({
					email: email.trim(),
					password,
					callbackURL: "/home"
				});
				if (err) throw new Error(err.message ?? "Could not sign in");
			}
			await authClient.getSession().catch(() => void 0);
			window.location.assign("/home");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
			setBusy("idle");
		}
	}
	async function onSocial(providerId) {
		setError(null);
		setBusy(providerId);
		try {
			await signIn(providerId, {
				callbackURL: "/home",
				errorCallbackURL: "/login"
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "Sign-in failed");
			setBusy("idle");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "grid min-h-dvh bg-background lg:grid-cols-[1.05fr_0.95fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "relative hidden overflow-hidden border-r border-border bg-sidebar px-12 py-12 lg:flex lg:flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2.5 text-primary",
					children: portalMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
						className: "size-7",
						color: `#${b?.primaryHex ?? "0D47A1"}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: b?.company ?? "Hurricane Productions"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Northline"
					})] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 mt-auto max-w-md pb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase",
							children: portalMode ? "Client portal" : "Registered access"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-4xl font-semibold tracking-tight text-balance",
							children: portalMode ? b?.tagline ?? "Stop Quoting. Start Partnering." : "The house CRM for live event production."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
							children: portalMode ? `Your files, approvals, and signatures on ${b?.portalHost ?? "portal.hurricaneproductionsllc.com"}. Not a vendor subdomain.` : "Pipeline, labor, and show files stay behind a signed-in session. Public booking, web forms, and e-sign links remain open for clients."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-8 grid gap-2 text-sm text-muted-foreground",
							children: [
								"Encrypted workspace session",
								"Google, X, or company email",
								"Idle lock still sits on top of sign-in"
							].map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1 rounded-full bg-primary" }), line]
							}, line))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "pointer-events-none absolute -right-10 -bottom-8 size-72 text-foreground/6" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex items-center justify-center px-5 py-12 sm:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-8 flex items-center gap-2.5 text-primary lg:hidden",
						children: portalMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HpMark, {
							className: "size-6",
							color: `#${b?.primaryHex ?? "0D47A1"}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-foreground",
							children: b?.company ?? "Hurricane Productions"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-foreground",
							children: "Northline"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-semibold tracking-tight",
						children: mode === "in" ? "Sign in" : "Create account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: mode === "in" ? "Email is the username. Google sign-in is one click. Forgot password lives below." : "Pipedrive contacts only. We email a one-time code, then you set a password."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-6 space-y-3",
							onSubmit: onEmailSubmit,
							children: [
								mode === "up" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Full name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										name: "name",
										autoComplete: "name",
										value: name,
										onChange: (e) => setName(e.target.value),
										placeholder: "Dana Okonkwo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Work email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										name: "email",
										type: "email",
										autoComplete: "username",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										placeholder: "you@northline.av"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "password",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "password",
										name: "password",
										type: "password",
										autoComplete: mode === "in" ? "current-password" : "new-password",
										required: true,
										minLength: 8,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										placeholder: "At least 8 characters"
									})]
								}),
								mode === "up" && otpSent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "otp",
											children: "One-time code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "otp",
											value: otp,
											onChange: (e) => setOtp(e.target.value),
											placeholder: "6 digits",
											required: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["Workspace verification code: ", otpSent]
										})
									]
								}),
								mode === "in" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-right text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/forgot",
										className: "text-muted-foreground hover:underline",
										children: "Forgot password"
									})
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-destructive",
									role: "alert",
									children: error
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 w-full",
									disabled: busy !== "idle",
									children: busy === "email" ? mode === "in" ? "Signing in…" : "Creating account…" : mode === "in" ? "Sign in" : otpSent ? "Verify and create account" : "Send verification code"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-6 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] tracking-[0.14em] text-muted-foreground uppercase",
									children: "or"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "flex-1" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "secondary",
								className: "h-11 w-full",
								disabled: busy !== "idle",
								onClick: () => void onSocial(p.providerId),
								children: [
									p.label === "Google" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XMark, {}),
									"Continue with ",
									p.label
								]
							}, p.providerId))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 text-sm text-muted-foreground",
							children: [
								mode === "in" ? "New to the shop?" : "Already registered?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "font-medium text-foreground underline-offset-4 hover:underline",
									onClick: () => {
										setMode(mode === "in" ? "up" : "in");
										setError(null);
									},
									children: mode === "in" ? "Create an account" : "Sign in"
								})
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-10 text-xs leading-relaxed text-muted-foreground",
						children: [
							"Public RFPs stay on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/f/$slug",
								params: { slug: "site-survey" },
								className: "underline-offset-4 hover:underline",
								children: "web forms"
							}),
							". A signed-in session is required for pipeline, contacts, and security."
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { Login as component };
