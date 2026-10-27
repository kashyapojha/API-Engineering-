
const express = require("express");

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const API_BASE_URL = new URL(
    process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com"
);

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
    throw new Error("PORT must be an integer between 0 and 65535.");
}

if (
    !["http:", "https:"].includes(API_BASE_URL.protocol) ||
    API_BASE_URL.pathname !== "/" ||
    API_BASE_URL.search ||
    API_BASE_URL.hash
) {
    throw new Error("API_BASE_URL must be an HTTP(S) origin without a path, query, or fragment.");
}

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Engineering application is running!"
    });
});

// GET request to an external API
app.get("/api/posts", async (req, res) => {
    try {
        const response = await fetch(new URL("/posts/1", API_BASE_URL));

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "External API request failed"
            });
        }

        const data = await response.json();

        res.json({
            success: true,
            post: data
        });

    } catch (error) {
        console.error("GET /api/posts failed:", error);
        res.status(502).json({
            success: false,
            message: "Could not connect to external API"
        });
    }
});


app.post("/api/posts", async (req, res) => {
    try {
        const { title, body, userId } = req.body;

        const response = await fetch(
            new URL("/posts", API_BASE_URL),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    body,
                    userId
                })
            }
        );

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "External API request failed"
            });
        }

        const data = await response.json();

        res.status(201).json({
            success: true,
            message: "Post submitted successfully",
            post: data
        });

    } catch (error) {
        console.error("POST /api/posts failed:", error);
        res.status(502).json({
            success: false,
            message: "Could not connect to external API"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
