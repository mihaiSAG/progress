import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { connectDB } from "./db";
import { UserModel, Habit } from "./models";

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
