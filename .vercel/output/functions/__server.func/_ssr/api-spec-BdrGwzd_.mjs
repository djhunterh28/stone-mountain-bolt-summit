//#region node_modules/.nitro/vite/services/ssr/assets/api-spec-BdrGwzd_.js
var API_SCOPES = [
	{
		id: "events:read",
		label: "Read events",
		hint: "Shows, holds, and event dates"
	},
	{
		id: "events:write",
		label: "Write events",
		hint: "Create and update shows"
	},
	{
		id: "clients:read",
		label: "Read clients",
		hint: "Organizations and people"
	},
	{
		id: "clients:write",
		label: "Write clients",
		hint: "Create orgs and contacts"
	},
	{
		id: "deals:read",
		label: "Read deals",
		hint: "Pipeline records"
	},
	{
		id: "deals:write",
		label: "Write deals",
		hint: "Create, move, win, lose"
	},
	{
		id: "people:read",
		label: "Read people",
		hint: "Contact book"
	},
	{
		id: "activities:read",
		label: "Read activities",
		hint: "Calls, walks, load-ins"
	},
	{
		id: "webhooks",
		label: "Webhooks",
		hint: "Subscribe and replay"
	}
];
var WEBHOOK_EVENTS = [
	{
		event: "deal.created",
		summary: "A deal lands on the board",
		payload: {
			id: "evt_8f2",
			event: "deal.created",
			created_at: "2026-09-21T16:04:00.000Z",
			data: {
				id: 21,
				title: "Soho House rooftop — brand dinner",
				value: 64e3,
				status: "open",
				venue: "Soho House",
				event_date: "2026-10-18",
				client: {
					id: 6,
					name: "Soho House"
				}
			}
		}
	},
	{
		event: "deal.updated",
		summary: "Stage, value, or venue changed",
		payload: {
			id: "evt_8f3",
			event: "deal.updated",
			created_at: "2026-09-21T16:12:00.000Z",
			data: {
				id: 1,
				title: "Citadel holiday",
				stage: "Negotiation",
				value: 186400
			}
		}
	},
	{
		event: "deal.won",
		summary: "Show is signed",
		payload: {
			id: "evt_8f4",
			event: "deal.won",
			created_at: "2026-09-21T18:40:00.000Z",
			data: {
				id: 4,
				title: "1 Hotel Brooklyn Bridge wedding",
				value: 28500,
				status: "won"
			}
		}
	},
	{
		event: "deal.lost",
		summary: "Hold released",
		payload: {
			id: "evt_8f5",
			event: "deal.lost",
			created_at: "2026-09-21T19:02:00.000Z",
			data: {
				id: 8,
				status: "lost",
				lost_reason: "Budget"
			}
		}
	},
	{
		event: "client.created",
		summary: "Organization added",
		payload: {
			id: "evt_9a1",
			event: "client.created",
			created_at: "2026-09-21T16:20:00.000Z",
			data: {
				id: 16,
				name: "The Shed",
				city: "Manhattan",
				industry: "Venue"
			}
		}
	},
	{
		event: "person.created",
		summary: "Contact added",
		payload: {
			id: "evt_9a2",
			event: "person.created",
			created_at: "2026-09-21T16:21:00.000Z",
			data: {
				id: 40,
				name: "Amina Cole",
				email: "amina.cole@nike.com",
				org: "Nike"
			}
		}
	},
	{
		event: "activity.created",
		summary: "Call, walk, or load-in logged",
		payload: {
			id: "evt_7c1",
			event: "activity.created",
			created_at: "2026-09-21T16:30:00.000Z",
			data: {
				id: 80,
				type: "site-survey",
				subject: "Cipriani walk",
				due_at: "2026-09-23T14:00:00.000Z"
			}
		}
	},
	{
		event: "booking.created",
		summary: "Scheduler or Calendly hold",
		payload: {
			id: "evt_6b1",
			event: "booking.created",
			created_at: "2026-09-21T16:44:00.000Z",
			data: {
				guest: "Elena Voss",
				starts_at: "2026-09-23T15:00:00.000Z",
				zoom: "https://northline.zoom.us/j/818…"
			}
		}
	},
	{
		event: "form.submitted",
		summary: "Public or embedded form landed",
		payload: {
			id: "evt_4f1",
			event: "form.submitted",
			created_at: "2026-09-21T16:55:00.000Z",
			data: {
				form: "show-intake",
				name: "Maya Chen",
				venue: "Cipriani 42nd",
				source: "embed"
			}
		}
	}
];
var REST_ENDPOINTS = [
	{
		method: "GET",
		path: "/api/v1",
		scope: null,
		summary: "Catalog and authentication notes",
		public: true
	},
	{
		method: "GET",
		path: "/api/v1/openapi.json",
		scope: null,
		summary: "OpenAPI 3 document for Zapier and codegen",
		public: true
	},
	{
		method: "GET",
		path: "/api/v1/events",
		scope: "events:read",
		summary: "List live-event shows (deals with a venue or event date)",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/events/:id",
		scope: "events:read",
		summary: "One show",
		public: false
	},
	{
		method: "POST",
		path: "/api/v1/events",
		scope: "events:write",
		summary: "Create a show. Fires deal.created.",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/clients",
		scope: "clients:read",
		summary: "Organizations — venues, brands, agencies",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/clients/:id",
		scope: "clients:read",
		summary: "One client plus related people",
		public: false
	},
	{
		method: "POST",
		path: "/api/v1/clients",
		scope: "clients:write",
		summary: "Create a client. Fires client.created.",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/people",
		scope: "people:read",
		summary: "Contact book",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/deals",
		scope: "deals:read",
		summary: "Full pipeline, including pre-event holds",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/deals/:id",
		scope: "deals:read",
		summary: "One deal",
		public: false
	},
	{
		method: "POST",
		path: "/api/v1/deals",
		scope: "deals:write",
		summary: "Create a deal. Fires deal.created.",
		public: false
	},
	{
		method: "PATCH",
		path: "/api/v1/deals/:id",
		scope: "deals:write",
		summary: "Update stage, value, or status. Fires deal.updated / deal.won / deal.lost.",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/activities",
		scope: "activities:read",
		summary: "Calls, walks, load-ins",
		public: false
	},
	{
		method: "GET",
		path: "/api/v1/webhooks",
		scope: "webhooks",
		summary: "List subscriptions",
		public: false
	},
	{
		method: "POST",
		path: "/api/v1/webhooks",
		scope: "webhooks",
		summary: "Subscribe a URL to an event",
		public: false
	},
	{
		method: "POST",
		path: "/api/v1/webhooks/:id/test",
		scope: "webhooks",
		summary: "Send a sample payload",
		public: false
	},
	{
		method: "DELETE",
		path: "/api/v1/webhooks/:id",
		scope: "webhooks",
		summary: "Revoke a subscription",
		public: false
	}
];
var AUTH_EXAMPLE = `Authorization: Bearer nl_live_••••
X-Api-Key: nl_live_••••`;
var CURL_EXAMPLE = `curl https://app.northline.av/api/v1/events \\
  -H "Authorization: Bearer nl_live_••••"`;
//#endregion
export { WEBHOOK_EVENTS as a, REST_ENDPOINTS as i, AUTH_EXAMPLE as n, CURL_EXAMPLE as r, API_SCOPES as t };
