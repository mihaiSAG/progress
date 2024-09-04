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
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map