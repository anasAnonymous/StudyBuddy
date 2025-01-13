const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8000;

app.use(cors());

app.get('/api/home', (req, res) => {
    res.json({ message: "Welcome to the home page!", people: ["Saim", "sam", "altman"] });
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
