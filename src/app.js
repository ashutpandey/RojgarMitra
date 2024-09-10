import path from "path";
import express from "express";
import hbs from "hbs"
import bodyParser from "body-parser";
import userRouter from './routes/user.js'
import cookieParser from "cookie-parser";
import "./db/connection.js"
import { errorMiddleware } from "./middlewares/error.js";
import { isAuthenticated } from "./middlewares/auth.js";
import { extractUserFromToken } from "./middlewares/extractuser.js";
import { config } from "dotenv";

config()

// console.log(process.env.mongo_url)
const PORT = process.env.PORT;

const app = express();
const router = express.Router()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(extractUserFromToken);


// to get __dirname in es6
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)

app.use(express.static(static_path))


app.get('/', (req, res) => {
    const {token} = req.cookies;
    const isAuthenticated = token !== undefined;
    const user = req.user;
    const userName = user === null ? 'User 👨‍💼' : `${user.name} 👨‍💼`;
    res.render('index',{
        isAuthenticated:isAuthenticated,
        userName:userName
    })
})

app.get('/jobs', (req, res) => {
    const {token} = req.cookies;
    const isAuthenticated = token !== undefined;
    res.render('jobs',{
        isAuthenticated:isAuthenticated
    })
})

app.get('/searchjobs', isAuthenticated, (req, res) => {
    const {token} = req.cookies;
    const isAuthenticated = token !== undefined;
    res.render('searchjobs',{
        isAuthenticated:isAuthenticated
    })
})

app.get('/login', (req, res) => {
    const errorMessage = req.query.error || '';
    res.render('login', {
        errorMessage: `${errorMessage}`
    })
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/loginerr', (req, res) => {
    res.render('loginerr')
})

/***********************This is for post and get methods */
app.use("/api/v1/users", userRouter);
app.use(errorMiddleware)


app.get('*', (req, res) => {
    res.render('404err')
})



app.listen(PORT, () => {
    console.log(`listening to the port at ${PORT}`);
})