const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const {createTable} =require('./config/createTable');
const authRoutes=require('./routes/authRoutes');
const citizenRoutes=require('./routes/citizenRoutes');
const uploadRoutes=require('./routes/uploadRoutes');
const adminRoutes=require('./routes/adminRoutes');
// Middleware
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
createTable().then(()=>{
    console.log('table run logic ran successfully');
}).catch(error=>{
    console.log(error);
})

app.use('/api/auth',authRoutes);
app.use('/api/citizen',citizenRoutes);
app.use('/api/upload',uploadRoutes);
app.use('/api/admin',adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on 0.0.0.0:3000");
});

