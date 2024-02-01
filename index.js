require('dotenv').config();
// require('express-async-errors');
const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { log } = require('console');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler, schemaErrorHandler } = require('./middlewares/errorHandler');
const credentials = require('./middlewares/credentials');
const corsOptions = require('./utils/corsOptions');
const connectDB = require('./utils/dbConnect');
const verifyJWT = require('./middlewares/verifyJWT');
const { PORT, BASE_URL } = require('./utils/globals');

const app = express();
const server = http.createServer(app);

connectDB();

// routes
const userRouter = require('./routers/users/usersRouter');
const authRouter = require('./routers/auth/authRouter');
const refreshRouter = require('./routers/auth/refresh');

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(credentials);
app.use(cors(corsOptions));
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'views', 'apiHome.ejs'));
});

app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use(verifyJWT);
app.use('/users', userRouter);

// app.use(schemaErrorHandler);
// app.use(notFound);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  server.listen(PORT, () => log(`Server is running on URL => ${BASE_URL}:${PORT}`));
});
