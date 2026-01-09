(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/providers/query-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryProvider",
    ()=>QueryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@tanstack/react-query-devtools'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function QueryProvider({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "QueryProvider.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1
                    }
                }
            })
    }["QueryProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactQueryDevtools, {
                initialIsOpen: false
            }, void 0, false, {
                fileName: "[project]/lib/providers/query-provider.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/lib/providers/query-provider.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(QueryProvider, "imk3LCT+w+ZXi0YGvd+Wxxsv7kw=");
_c = QueryProvider;
var _c;
__turbopack_context__.k.register(_c, "QueryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// API Configuration
__turbopack_context__.s([
    "API_CONFIG",
    ()=>API_CONFIG
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_CONFIG = {
    BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:5060/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            REFRESH: '/auth/refresh',
            LOGOUT: '/auth/logout'
        },
        USERS: {
            BASE: '/users',
            BY_ID: (id)=>`/users/${id}`
        },
        SPACES: {
            BASE: '/spaces',
            BY_ID: (id)=>`/spaces/${id}`,
            BY_TYPE: (type)=>`/spaces?type=${type}`
        },
        BOOKINGS: {
            BASE: '/bookings',
            BY_ID: (id)=>`/bookings/${id}`,
            BY_STATUS: (status)=>`/bookings?status=${status}`
        },
        NOTIFICATIONS: {
            BASE: '/notifications',
            UNREAD: '/notifications/unread',
            UNREAD_COUNT: '/notifications/unread/count',
            BY_ID: (id)=>`/notifications/${id}`,
            MARK_READ: (id)=>`/notifications/${id}/read`,
            MARK_ALL_READ: '/notifications/read/all'
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "clearTokens",
    ()=>clearTokens,
    "getAccessToken",
    ()=>getAccessToken,
    "getRefreshToken",
    ()=>getRefreshToken,
    "handleApiError",
    ()=>handleApiError,
    "setTokens",
    ()=>setTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.config.ts [app-client] (ecmascript)");
;
;
// Token storage keys
const ACCESS_TOKEN_KEY = 'spacebook_access_token';
const REFRESH_TOKEN_KEY = 'spacebook_refresh_token';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false
});
// Request interceptor to add auth token
apiClient.interceptors.request.use((config)=>{
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor for token refresh
apiClient.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // If 401 and haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].BASE_URL}${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.AUTH.REFRESH}`, {
                    refreshToken
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                if (accessToken && newRefreshToken) {
                    setTokens(accessToken, newRefreshToken);
                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }
                    return apiClient(originalRequest);
                }
            }
        } catch (refreshError) {
            // Refresh failed, logout user
            clearTokens();
            if ("TURBOPACK compile-time truthy", 1) {
                window.location.href = '/user/login';
            }
            return Promise.reject(error); // Reject with original error
        }
    }
    return Promise.reject(error);
});
const setTokens = (accessToken, refreshToken)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
};
const getAccessToken = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    //TURBOPACK unreachable
    ;
};
const getRefreshToken = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    //TURBOPACK unreachable
    ;
};
const clearTokens = ()=>{
    if ("TURBOPACK compile-time truthy", 1) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};
const handleApiError = (error)=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error)) {
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        return Array.isArray(message) ? message.join(', ') : message || 'An error occurred';
    }
    return 'An unexpected error occurred';
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/services/auth.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.config.ts [app-client] (ecmascript)");
;
;
const authService = {
    async login (credentials) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.AUTH.LOGIN, credentials);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTokens"])(response.data.accessToken, response.data.refreshToken);
            return response.data;
        } catch (error) {
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error));
        }
    },
    async register (data) {
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.AUTH.REGISTER, data);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTokens"])(response.data.accessToken, response.data.refreshToken);
            return response.data;
        } catch (error) {
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error));
        }
    },
    async logout () {
        try {
            const refreshToken = localStorage.getItem('spacebook_refresh_token');
            if (refreshToken) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.AUTH.LOGOUT, {
                    refreshToken
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
        }
    },
    async refreshToken () {
        try {
            const refreshToken = localStorage.getItem('spacebook_refresh_token');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiClient"].post(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_CONFIG"].ENDPOINTS.AUTH.REFRESH, {
                refreshToken
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setTokens"])(response.data.accessToken, response.data.refreshToken);
            return response.data;
        } catch (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearTokens"])();
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleApiError"])(error));
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/providers/auth-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/auth.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Check if user is logged in on mount
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
            if (token) {
                // Token exists, but we need to validate it
                // For now, we'll just set loading to false
                // In a real app, you might want to fetch user data here
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login({
                email,
                password
            });
            setUser(response.user);
            // Redirect based on user role
            if (response.user.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/user/dashboard');
            }
        } catch (error) {
            throw error;
        }
    };
    const register = async (name, email, password, role)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].register({
                name,
                email,
                password,
                role
            });
            setUser(response.user);
            router.push('/user/dashboard');
        } catch (error) {
            throw error;
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setUser(null);
            router.push('/user/login');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isLoading,
            login,
            register,
            logout,
            setUser
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/providers/auth-provider.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "8WEfEbosx3NfLBPRVajZSQS3udc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$query$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/providers/query-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/providers/auth-provider.tsx [app-client] (ecmascript)");
"use client";
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$query$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/app/providers.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/user/layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers.tsx [app-client] (ecmascript)");
"use client";
;
;
function UserLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Providers"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/user/layout.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = UserLayout;
var _c;
__turbopack_context__.k.register(_c, "UserLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_baf75e41._.js.map