export type DealStatus = "open" | "won" | "lost";
export type LeadStatus = "new" | "contacted" | "qualified" | "archived";

export type Member = {
  id: number;
  name: string;
  email: string;
  title: string;
  role: string;
  teamId: number | null;
  teamName: string | null;
  initials: string;
  tone: string;
};

export type Pipeline = {
  id: number;
  name: string;
  sortOrder: number;
  stages: Stage[];
};

export type Stage = {
  id: number;
  pipelineId: number;
  name: string;
  sortOrder: number;
  rottingDays: number;
  probability: number;
};

export type DealCard = {
  id: number;
  title: string;
  value: number;
  pipelineId: number;
  stageId: number;
  orgId: number | null;
  orgName: string | null;
  personId: number | null;
  personName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  ownerInitials: string | null;
  ownerTone: string | null;
  status: DealStatus;
  lostReason: string | null;
  expectedClose: string | null;
  eventDate: string | null;
  venue: string | null;
  guestCount: number | null;
  indoor: boolean | null;
  loadIn: string | null;
  source: string | null;
  notes: string | null;
  probability: number | null;
  stageEnteredAt: string | null;
  createdAt: string;
  updatedAt: string;
  daysInStage: number;
  rotting: boolean;
  nextActivity: string | null;
  nextActivityAt: string | null;
  productCount: number;
};

export type DealDetail = DealCard & {
  personEmail: string | null;
  personPhone: string | null;
  orgAddress: string | null;
  products: DealProduct[];
  activities: Activity[];
  comments: Comment[];
  files: FileRow[];
  emails: EmailRow[];
  documents: DocumentRow[];
  history: DealHistory[];
};

export type DealProduct = {
  id: number;
  productId: number;
  name: string;
  sku: string | null;
  qty: number;
  discount: number;
  price: number;
  unit: string;
};

export type Lead = {
  id: number;
  title: string;
  personId: number | null;
  personName: string | null;
  personEmail: string | null;
  orgId: number | null;
  orgName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  ownerInitials: string | null;
  ownerTone: string | null;
  source: string;
  score: number;
  status: LeadStatus;
  labels: string | null;
  notes: string | null;
  createdAt: string;
};

export type Person = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  orgId: number | null;
  orgName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
  openDeals: number;
  dealValue: number;
  linkedin: string | null;
  enrichedAt: string | null;
  mobile: string | null;
  directDial: string | null;
};

export type Organization = {
  id: number;
  name: string;
  website: string | null;
  address: string | null;
  city: string | null;
  industry: string | null;
  ownerId: number | null;
  ownerName: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  peopleCount: number;
  openDeals: number;
  dealValue: number;
  employees: string | null;
  revenueBand: string | null;
  enrichedAt: string | null;
};

export type Activity = {
  id: number;
  type: string;
  subject: string;
  dealId: number | null;
  dealTitle: string | null;
  leadId: number | null;
  personId: number | null;
  personName: string | null;
  orgId: number | null;
  orgName: string | null;
  ownerId: number | null;
  ownerName: string | null;
  ownerInitials: string | null;
  ownerTone: string | null;
  dueAt: string | null;
  done: boolean;
  durationMin: number;
  location: string | null;
  notes: string | null;
  createdAt: string;
};

export type Product = {
  id: number;
  name: string;
  sku: string | null;
  category: string;
  unitPrice: number;
  unit: string;
  billing: string;
  description: string | null;
  active: boolean;
};

export type Project = {
  id: number;
  name: string;
  dealId: number | null;
  dealTitle: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  ownerId: number | null;
  ownerName: string | null;
  taskCount: number;
  doneCount: number;
  venue: string | null;
};

export type ProjectTask = {
  id: number;
  projectId: number;
  title: string;
  columnName: string;
  assigneeId: number | null;
  assigneeName: string | null;
  dueAt: string | null;
  sortOrder: number;
};

export type Comment = {
  id: number;
  entityType: string;
  entityId: number;
  authorId: number | null;
  authorName: string | null;
  authorInitials: string | null;
  authorTone: string | null;
  body: string;
  createdAt: string;
};

