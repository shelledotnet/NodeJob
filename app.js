//#region Dependency
require('dotenv').config();//accessing the environment variables
require('express-async-errors');
//modules for catching unhandle errors with this i dont need try catch block e.g 500

//extra security measures
const helmet=require('helmet')
const cors=require('cors')
const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')


const express=require('express')
const PORT = process.env.PORT || 3500;
const connectDB=require('./db/connect')
const logger=require('./logger')
const authRoute=require('./routes/authRoute')
const jobRoute=require('./routes/jobRoute')
const morgan=require('morgan')
const responseHeader=require('./responseHeader')
const app=express()
const notFoundMiddlewear=require('./middlewear/not-found')
const errorHandlerMiddlewear=require('./middlewear/error-handler');
const authenticaionMiddleware=require('./middlewear/authMiddlewear')
const requestHeader = require('./requestHeader');
//#endregion

//#region  Middlewear
/*
Enable or add the below middlewear if you are behinde proxy servers..
(Heroku,bluemix,AWS,ELB,NGINX,IIS)
which is the case usually
*/
app.set('trust proxy', 1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
    )
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.use([requestHeader,responseHeader,logger]);
app.use(morgan('tiny'));//morgan('tiny')(':method :url :status :res[content-length] - :response-time ms')
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/jobs',authenticaionMiddleware,jobRoute);
app.use(notFoundMiddlewear);
app.use(errorHandlerMiddlewear);
//#endregion 

const start=async()=>{  //define or declear function
    try{
        await connectDB(process.env.MONGO_URI);
        console.log('CONNECTED TO DB')//we only want to stasrt the server if we have connection to the DB
        app.listen(PORT,console.log(`server listening at ${PORT}...`))
    }catch(error){
        console.log(error);
    }
}

start()  //invoke the function