import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db";
import { UserModel, Habit } from "./models";
import { IHabit } from "./data";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Get all users
app.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find().exec();
        res.json(users);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Get a specific user by ID
app.get("/users/:id", async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const user = await UserModel.findOne({ id: userId }).exec();
        if (user) {
            res.json(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Update a user's habit by habit ID
app.put("/users/:userId/habits/:habitId", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const habitId = req.params.habitId;
    const { name, points, lastUpdated } = req.body;

    try {
        const user = await UserModel.findOne({ id: userId }).exec();
        if (user) {
            // Find the habit by its ID
            const habit = user.habits.find((h: Habit) => h.id === habitId);
            if (habit) {
                if (name !== undefined) habit.name = name;
                if (points !== undefined) habit.points = points;
                if (lastUpdated !== undefined) habit.lastUpdated = new Date(lastUpdated);

                await user.save();
                res.json(habit);
            } else {
                res.status(404).send("Habit not found");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});
// Default habits to be initialized for each new user
const defaultHabits: IHabit[] = [
    { id: new mongoose.Types.ObjectId().toString(), name: "Exercise", points: 0, lastUpdated: new Date() },
    { id: new mongoose.Types.ObjectId().toString(), name: "Reading", points: 0, lastUpdated: new Date() },
];

// Register a new user
app.post("/register", async (req: Request, res: Response) => {
    const { name, pass } = req.body;

    if (!name || !pass) {
        return res.status(400).send("Name and password are required");
    }

    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ name }).exec();
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Create a new user with default habits
        const newUser = new UserModel({
            id: new mongoose.Types.ObjectId().toString(),
            name,
            pass,
            habits: defaultHabits,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Server error");
    }
});

// Increment habit points by 1
app.patch("/users/:userId/habits/:habitId/increment", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const habitId = req.params.habitId;

    try {
        // Find the user by ID
        const user = await UserModel.findOne({ id: userId }).exec();
        if (user) {
            // Find the habit by ID
            const habit = user.habits.find((h: Habit) => h.id === habitId);
            if (habit) {
                const now = new Date();
                const lastUpdated = new Date(habit.lastUpdated);

                // Check if 24 hours have passed since the last update
                const hoursPassed = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
                if (hoursPassed >= 24) {
                    // Increment the points
                    habit.points += 1;
                    habit.lastUpdated = now;

                    // Save the updated user
                    await user.save();
                    res.json(habit);
                } else {
                    res.status(400).send("Cannot increment. Less than 24 hours have passed since the last update.");
                }
            } else {
                res.status(404).send("Habit not found");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error incrementing habit points:", error);
        res.status(500).send("Server error");
    }
});

// Update habit name
app.patch("/users/:userId/habits/:habitId/name", async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const habitId = req.params.habitId;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send("New habit name is required");
    }

    try {
        // Find the user by ID
        const user = await UserModel.findOne({ id: userId }).exec();
        if (user) {
            // Find the habit by ID
            const habit = user.habits.find((h: Habit) => h.id === habitId);
            if (habit) {
                // Update the habit name
                habit.name = name;
                habit.lastUpdated = new Date();

                // Save the updated user
                await user.save();
                res.json(habit);
            } else {
                res.status(404).send("Habit not found");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error updating habit name:", error);
        res.status(500).send("Server error");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