export type FileRow = {
  id: number;
  entityType: string;
  entityId: number;
  name: string;
  kind: string;
  sizeKb: number;
  uploadedBy: number | null;
  createdAt: string;
};

export type EmailRow = {
  id: number;
  folder: string;
  fromName: string;
  fromAddr: string;
  toAddr: string;
  subject: string;
  body: string;
  dealId: number | null;
  dealTitle: string | null;
  personId: number | null;
  opened: boolean;
  clicked: boolean;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
};

export type EmailTemplate = {
  id: number;
  name: string;
  subject: string;
  body: string;
};

export type DocumentRow = {
  id: number;
  name: string;
  dealId: number | null;
  dealTitle: string | null;
  template: string;
  status: string;
  content: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  signedAt: string | null;
  createdAt: string;
};

export type Automation = {
  id: number;
  name: string;
  active: boolean;
  triggerType: string;
  triggerDetail: string | null;
  actionType: string;
  actionDetail: string | null;
  conditions: string | null;
  runs: number;
};

export type Sequence = {
  id: number;
  name: string;
  active: boolean;
  steps: { day: number; channel: string; title: string }[];
  enrolled: number;
};

export type FormCondition = {
  fieldId: string;
  op: "eq" | "neq" | "contains" | "not_empty" | "empty";
  value?: string;
};

export type FormField = {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  step?: number;
  accept?: string;
  condition?: FormCondition | null;
};

export type FormStep = {
  id: string;
  title: string;
  description?: string;
  condition?: FormCondition | null;
};

export type WebForm = {
  id: number;
  name: string;
  slug: string;
  fields: FormField[];
  active: boolean;
  submissions: number;
};

export type ChatThread = {
  id: number;
  visitorName: string;
  visitorEmail: string | null;
  status: string;
  assigneeId: number | null;
  assigneeName: string | null;
  source: string;
  lastMessage: string | null;
  updatedAt: string;
  messages: ChatMessage[];
};

export type ChatMessage = {
  id: number;
  chatId: number;
  sender: string;
  body: string;
  createdAt: string;
};

export type Prospect = {
  id: number;
  name: string;
  industry: string | null;
  city: string | null;
  employees: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  added: boolean;
};

export type SchedulerLink = {
  id: number;
  memberId: number | null;
  memberName: string | null;
  name: string;
  durationMin: number;
  slug: string;
  bookings: number;
  source?: string;
  calendlyUrl?: string | null;
  locationKind?: string;
};

export type Booking = {
  id: number;
  linkId: number | null;
  guestName: string;
  guestEmail: string;
  startsAt: string;
  notes: string | null;
  status?: string;
  durationMin?: number;
  zoomJoinUrl?: string | null;
  zoomPasscode?: string | null;
  confirmationSentAt?: string | null;
  calendlyEventUri?: string | null;
  hostName?: string | null;
  linkName?: string | null;
  source?: string;
};

