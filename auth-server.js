const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());


const users = [];


app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;


    const hashedPassword = await bcrypt.hash(password, 10);


    users.push({ email, password: hashedPassword });
    res.json({ message: "User registered successfully!" });
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;


    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: "User not found!" });


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password!" });


    res.json({ message: "Login successful! Welcome back." });
});

app.listen(3000, () => console.log("Auth Server running on port 3000"));