module.exports = [
"[project]/lib/mock-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/booking-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookingProvider",
    ()=>BookingProvider,
    "useBooking",
    ()=>useBooking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const BookingContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function BookingProvider({ children }) {
    const [bookings, setBookings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["bookings"]);
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["users"]);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifications"]);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const addBooking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((booking)=>{
        const newBooking = {
            ...booking,
            id: `booking-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setBookings((prev)=>[
                ...prev,
                newBooking
            ]);
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
        setNotifications((prev)=>[
                adminNotification,
                ...prev
            ]);
    }, []);
    const updateBookingStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((bookingId, status)=>{
        setBookings((prev)=>prev.map((booking)=>booking.id === bookingId ? {
                    ...booking,
                    status
                } : booking));
        // Find the booking to get user info
        const booking = bookings.find((b)=>b.id === bookingId);
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
            setNotifications((prev)=>[
                    userNotification,
                    ...prev
                ]);
        }
    }, [
        bookings
    ]);
    const addUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((user)=>{
        const newUser = {
            ...user,
            id: `user-${Date.now()}`
        };
        setUsers((prev)=>[
                ...prev,
                newUser
            ]);
    }, []);
    const removeUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((userId)=>{
        setUsers((prev)=>prev.filter((user)=>user.id !== userId));
    }, []);
    const markNotificationRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((notificationId)=>{
        setNotifications((prev)=>prev.map((notif)=>notif.id === notificationId ? {
                    ...notif,
                    read: true
                } : notif));
    }, []);
    const addNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((notification)=>{
        const newNotification = {
            ...notification,
            id: `notif-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setNotifications((prev)=>[
                newNotification,
                ...prev
            ]);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BookingContext.Provider, {
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
function useBooking() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(BookingContext);
    if (context === undefined) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
}
}),
"[project]/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$booking$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/booking-context.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$booking$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BookingProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 8,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/admin/layout.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers.tsx [app-ssr] (ecmascript)");
"use client";
;
;
function AdminLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Providers"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/app/admin/layout.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
];

//# sourceMappingURL=_ebd7c560._.js.map