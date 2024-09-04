export interface IHabit {
    id: string; // Unique identifier for each habit
    name: string;
    points: number;
    lastUpdated: Date;
}

export interface IUser {
    id: string; // Unique identifier for each user
    name: string;
    pass: string;
    habits: IHabit[];
}

export const users: IUser[] = [
    {
        id: "1",
        name: "Mishu",
        pass: "password123",
        habits: [
            { id: "101", name: "Exercise", points: 10, lastUpdated: new Date() },
            { id: "102", name: "Reading", points: 5, lastUpdated: new Date() }
        ]
    },
    {
        id: "2",
        name: "Popel",
        pass: "password456",
        habits: [
            { id: "201", name: "Meditation", points: 8, lastUpdated: new Date() },
            { id: "202", name: "Journaling", points: 7, lastUpdated: new Date() }
        ]
    }
];
