const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors');
const userRoutes = require('./Users/userRoutes');
const shiftsRoutes = require('./Shifts/shiftsRouters');
const commentRouter = require('./Comments/commentsRoutes');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'})


const expressSanitize = require('express-mongo-sanitize');

app.use(express.json());

app.use(expressSanitize());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/shifts', shiftsRoutes);
app.use('/api/comment', commentRouter);

// route for page not found
app.all("*", (request, response, next) =>{
    return response.status(404).json({
        status: 'Failed',
        message:  `Page Not Found for route: ${request.originalUrl}.`
    })
})


mongoose.connect(process.env.STR_MONGO)
.then((connect) =>{
    console.log("MongoDB connected");
}).catch((err) =>{
    console.log('Connection error', err.message);
})

app.listen(process.env.PORT || 2000, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

