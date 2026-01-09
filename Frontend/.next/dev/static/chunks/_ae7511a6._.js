(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock data for the Sports & Event Space Booking Platform
__turbopack_context__.s([
    "bookings",
    ()=>bookings,
    "getBookingsByStatus",
    ()=>getBookingsByStatus,
    "getBookingsByUserId",
    ()=>getBookingsByUserId,
    "getNotificationsByUserId",
    ()=>getNotificationsByUserId,
    "getSpaceById",
    ()=>getSpaceById,
    "getSpaceTypeColor",
    ()=>getSpaceTypeColor,
    "getStatusColor",
    ()=>getStatusColor,
    "getUnreadNotificationsCount",
    ()=>getUnreadNotificationsCount,
    "getUserById",
    ()=>getUserById,
    "notifications",
    ()=>notifications,
    "spaces",
    ()=>spaces,
    "timeSlots",
    ()=>timeSlots,
    "users",
    ()=>users
]);
const spaces = [
    {
        id: "auditorium-1",
        name: "Main Auditorium",
        type: "auditorium",
        capacity: 500,
        description: "Large auditorium with state-of-the-art sound system and lighting",
        image: "/modern-auditorium-interior.jpg"
    },
    {
        id: "gym-1",
        name: "Multipurpose Gym",
        type: "gym",
        capacity: 200,
        description: "Versatile gymnasium suitable for basketball, volleyball, and events",
        image: "/indoor-gymnasium-sports-facility.jpg"
    },
    {
        id: "soccer-1",
        name: "Soccer Field A",
        type: "soccer",
        capacity: 50,
        description: "Professional-grade natural grass soccer field",
        image: "/soccer-field-at-sunset.jpg"
    },
    {
        id: "soccer-2",
        name: "Soccer Field B",
        type: "soccer",
        capacity: 50,
        description: "Synthetic turf field with lighting for night games",
        image: "/artificial-turf-soccer-field.png"
    },
    {
        id: "soccer-3",
        name: "Soccer Field C",
        type: "soccer",
        capacity: 40,
        description: "Training field ideal for practice sessions",
        image: "/soccer-training-field.jpg"
    },
    {
        id: "soccer-4",
        name: "Soccer Field D",
        type: "soccer",
        capacity: 40,
        description: "Indoor soccer field with climate control",
        image: "/indoor-soccer-field-arena.jpg"
    }
];
const users = [
    {
        id: "user-1",
        name: "John Smith",
        email: "john.smith@example.com",
        role: "user",
        status: "active",
        avatar: "/professional-man-avatar.png"
    },
    {
        id: "user-2",
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        role: "user",
        status: "active",
        avatar: "/professional-woman-avatar.png"
    },
    {
        id: "user-3",
        name: "Mike Davis",
        email: "mike.d@example.com",
        role: "user",
        status: "active",
        avatar: "/confident-businessman.png"
    },
    {
        id: "user-4",
        name: "Emily Chen",
        email: "emily.c@example.com",
        role: "user",
        status: "inactive",
        avatar: "/asian-woman-professional.png"
    },
    {
        id: "admin-1",
        name: "Admin User",
        email: "admin@spacebook.com",
        role: "admin",
        status: "active",
        avatar: "/admin-user-avatar.png"
    }
];
const bookings = [
    {
        id: "booking-1",
        userId: "user-1",
        spaceId: "auditorium-1",
        date: "2026-01-15",
        startTime: "09:00",
        endTime: "12:00",
        status: "approved",
        createdAt: "2026-01-05T10:00:00Z",
        notes: "Company annual meeting"
    },
    {
        id: "booking-2",
        userId: "user-2",
        spaceId: "gym-1",
        date: "2026-01-16",
        startTime: "14:00",
        endTime: "17:00",
        status: "pending",
        createdAt: "2026-01-08T14:30:00Z",
        notes: "Basketball tournament"
    },
    {
        id: "booking-3",
        userId: "user-1",
        spaceId: "soccer-1",
        date: "2026-01-17",
        startTime: "10:00",
        endTime: "12:00",
        status: "approved",
        createdAt: "2026-01-06T09:00:00Z"
    },
    {
        id: "booking-4",
        userId: "user-3",
        spaceId: "soccer-2",
        date: "2026-01-18",
        startTime: "16:00",
        endTime: "18:00",
        status: "rejected",
        createdAt: "2026-01-07T11:00:00Z",
        notes: "Soccer practice"
    },
    {
        id: "booking-5",
        userId: "user-2",
        spaceId: "auditorium-1",
        date: "2026-01-20",
        startTime: "13:00",
        endTime: "16:00",
        status: "pending",
        createdAt: "2026-01-09T08:00:00Z",
        notes: "Product launch event"
    },
    {
        id: "booking-6",
        userId: "user-3",
        spaceId: "gym-1",
        date: "2026-01-21",
        startTime: "08:00",
        endTime: "10:00",
        status: "approved",
        createdAt: "2026-01-04T15:00:00Z"
    },
    {
        id: "booking-7",
        userId: "user-1",
        spaceId: "soccer-3",
        date: "2026-01-22",
        startTime: "15:00",
        endTime: "17:00",
        status: "pending",
        createdAt: "2026-01-09T10:00:00Z"
    }
];
const notifications = [
    {
        id: "notif-1",
        userId: "admin-1",
        title: "New Booking Request",
        message: "Sarah Johnson requested the Multipurpose Gym",
        type: "booking_request",
        read: false,
        createdAt: "2026-01-09T08:00:00Z",
        bookingId: "booking-2"
    },
    {
        id: "notif-2",
        userId: "admin-1",
        title: "New Booking Request",
        message: "Sarah Johnson requested the Main Auditorium",
        type: "booking_request",
        read: false,
        createdAt: "2026-01-09T08:00:00Z",
        bookingId: "booking-5"
    },
    {
        id: "notif-3",
        userId: "admin-1",
        title: "New Booking Request",
        message: "John Smith requested Soccer Field C",
        type: "booking_request",
        read: true,
        createdAt: "2026-01-09T10:00:00Z",
        bookingId: "booking-7"
    },
    {
        id: "notif-4",
        userId: "user-1",
        title: "Booking Approved",
        message: "Your booking for Main Auditorium has been approved",
        type: "status_update",
        read: false,
        createdAt: "2026-01-06T12:00:00Z",
        bookingId: "booking-1"
    },
    {
        id: "notif-5",
        userId: "user-3",
        title: "Booking Rejected",
        message: "Your booking for Soccer Field B was rejected",
        type: "status_update",
        read: true,
        createdAt: "2026-01-08T09:00:00Z",
        bookingId: "booking-4"
    }
];
function getSpaceById(id) {
    return spaces.find((space)=>space.id === id);
}
function getUserById(id) {
    return users.find((user)=>user.id === id);
}
function getBookingsByUserId(userId) {
    return bookings.filter((booking)=>booking.userId === userId);
}
function getBookingsByStatus(status) {
    return bookings.filter((booking)=>booking.status === status);
}
function getNotificationsByUserId(userId) {
    return notifications.filter((notif)=>notif.userId === userId);
}
function getUnreadNotificationsCount(userId) {
    return notifications.filter((notif)=>notif.userId === userId && !notif.read).length;
}
function getSpaceTypeColor(type) {
    switch(type){
        case "auditorium":
            return "bg-auditorium";
        case "gym":
            return "bg-gym";
        case "soccer":
            return "bg-soccer";
        default:
            return "bg-primary";
    }
}
function getStatusColor(status) {
    switch(status){
        case "pending":
            return "bg-status-pending text-background";
        case "approved":
            return "bg-status-approved text-background";
        case "rejected":
            return "bg-status-rejected text-foreground";
        default:
            return "bg-muted text-muted-foreground";
    }
}
const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/booking-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingProvider",
    ()=>BookingProvider,
    "useBooking",
    ()=>useBooking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const BookingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BookingProvider({ children }) {
    _s();
    const [bookings, setBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bookings"]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["users"]);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifications"]);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const addBooking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookingProvider.useCallback[addBooking]": (booking)=>{
            const newBooking = {
                ...booking,
                id: `booking-${Date.now()}`,
                createdAt: new Date().toISOString()
            };
            setBookings({
                "BookingProvider.useCallback[addBooking]": (prev)=>[
                        ...prev,
                        newBooking
                    ]
            }["BookingProvider.useCallback[addBooking]"]);
            // Add notification for admin
            const adminNotification = {
                id: `notif-${Date.now()}`,
                userId: "admin-1",
                title: "New Booking Request",
                message: `New booking request for ${booking.spaceId}`,
                type: "booking_request",
                read: false,
                createdAt: new Date().toISOString(),
                bookingId: newBooking.id
            };
            setNotifications({
                "BookingProvider.useCallback[addBooking]": (prev)=>[
                        adminNotification,
                        ...prev
                    ]
            }["BookingProvider.useCallback[addBooking]"]);
        }
    }["BookingProvider.useCallback[addBooking]"], []);
    const updateBookingStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookingProvider.useCallback[updateBookingStatus]": (bookingId, status)=>{
            setBookings({
                "BookingProvider.useCallback[updateBookingStatus]": (prev)=>prev.map({
                        "BookingProvider.useCallback[updateBookingStatus]": (booking)=>booking.id === bookingId ? {
                                ...booking,
                                status
                            } : booking
                    }["BookingProvider.useCallback[updateBookingStatus]"])
            }["BookingProvider.useCallback[updateBookingStatus]"]);
            // Find the booking to get user info
            const booking = bookings.find({
                "BookingProvider.useCallback[updateBookingStatus].booking": (b)=>b.id === bookingId
            }["BookingProvider.useCallback[updateBookingStatus].booking"]);
            if (booking) {
                const userNotification = {
                    id: `notif-${Date.now()}`,
                    userId: booking.userId,
                    title: status === "approved" ? "Booking Approved" : "Booking Rejected",
                    message: `Your booking has been ${status}`,
                    type: "status_update",
                    read: false,
                    createdAt: new Date().toISOString(),
                    bookingId
                };
                setNotifications({
                    "BookingProvider.useCallback[updateBookingStatus]": (prev)=>[
                            userNotification,
                            ...prev
                        ]
                }["BookingProvider.useCallback[updateBookingStatus]"]);
            }
        }
    }["BookingProvider.useCallback[updateBookingStatus]"], [
        bookings
    ]);
    const addUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookingProvider.useCallback[addUser]": (user)=>{
            const newUser = {
                ...user,
                id: `user-${Date.now()}`
            };
            setUsers({
                "BookingProvider.useCallback[addUser]": (prev)=>[
                        ...prev,
                        newUser
                    ]
            }["BookingProvider.useCallback[addUser]"]);
        }
    }["BookingProvider.useCallback[addUser]"], []);
    const removeUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookingProvider.useCallback[removeUser]": (userId)=>{
            setUsers({
                "BookingProvider.useCallback[removeUser]": (prev)=>prev.filter({
                        "BookingProvider.useCallback[removeUser]": (user)=>user.id !== userId
                    }["BookingProvider.useCallback[removeUser]"])
            }["BookingProvider.useCallback[removeUser]"]);
        }
    }["BookingProvider.useCallback[removeUser]"], []);
    const markNotificationRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookingProvider.useCallback[markNotificationRead]": (notificationId)=>{
            setNotifications({
                "BookingProvider.useCallback[markNotificationRead]": (prev)=>prev.map({
                        "BookingProvider.useCallback[markNotificationRead]": (notif)=>notif.id === notificationId ? {
                                ...notif,
                                read: true
                            } : notif
                    }["BookingProvider.useCallback[markNotificationRead]"])
            }["BookingProvider.useCallback[markNotificationRead]"]);
        }
    }["BookingProvider.useCallback[markNotificationRead]"], []);
    const addNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookingProvider.useCallback[addNotification]": (notification)=>{
            const newNotification = {
                ...notification,
                id: `notif-${Date.now()}`,
                createdAt: new Date().toISOString()
            };
            setNotifications({
                "BookingProvider.useCallback[addNotification]": (prev)=>[
                        newNotification,
                        ...prev
                    ]
            }["BookingProvider.useCallback[addNotification]"]);
        }
    }["BookingProvider.useCallback[addNotification]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BookingContext.Provider, {
        value: {
            bookings,
            users,
            notifications,
            currentUser,
            setCurrentUser,
            addBooking,
            updateBookingStatus,
            addUser,
            removeUser,
            markNotificationRead,
            addNotification
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/booking-context.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(BookingProvider, "aC484+J5WnXIsTyfdQC5NnINPm0=");
_c = BookingProvider;
function useBooking() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(BookingContext);
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
}
_s1(useBooking, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "BookingProvider");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$booking$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/booking-context.tsx [app-client] (ecmascript)");
"use client";
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$booking$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookingProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 8,
        columnNumber: 10
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
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_ae7511a6._.js.map