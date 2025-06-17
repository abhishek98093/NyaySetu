const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const port = 3000;

app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
