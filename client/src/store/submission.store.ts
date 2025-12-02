// src/store/submission.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "@/lib/apiClient";

/* 
!IMPORTANT prefix is /submission for all routes below:
router.get('/', getAllUserSubmissions);

 Get single submission by ID
router.get('/submission/:submissionId', validateRequest('submissionId'), getSubmissionById);

 Delete single submission
router.delete('/submission/:submissionId', validateRequest('submissionId'), deleteSubmission);

 Project-specific submission routes
router.get('/project/:projectId', validateRequest('projectId'), 
getSubmissionsByProject);

router.get('/project/:projectId/analytics', validateRequest('projectId'), 
getSubmissionAnalytics);

router.get('/project/:projectId/export', validateRequest('projectId'), exportSubmissions);
*/

export type Submission = {
	_id?: string; // present in list endpoints (aggregate/find)
	id?: string; // may be present depending on toJSON usage
	projectId?: string; // ObjectId string in list endpoints
	fields: Record<string, any>;
	origin?: string;
	ipAddress?: string;
	userAgent?: string;
	createdAt: string | Date;
	updatedAt: string | Date;
	project?: { name: string; projectId: string; id?: string };
};

export type Pagination = {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

export type SortOrder = "asc" | "desc";

export type ProjectMeta = { id: string; name: string; projectId: string };

type ProjectBucket = {
	items: Submission[];
	pagination: Pagination | null;
	loading: boolean;
	error: string | null;
	// query state
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: SortOrder;
	startDate?: string;
	endDate?: string;
	meta?: ProjectMeta | null;
};

type AllBucket = {
	items: Submission[];
	projects: Array<{ _id: string; name: string; projectId: string }>;
	pagination: Pagination | null;
	loading: boolean;
	error: string | null;
	// query state
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: SortOrder;
	startDate?: string;
	endDate?: string;
	projectId?: string; // optional filter (ObjectId string per controller)
};

type AnalyticsPayload = {
	totalSubmissions: number;
	periodSubmissions: number;
	period: string; // '7d' | '30d' | '90d' | '1y'
	dailyStats: Array<{ _id: string; count: number }>;
	topOrigins: Array<{ _id: string; count: number }>;
	fieldStats: Array<{ _id: string; count: number }>;
};

type AnalyticsBucket = {
	loading: boolean;
	error: string | null;
	data: AnalyticsPayload | null;
};

type SubmissionsStore = {
	byProject: Record<string, ProjectBucket>;
	all: AllBucket;
	analytics: Record<string, AnalyticsBucket>; // key = `${projectId}|${period}`
	exporting: boolean;
	error: string | null;

	// actions
	fetchProjectSubmissions: (
		projectId: string,
		opts?: Partial<
			Pick<
				ProjectBucket,
				"page" | "limit" | "sortBy" | "sortOrder" | "startDate" | "endDate"
			>
		>
	) => Promise<{
		submissions: Submission[];
		pagination: Pagination;
		project: ProjectMeta;
	}>;

	fetchAllSubmissions: (
		opts?: Partial<
			Pick<
				AllBucket,
				| "page"
				| "limit"
				| "sortBy"
				| "sortOrder"
				| "startDate"
				| "endDate"
				| "projectId"
			>
		>
	) => Promise<{
		submissions: Submission[];
		projects: AllBucket["projects"];
		pagination: Pagination;
	}>;

	fetchSubmissionById: (submissionId: string) => Promise<Submission>;

	deleteSubmission: (submissionId: string) => Promise<true>;

	fetchAnalytics: (
		projectId: string,
		period?: "7d" | "30d" | "90d" | "1y"
	) => Promise<AnalyticsPayload>;

	exportSubmissions: (
		projectId: string,
		params?: {
			format?: "csv" | "json";
			startDate?: string;
			endDate?: string;
			filename?: string;
		}
	) => Promise<void>;

	// helpers
	setProjectQuery: (projectId: string, query: Partial<ProjectBucket>) => void;
	setAllQuery: (query: Partial<AllBucket>) => void;
	clearProjectCache: (projectId: string) => void;
	clearAllCache: () => void;
};

const defaultsProject = (): ProjectBucket => ({
	items: [],
	pagination: null,
	loading: false,
	error: null,
	page: 1,
	limit: 10,
	sortBy: "createdAt",
	sortOrder: "desc",
	startDate: undefined,
	endDate: undefined,
	meta: null,
});

const defaultsAll = (): AllBucket => ({
	items: [],
	projects: [],
	pagination: null,
	loading: false,
	error: null,
	page: 1,
	limit: 10,
	sortBy: "createdAt",
	sortOrder: "desc",
	startDate: undefined,
	endDate: undefined,
	projectId: undefined,
});

const useSubmissionStore = create<SubmissionsStore>()(
	persist(
		(set, get) => ({
			byProject: {},
			all: defaultsAll(),
			analytics: {},
			exporting: false,
			error: null,

			setProjectQuery: (projectId, query) =>
				set((state) => {
					const bucket = state.byProject[projectId] ?? defaultsProject();
					return {
						byProject: {
							...state.byProject,
							[projectId]: { ...bucket, ...query },
						},
					};
				}),

			setAllQuery: (query) =>
				set((state) => ({ all: { ...state.all, ...query } })),

			clearProjectCache: (projectId) =>
				set((state) => {
					const next = { ...state.byProject };
					delete next[projectId];
					return { byProject: next };
				}),

			clearAllCache: () => set({ all: defaultsAll() }),

			// GET /projects/:projectId/submissions
			async fetchProjectSubmissions(projectId, opts) {
				const bucket = get().byProject[projectId] ?? defaultsProject();
				const q = { ...bucket, ...(opts ?? {}) };
				set((state) => ({
					byProject: {
						...state.byProject,
						[projectId]: { ...bucket, loading: true, error: null, ...opts },
					},
				}));
				try {
					const { data: resp } = await apiClient.get(
						`/submissions/project/${projectId}`,
						{
							params: {
								page: q.page,
								limit: q.limit,
								sortBy: q.sortBy,
								sortOrder: q.sortOrder,
								startDate: q.startDate,
								endDate: q.endDate,
							},
						}
					);
					const payload = resp.data as {
						submissions: Submission[];
						project: ProjectMeta;
						pagination: Pagination;
					};
					set((state) => ({
						byProject: {
							...state.byProject,
							[projectId]: {
								...state.byProject[projectId],
								items: payload.submissions ?? [],
								pagination: payload.pagination ?? null,
								loading: false,
								error: null,
								meta: payload.project ?? null,
								// keep existing query fields
								page: q.page,
								limit: q.limit,
								sortBy: q.sortBy,
								sortOrder: q.sortOrder,
								startDate: q.startDate,
								endDate: q.endDate,
							},
						},
					}));
					return {
						submissions: payload.submissions,
						pagination: payload.pagination,
						project: payload.project,
					};
				} catch (e: any) {
					const message =
						e?.response?.data?.message || "Failed to fetch project submissions";
					set((state) => ({
						byProject: {
							...state.byProject,
							[projectId]: {
								...(state.byProject[projectId] ?? bucket),
								loading: false,
								error: message,
							},
						},
						error: message,
					}));
					throw new Error(message);
				}
			},

			// GET /submissions
			async fetchAllSubmissions(opts) {
				const q = { ...get().all, ...(opts ?? {}) };
				set({ all: { ...q, loading: true, error: null } });
				try {
					const { data: resp } = await apiClient.get(`/submissions`, {
						params: {
							page: q.page,
							limit: q.limit,
							sortBy: q.sortBy,
							sortOrder: q.sortOrder,
							startDate: q.startDate,
							endDate: q.endDate,
							projectId: q.projectId, // controller expects ObjectId string for filter
						},
					});
					const payload = resp.data as {
						submissions: Submission[];
						projects: Array<{ _id: string; name: string; projectId: string }>;
						pagination: Pagination;
					};
					set({
						all: {
							...q,
							items: payload.submissions ?? [],
							projects: payload.projects ?? [],
							pagination: payload.pagination ?? null,
							loading: false,
							error: null,
						},
					});
					return {
						submissions: payload.submissions,
						projects: payload.projects,
						pagination: payload.pagination,
					};
				} catch (e: any) {
					const message =
						e?.response?.data?.message || "Failed to fetch submissions";
					set({
						all: { ...q, loading: false, error: message },
						error: message,
					});
					throw new Error(message);
				}
			},

			// GET /submissions/:submissionId
			async fetchSubmissionById(submissionId) {
				try {
					const { data: resp } = await apiClient.get(
						`/submissions/${submissionId}`
					);
					return resp.data as Submission;
				} catch (e: any) {
					const message =
						e?.response?.data?.message || "Failed to fetch submission";
					set({ error: message });
					throw new Error(message);
				}
			},

			// DELETE /submissions/:submissionId
			async deleteSubmission(submissionId) {
				try {
					const { status } = await apiClient.delete(
						`/submissions/${submissionId}`
					);
					if (status < 200 || status >= 300)
						throw new Error("Failed to delete submission");

					// remove from all caches
					set((state) => {
						const stripFrom = (items: Submission[]) =>
							items.filter(
								(s) => s._id !== submissionId && (s as any).id !== submissionId
							);
						const byProject = Object.fromEntries(
							Object.entries(state.byProject).map(([pid, b]) => [
								pid,
								{ ...b, items: stripFrom(b.items) },
							])
						);
						const all = { ...state.all, items: stripFrom(state.all.items) };
						return { byProject, all };
					});

					return true;
				} catch (e: any) {
					const message =
						e?.response?.data?.message || "Failed to delete submission";
					set({ error: message });
					throw new Error(message);
				}
			},

			// POST /projects/:projectId/submission

			// GET /projects/:projectId/submissions/analytics?period=7d
			async fetchAnalytics(projectId, period = "7d") {
				const key = `${projectId}|${period}`;
				set((state) => ({
					analytics: {
						...state.analytics,
						[key]: {
							...(state.analytics[key] ?? {
								loading: false,
								error: null,
								data: null,
							}),
							loading: true,
							error: null,
						},
					},
				}));
				try {
					const { data: resp } = await apiClient.get(
						`/submissions/project/${projectId}/analytics`,
						{
							params: { period },
						}
					);
					const payload = (resp.data?.analytics ??
						resp.data) as AnalyticsPayload;
					set((state) => ({
						analytics: {
							...state.analytics,
							[key]: {
								...(state.analytics[key] ?? {
									loading: false,
									error: null,
									data: null,
								}),
								loading: false,
								error: null,
								data: payload,
							},
						},
					}));
					return payload;
				} catch (e: any) {
					const message =
						e?.response?.data?.message || "Failed to fetch analytics";
					set((state) => ({
						analytics: {
							...state.analytics,
							[key]: {
								...(state.analytics[key] ?? {
									loading: false,
									error: null,
									data: null,
								}),
								loading: false,
								error: message,
								data: null,
							},
						},
						error: message,
					}));
					throw new Error(message);
				}
			},

			// GET /projects/:projectId/submissions/export?format=csv|json&startDate&endDate
			async exportSubmissions(projectId, params) {
				set({ exporting: true });
				try {
					const format = params?.format ?? "csv";
					const { data, headers } = await apiClient.get(
						`/submissions/project/${projectId}/export`,
						{
							params: {
								format,
								startDate: params?.startDate,
								endDate: params?.endDate,
							},
							responseType: "blob",
						}
					);

					// derive filename from header or fallback
					const cd = headers["content-disposition"] as string | undefined;
					const headerName = cd && /filename="?([^"]+)"?/.exec(cd)?.[1];
					const filename =
						params?.filename ??
						headerName ??
						`submissions_${projectId}_${new Date()
							.toISOString()
							.slice(0, 10)}.${format}`;

					const blob = new Blob([data], {
						type: format === "json" ? "application/json" : "text/csv",
					});
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
					a.remove();
					window.URL.revokeObjectURL(url);
				} catch (e: any) {
					const message =
						e?.response?.data?.message || "Failed to export submissions";
					set({ error: message });
					throw new Error(message);
				} finally {
					set({ exporting: false });
				}
			},
		}),
		{
			name: "submissions-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				// persist only lightweight query/cache slices
				byProject: Object.fromEntries(
					Object.entries(state.byProject).map(([k, v]) => [
						k,
						{
							items: v.items.slice(0, 50), // cap persisted items
							pagination: v.pagination,
							page: v.page,
							limit: v.limit,
							sortBy: v.sortBy,
							sortOrder: v.sortOrder,
							startDate: v.startDate,
							endDate: v.endDate,
							meta: v.meta,
							loading: false,
							error: null,
						},
					])
				),
				all: {
					...state.all,
					items: state.all.items.slice(0, 50), // cap persisted items
					loading: false,
					error: null,
				},
			}),
		}
	)
);

export default useSubmissionStore;
