import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as formatDate, t as authMiddleware } from "./utils-DLVA4J7b.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as TabsContent, Q as Tabs, X as PageHeader, et as TabsList, lt as Input, tt as TabsTrigger, ur as useUi, ut as Button, wn as getBootstrap } from "./router-Bkw81Fhc.mjs";
import { t as Badge } from "./badge-BQYjLRpy.mjs";
import { i as roadMiles, n as naiveLoop, r as optimizeLoop, t as driveMinutes } from "./geo-D62gvrqT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-C8acKTxh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FUEL_PRICE = {
	diesel: 4.18,
	gas: 3.39
};
function tripCost(t) {
	const fuelPrice = t.fuel === "gas" ? FUEL_PRICE.gas : FUEL_PRICE.diesel;
	const fuel = t.mpg && t.mpg > 0 ? t.miles / t.mpg * fuelPrice : 0;
	const mileage = t.miles * t.ratePerMile;
	const reimbursable = t.reimburse ? mileage + t.tolls + t.parking : 0;
	const fleet = t.reimburse ? 0 : fuel + t.tolls + t.parking;
	return {
		fuel,
		mileage,
		reimbursable,
		fleet,
		total: reimbursable + fleet
	};
}
var getTravelDesk = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2f4a335e5c6b6cbaed1b604d1ca2844834122c26f6bdc9bc7aee585b17b7a929"));
var createTrip = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5de130c8193838a41768f7f086f052e9cf5028c048aff8089c96deddf8bae7b8"));
var setTripStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("99add479dfaece64d15db7c5fdc0ddcbd289f7e833583ac32531a7af8f3e486e"));
var createVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("eddd8773a598e820277314b06afa61d4b04a3647410b59b0f87d8db5d1b586df"));
var toggleVehicle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("7982d811786273fa70d98965c24bc481af202659131a6b161f57f0532bd814f6"));
var KIND_LABEL = {
	"box-26": "26ft box",
	"trailer-53": "53ft trailer",
	van: "Cargo van",
	personal: "Personal"
};
function usd(n) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(n);
}
function todayIso() {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(/* @__PURE__ */ new Date());
}
function shopOf(places) {
	return places.find((p) => p.kind === "shop") ?? places[0];
}
function asStop(p) {
	return {
		id: p.id,
		name: p.name,
		lat: p.lat,
		lng: p.lng
	};
}
function speedKind(kind) {
	if (kind === "van") return "van";
	if (kind === "personal") return "car";
	return "truck";
}
function TravelPage() {
	const desk = useQuery({
		queryKey: ["travel"],
		queryFn: () => getTravelDesk()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const qc = useQueryClient();
	const memberId = useUi((s) => s.memberId);
	const vehicles = desk.data?.vehicles ?? [];
	const places = desk.data?.places ?? [];
	const trips = desk.data?.trips ?? [];
	const members = boot.data?.members ?? [];
	const month = todayIso().slice(0, 7);
	const monthTrips = trips.filter((t) => t.traveledOn.startsWith(month));
	const totals = monthTrips.reduce((acc, t) => {
		const c = tripCost(t);
		acc.miles += t.miles;
		acc.trips += 1;
		acc.fleet += c.fleet;
		acc.reimbursable += c.reimbursable;
		acc.fuel += c.fuel;
		acc.tolls += t.tolls;
		acc.parking += t.parking;
		return acc;
	}, {
		miles: 0,
		trips: 0,
		fleet: 0,
		reimbursable: 0,
		fuel: 0,
		tolls: 0,
		parking: 0
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Mileage & travel",
				subtitle: "Shop-to-venue miles, fleet cost, IRS reimbursement, and a day's route off the Gowanus dock."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 px-4 sm:grid-cols-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Miles this month",
						value: `${totals.miles.toFixed(1)} mi`,
						hint: `${totals.trips} trips`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Fleet cost",
						value: usd(totals.fleet),
						hint: `${usd(totals.fuel)} fuel`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reimbursable",
						value: usd(totals.reimbursable),
						hint: "Personal + IRS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Tolls & parking",
						value: usd(totals.tolls + totals.parking),
						hint: "All vehicles"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 px-4 sm:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
					defaultValue: "log",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "flex h-auto flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "log",
									children: "Mileage log"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "vehicles",
									children: "Vehicles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "expenses",
									children: "Expenses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "routes",
									children: "Route optimizer"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "log",
							className: "mt-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripForm, {
								vehicles: vehicles.filter((v) => v.active),
								places,
								members,
								driverId: memberId,
								onSaved: () => qc.invalidateQueries({ queryKey: ["travel"] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TripList, {
								trips,
								onStatus: () => qc.invalidateQueries({ queryKey: ["travel"] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
							value: "vehicles",
							className: "mt-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleForm, { onSaved: () => qc.invalidateQueries({ queryKey: ["travel"] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VehicleList, {
								vehicles,
								onToggle: () => qc.invalidateQueries({ queryKey: ["travel"] })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "expenses",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensePanel, {
								trips: monthTrips,
								vehicles
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: "routes",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoutePanel, {
								places,
								vehicles,
								todayIds: (desk.data?.todayStops ?? []).map((s) => s.id)
							})
						})
					]
				})
			})
		]
	});
}
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.12em] text-muted-foreground uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 font-mono text-xl tabular-nums",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: hint
			})
		]
	});
}
function TripForm({ vehicles, places, members, driverId, onSaved }) {
	const shop = shopOf(places);
	const [originId, setOriginId] = (0, import_react.useState)("");
	const [destId, setDestId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!originId && shop) setOriginId(shop.id);
	}, [shop, originId]);
	const origin = places.find((p) => p.id === originId);
	const dest = places.find((p) => p.id === destId);
	const preview = origin && dest ? roadMiles(origin, dest) : 0;
	const minutes = origin && dest ? driveMinutes(preview, "truck") : 0;
	const orderedPlaces = [...places].sort((a, b) => Number(b.kind === "shop") - Number(a.kind === "shop") || a.name.localeCompare(b.name));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-4",
		onSubmit: (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			if (!originId || !destId) {
				toast.error("Pick origin and destination");
				return;
			}
			createTrip({ data: {
				traveledOn: String(fd.get("traveledOn") || todayIso()),
				vehicleId: Number(fd.get("vehicleId")),
				driverId: Number(fd.get("driverId") || driverId),
				originId: Number(originId),
				destId: Number(destId),
				purpose: String(fd.get("purpose") || "") || void 0,
				tolls: Number(fd.get("tolls") || 0),
				parking: Number(fd.get("parking") || 0),
				milesOverride: Number(fd.get("miles") || 0) || void 0
			} }).then((r) => {
				if (!r.ok) toast.error(r.error);
				else {
					toast.success(`${r.miles.toFixed(1)} mi logged`);
					onSaved();
				}
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: ["Date", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "traveledOn",
					type: "date",
					defaultValue: todayIso(),
					className: "mt-1"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: ["Vehicle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					name: "vehicleId",
					className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					defaultValue: vehicles[0]?.id,
					children: vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: v.id,
						children: v.name
					}, v.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: ["Driver", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					name: "driverId",
					className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					defaultValue: driverId,
					children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: m.id,
						children: m.name
					}, m.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: ["Purpose", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					name: "purpose",
					placeholder: "Load-in, site walk…",
					className: "mt-1"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					value: originId,
					onChange: (e) => setOriginId(Number(e.target.value)),
					children: orderedPlaces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.name
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					value: destId,
					onChange: (e) => setDestId(Number(e.target.value)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Venue"
					}), orderedPlaces.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.name
					}, p.id))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-xs text-muted-foreground",
				children: [
					"Miles ",
					preview ? `(auto ${preview.toFixed(1)})` : "",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "miles",
						type: "number",
						step: "0.1",
						placeholder: preview ? String(preview) : "auto",
						className: "mt-1"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex-1 text-xs text-muted-foreground",
					children: ["Tolls", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "tolls",
						type: "number",
						step: "0.01",
						defaultValue: "0",
						className: "mt-1"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex-1 text-xs text-muted-foreground",
					children: ["Parking", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "parking",
						type: "number",
						step: "0.01",
						defaultValue: "0",
						className: "mt-1"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3 sm:col-span-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: origin && dest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						preview.toFixed(1),
						" mi · ~",
						minutes,
						" min city"
					] }) : "Distance fills in from venue coordinates."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					children: "Log trip"
				})]
			})
		]
	});
}
function TripList({ trips, onStatus }) {
	if (!trips.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "No trips yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
		children: trips.map((t) => {
			const c = tripCost(t);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex flex-wrap items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-16 shrink-0 font-mono text-xs tabular-nums text-muted-foreground",
						children: formatDate(t.traveledOn)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [
								t.originName,
								" → ",
								t.destName
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								t.vehicleName,
								" · ",
								t.driverName,
								" ",
								t.purpose ? `· ${t.purpose}` : ""
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-sm tabular-nums",
						children: [t.miles.toFixed(1), " mi"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-sm tabular-nums",
						children: usd(c.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: t.status === "reimbursed" ? "success" : t.status === "submitted" ? "steel" : "outline",
						children: t.status
					}),
					t.status === "logged" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setTripStatus({ data: {
							id: t.id,
							status: "submitted"
						} }).then(onStatus),
						children: "Submit"
					}),
					t.status === "submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setTripStatus({ data: {
							id: t.id,
							status: "reimbursed"
						} }).then(onStatus),
						children: "Reimburse"
					})
				]
			}, t.id);
		})
	});
}
function VehicleForm({ onSaved }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-2 rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:grid-cols-6",
		onSubmit: (e) => {
			e.preventDefault();
			const fd = new FormData(e.currentTarget);
			createVehicle({ data: {
				name: String(fd.get("name") || "Vehicle"),
				kind: String(fd.get("kind") || "van"),
				plate: String(fd.get("plate") || "") || void 0,
				mpg: Number(fd.get("mpg") || 0) || void 0,
				ratePerMile: Number(fd.get("rate") || .7),
				fuel: String(fd.get("fuel") || "diesel") === "gas" ? "gas" : "diesel",
				reimburse: fd.get("reimburse") === "on"
			} }).then(() => {
				toast.success("Vehicle added");
				onSaved();
				e.currentTarget.reset();
			});
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "name",
				placeholder: "Name"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				name: "kind",
				className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
				defaultValue: "box-26",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "box-26",
						children: "26ft box"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "trailer-53",
						children: "53ft trailer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "van",
						children: "Cargo van"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "personal",
						children: "Personal"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "plate",
				placeholder: "Plate"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "mpg",
				type: "number",
				step: "0.1",
				placeholder: "MPG"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				name: "rate",
				type: "number",
				step: "0.01",
				placeholder: "$ / mi",
				defaultValue: "0.70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "sm",
				children: "Add vehicle"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 text-sm sm:col-span-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					name: "fuel",
					className: "h-9 rounded-md border border-input bg-background px-2 text-sm",
					defaultValue: "diesel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "diesel",
						children: "Diesel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "gas",
						children: "Gas"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						name: "reimburse"
					}), " IRS reimburse"]
				})]
			})
		]
	});
}
function VehicleList({ vehicles, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
		children: vehicles.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-wrap items-center gap-3 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: v.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: KIND_LABEL[v.kind] ?? v.kind
						}),
						!v.active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "warn",
							children: "parked"
						}),
						v.reimburse && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "steel",
							children: "IRS"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						v.plate,
						" · ",
						v.mpg ? `${v.mpg} mpg` : "no mpg",
						" · ",
						usd(v.ratePerMile),
						"/mi · ",
						v.fuel,
						" @ ",
						usd(FUEL_PRICE[v.fuel]),
						"/gal"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: () => toggleVehicle({ data: {
					id: v.id,
					active: !v.active
				} }).then(onToggle),
				children: v.active ? "Park" : "Activate"
			})]
		}, v.id))
	});
}
function ExpensePanel({ trips, vehicles }) {
	const byVehicle = vehicles.map((v) => {
		const rows = trips.filter((t) => t.vehicleId === v.id);
		return {
			v,
			miles: rows.reduce((n, t) => n + t.miles, 0),
			cost: rows.reduce((n, t) => n + tripCost(t).total, 0),
			n: rows.length
		};
	});
	const byDriver = /* @__PURE__ */ new Map();
	for (const t of trips) {
		const name = t.driverName ?? "Unassigned";
		const cur = byDriver.get(name) ?? {
			miles: 0,
			cost: 0
		};
		cur.miles += t.miles;
		cur.cost += tripCost(t).total;
		byDriver.set(name, cur);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: "By vehicle"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-2",
				children: byVehicle.map(({ v, miles, cost, n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [v.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-2 text-xs text-muted-foreground",
						children: [n, " trips"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums",
						children: [
							miles.toFixed(1),
							" mi · ",
							usd(cost)
						]
					})]
				}, v.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "By driver"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: [...byDriver.entries()].map(([name, row]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums",
							children: [
								row.miles.toFixed(1),
								" mi · ",
								usd(row.cost)
							]
						})]
					}, name))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-xs text-muted-foreground",
					children: [
						"Personal vehicles pay the IRS rate (",
						usd(.7),
						"/mi) plus tolls and parking. Company trucks cost fuel at pump plus tolls — no mileage stipend."
					]
				})
			]
		})]
	});
}
function RoutePanel({ places, vehicles, todayIds }) {
	const shop = shopOf(places);
	const venues = places.filter((p) => p.kind !== "shop");
	const [picked, setPicked] = (0, import_react.useState)(todayIds);
	const [vehicleId, setVehicleId] = (0, import_react.useState)(vehicles[0]?.id ?? 0);
	(0, import_react.useEffect)(() => {
		if (todayIds.length) setPicked(todayIds);
	}, [todayIds.join(",")]);
	(0, import_react.useEffect)(() => {
		if (vehicleId === 0 && vehicles[0]) setVehicleId(vehicles[0].id);
	}, [vehicles, vehicleId]);
	const kind = speedKind(vehicles.find((v) => v.id === vehicleId)?.kind ?? "box-26");
	const stops = (0, import_react.useMemo)(() => venues.filter((p) => picked.includes(p.id)).map(asStop), [venues, picked]);
	const result = (0, import_react.useMemo)(() => {
		if (!shop) return null;
		const s = asStop(shop);
		return {
			naive: naiveLoop(s, stops),
			best: optimizeLoop(s, stops)
		};
	}, [shop, stops]);
	const saved = result ? Math.max(0, result.naive.miles - result.best.miles) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[18rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-xs text-muted-foreground",
					children: ["Vehicle", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "mt-1 h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
						value: vehicleId,
						onChange: (e) => setVehicleId(Number(e.target.value)),
						children: vehicles.filter((v) => v.active).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: v.id,
							children: v.name
						}, v.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-[11px] tracking-[0.12em] text-muted-foreground uppercase",
					children: "Stops today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 max-h-80 space-y-1 overflow-y-auto scrollbar-thin",
					children: venues.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-9 items-center gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: picked.includes(p.id),
								onChange: () => setPicked((cur) => cur.includes(p.id) ? cur.filter((id) => id !== p.id) : [...cur, p.id])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: p.name
							}),
							todayIds.includes(p.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "steel",
								children: "today"
							})
						]
					}) }, p.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Naive order",
							value: `${result.naive.miles.toFixed(1)} mi`,
							hint: `${driveMinutes(result.naive.miles, kind)} min`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Optimized",
							value: `${result.best.miles.toFixed(1)} mi`,
							hint: `${driveMinutes(result.best.miles, kind)} min`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Saved",
							value: `${saved.toFixed(1)} mi`,
							hint: saved ? `${driveMinutes(saved, kind)} min back` : "Already tight"
						})
					]
				}),
				shop && result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NycMap, {
					shop: asStop(shop),
					route: result.best
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "divide-y divide-border rounded-xl bg-card shadow-[var(--shadow-border)]",
					children: result.best.legs.map((leg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 font-mono text-xs text-muted-foreground",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex-1",
								children: [
									leg.from.name,
									" → ",
									leg.to.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono tabular-nums",
								children: [leg.miles.toFixed(1), " mi"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-16 text-right text-xs text-muted-foreground",
								children: [driveMinutes(leg.miles, kind), " min"]
							})
						]
					}, `${leg.from.id}-${leg.to.id}-${i}`))
				})
			]
		})]
	});
}
function NycMap({ shop, route }) {
	const maxLat = 40.82;
	const minLng = -74.03;
	const w = 640;
	const h = 420;
	const xy = (lat, lng) => ({
		x: (lng - minLng) / .09999999999999432 * w,
		y: (maxLat - lat) / .1600000000000037 * h
	});
	const d = route.order.map((p, i) => {
		const { x, y } = xy(p.lat, p.lng);
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	const labeled = route.order.filter((p, i) => i === 0 || p.id !== shop.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `0 0 ${w} ${h}`,
			className: "h-auto w-full text-foreground",
			role: "img",
			"aria-label": "Route map",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					width: w,
					height: h,
					className: "fill-muted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "24",
					y: "28",
					className: "fill-muted-foreground",
					fontSize: "11",
					fontFamily: "IBM Plex Mono, monospace",
					children: "HUDSON"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "520",
					y: "200",
					className: "fill-muted-foreground",
					fontSize: "11",
					fontFamily: "IBM Plex Mono, monospace",
					children: "BKLYN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d,
					fill: "none",
					stroke: "currentColor",
					className: "text-primary",
					strokeWidth: "2.2"
				}),
				labeled.map((p, i) => {
					const { x, y } = xy(p.lat, p.lng);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						transform: `translate(${x},${y})`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							r: "9",
							className: "fill-primary"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							textAnchor: "middle",
							y: "4",
							fontSize: "10",
							fontFamily: "IBM Plex Mono, monospace",
							className: "fill-primary-foreground",
							children: i
						})]
					}, `${p.id}-${i}`);
				})
			]
		})
	});
}
//#endregion
export { TravelPage as component };
