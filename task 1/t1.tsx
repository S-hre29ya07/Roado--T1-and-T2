type Timestamp = string; // ISO 8601 date string

interface UserDevice {
    logged_in: Timestamp;
    logged_out: Timestamp | null;
    lastSeenAt: Timestamp;
}

interface User {
    userId: string;
    devices: UserDevice[];
}

interface MonthlyUserStats {
    month: string; // YYYY-MM format
    loggedInUsers: Set<string>;
    activeUsers: Set<string>;
}

function getMonthlyLoggedInAndActiveUsers(users: User[], year: number, month: number): MonthlyUserStats {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month

    const startOfMonth = startDate.toISOString();
    const endOfMonth = endDate.toISOString();

    const loggedInUsers = new Set<string>();
    const activeUsers = new Set<string>();

    users.forEach(user => {
        let isLoggedIn = false;
        let isActive = false;

        user.devices.forEach(device => {
            const loggedIn = new Date(device.logged_in);
            const loggedOut = device.logged_out ? new Date(device.logged_out) : null;
            const lastSeenAt = new Date(device.lastSeenAt);

            // Check if user is logged in during the month
            if (loggedIn <= endDate && (!loggedOut || loggedOut >= startDate)) {
                isLoggedIn = true;
            }

            // Check if user is active during the month
            if (lastSeenAt >= startDate && lastSeenAt <= endDate) {
                isActive = true;
            }
        });

        if (isLoggedIn) {
            loggedInUsers.add(user.userId);
        }

        if (isActive) {
            activeUsers.add(user.userId);
        }
    });

    return {
        month: `${year}-${String(month).padStart(2, '0')}`,
        loggedInUsers,
        activeUsers,
    };
}

// Example usage
const users: User[] = [
    {
        userId: "user1",
        devices: [
            { logged_in: "2023-01-10T00:00:00Z", logged_out: null, lastSeenAt: "2023-05-15T10:00:00Z" },
            { logged_in: "2023-04-01T00:00:00Z", logged_out: null, lastSeenAt: "2023-04-20T10:00:00Z" }
        ]
    },
    {
        userId: "user2",
        devices: [
            { logged_in: "2023-03-10T00:00:00Z", logged_out: "2023-04-15T00:00:00Z", lastSeenAt: "2023-03-20T10:00:00Z" }
        ]
    }
];

const stats = getMonthlyLoggedInAndActiveUsers(users, 2023, 4); // April 2023
console.log(stats);

// Explanation of Code
// Data Structures:

// UserDevice: Represents a device a user logs in from, including login, logout, and last activity timestamps.
// User: Represents a user with an ID and a list of devices.
// MonthlyUserStats: Represents the monthly statistics, including sets of logged-in and active user IDs.
// getMonthlyLoggedInAndActiveUsers Function:

// Calculates the start and end dates for the specified month.
// Iterates over users and their devices to check if they were logged in or active during the specified month.
// Uses sets to collect unique user IDs for logged-in and active users.
// Example Usage: Demonstrates how to call the function with user data for a specific month and outputs the results.