export type Notification = {
  id: number;
  memberId: number | null;
  kind: string;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export type AuditRow = {
  id: number;
  actor: string;
  action: string;
  entity: string;
  detail: string | null;
  ip: string | null;
  device: string | null;
  createdAt: string;
};

export type SecurityAlert = {
  id: number;
  severity: string;
  title: string;
  detail: string;
  resolved: boolean;
  createdAt: string;
};

export type SecurityRule = {
  id: number;
  name: string;
  detail: string;
  active: boolean;
};

export type Device = {
  id: number;
  memberName: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type Webhook = {
  id: number;
  url: string;
  event: string;
  active: boolean;
  lastStatus: string | null;
};

export type CustomField = {
  id: number;
  entity: string;
  name: string;
  fieldType: string;
  options: string | null;
  required: boolean;
  pipelineId: number | null;
};

export type ScoreModel = {
  id: number;
  name: string;
  entity: string;
  rules: { field: string; op: string; value: string; points: number }[];
  active: boolean;
};

export type MarketplaceApp = {
  id: number;
  name: string;
  category: string;
  description: string;
  connected: boolean;
};

export type CustomReport = {
  id: number;
  name: string;
  kind: string;
  config: Record<string, string | number | boolean>;
};

export type DealHistory = {
  id: number;
  dealId: number;
  actor: string;
  action: string;
  detail: string | null;
  createdAt: string;
};

export type Goal = {
  id: number;
  name: string;
  kind: string;
  target: number;
  current: number;
  periodStart: string;
  periodEnd: string;
  ownerId: number | null;
  ownerName: string | null;
  pipelineId: number | null;
  pipelineName: string | null;
};

export type VisibilityGroup = {
  id: number;
  name: string;
  detail: string;
  memberIds: number[];
};

export type PermissionSet = {
  id: number;
  name: string;
  detail: string;
  canExport: boolean;
  canDelete: boolean;
  canAdmin: boolean;
};

export type ApiToken = {
  id: number;
  name: string;
  tokenHint: string;
  scopes: string;
  lastUsed: string | null;
  createdAt: string;
  revoked: boolean;
};

export type ActivityType = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  active: boolean;
};

export type LostReason = {
  id: number;
  name: string;
  sortOrder: number;
  active: boolean;
};

export type LeadRoute = {
  id: number;
  source: string;
  ownerId: number | null;
  ownerName: string | null;
  teamId: number | null;
  active: boolean;
};

export type EmailAccount = {
  id: number;
  memberId: number | null;
  memberName: string | null;
  address: string;
  kind: string;
  synced: boolean;
  lastSync: string | null;
};

export type SequenceEnrollment = {
  id: number;
  sequenceId: number;
  personId: number;
  personName: string | null;
  stepIndex: number;
  status: string;
  enrolledAt: string;
};

export type ChatbotFlow = {
  id: number;
  name: string;
  active: boolean;
  steps: { id: string; prompt: string }[];
  conversations: number;
};

export type AccessPolicy = {
  hoursEnforced: boolean;
  officeStart: string;
  officeEnd: string;
  timezone: string;
  ipEnforced: boolean;
  ipAllowlist: string[];
  mfaRequired: boolean;
  idleMinutes: number;
  maxFailed: number;
  adminApproval: boolean;
  encryptionAtRest: boolean;
  exportApproval: boolean;
};

export type SessionContext = {
  locationLabel: string;
  ip: string;
  clockMode: "live" | "offhours";
  locked: boolean;
  failedAttempts: number;
};

export type AccessState = {
  policy: AccessPolicy;
  session: SessionContext;
  allowed: boolean;
  reason: string | null;
  hourLabel: string;
};

export type CalendarAccount = {
  id: number;
  memberId: number | null;
  memberName: string | null;
  provider: string;
  address: string;
  synced: boolean;
  twoWay: boolean;
  lastSync: string | null;
};

export type SandboxField = {
  id: number;
  entity: string;
  name: string;
  fieldType: string;
  required: boolean;
  promoted: boolean;
};

export type SandboxAutomation = {
  id: number;
  name: string;
  triggerType: string;
  triggerDetail: string | null;
  actionType: string;
  actionDetail: string | null;
  active: boolean;
  promoted: boolean;
};

export type MailBroadcast = {
  id: number;
  name: string;
  subject: string;
  body: string;
  audience: string;
  sentCount: number;
  opened: number;
  createdAt: string;
};

export type UsageSnapshot = {
  reports: number;
  fields: number;
  automations: number;
  teamInboxes: number;
  enrichmentRemaining: number;
  enrichmentUsed: number;
};

export type Insights = {
  openValue: number;
  wonValue: number;
  lostValue: number;
  weightedValue: number;
  winRate: number;
  avgDeal: number;
  openCount: number;
  wonCount: number;
  rottingCount: number;
  overdueActivities: number;
  byStage: { name: string; value: number; count: number }[];
  byOwner: { name: string; value: number; won: number }[];
  byMonth: { month: string; won: number; open: number }[];
  bySource: { name: string; value: number }[];
  activityWeek: { day: string; done: number; planned: number }[];
};

export type PulseItem = {
  id: string;
  kind: "rot" | "overdue" | "mention" | "won" | "lead";
  title: string;
  body: string;
  href: string;
  at: string;
};

export type Bootstrap = {
  members: Member[];
  pipelines: Pipeline[];
  products: Product[];
  lostReasons: LostReason[];
  activityTypes: ActivityType[];
};
