"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./db");
const models_1 = require("./models");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
// Connect to MongoDB
(0, db_1.connectDB)();
// Get all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.UserModel.find().exec();
        res.json(users);
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
// Get a specific user by ID
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield models_1.UserModel.findOne({ id: userId }).exec();
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
// Update a user's habit by habit ID
app.put("/users/:userId/habits/:habitId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const habitId = req.params.habitId;
    const { name, points, lastUpdated } = req.body;
    try {
        const user = yield models_1.UserModel.findOne({ id: userId }).exec();
        if (user) {
            // Find the habit by its ID
            const habit = user.habits.find((h) => h.id === habitId);
            if (habit) {
                if (name !== undefined)
                    habit.name = name;
                if (points !== undefined)
                    habit.points = points;
                if (lastUpdated !== undefined)
                    habit.lastUpdated = new Date(lastUpdated);
                yield user.save();
                res.json(habit);
            }
            else {
                res.status(404).send("Habit not found");
            }
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
// Default habits to be initialized for each new user
const defaultHabits = [
    { id: new mongoose_1.default.Types.ObjectId().toString(), name: "Exercise", points: 0, lastUpdated: new Date() },
    { id: new mongoose_1.default.Types.ObjectId().toString(), name: "Reading", points: 0, lastUpdated: new Date() },
];
// Register a new user
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, pass } = req.body;
    if (!name || !pass) {
        return res.status(400).send("Name and password are required");
    }
    try {
        // Check if user already exists
        const existingUser = yield models_1.UserModel.findOne({ name }).exec();
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        // Create a new user with default habits
        const newUser = new models_1.UserModel({
            id: new mongoose_1.default.Types.ObjectId().toString(),
            name,
            pass,
            habits: defaultHabits,
        });
        yield newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Server error");
    }
}));
app.patch("/users/:userId/habits/:habitId/increment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const habitId = req.params.habitId;
    try {
        // Find the user by ID
        const user = yield models_1.UserModel.findOne({ id: userId }).exec();
        if (user) {
            // Find the habit by ID
            const habit = user.habits.find((h) => h.id === habitId);
            if (habit) {
                // Increment the points
                habit.points += 1;
                habit.lastUpdated = new Date();
                // Save the updated user
                yield user.save();
                res.json(habit);
            }
            else {
                res.status(404).send("Habit not found");
            }
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        console.error("Error incrementing habit points:", error);
        res.status(500).send("Server error");
    }
}));
// Update habit name
app.patch("/users/:userId/habits/:habitId/name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const habitId = req.params.habitId;
    const { name } = req.body;
    if (!name) {
        return res.status(400).send("New habit name is required");
    }
    try {
        // Find the user by ID
        const user = yield models_1.UserModel.findOne({ id: userId }).exec();
        if (user) {
            // Find the habit by ID
            const habit = user.habits.find((h) => h.id === habitId);
            if (habit) {
                // Update the habit name
                habit.name = name;
                habit.lastUpdated = new Date();
                // Save the updated user
                yield user.save();
                res.json(habit);
            }
            else {
                res.status(404).send("Habit not found");
            }
        }
        else {
            res.status(404).send("User not found");
        }
    }
    catch (error) {
        console.error("Error updating habit name:", error);
        res.status(500).send("Server error");
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map