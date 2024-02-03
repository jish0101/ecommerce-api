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
const { PORT, BASE_URL, USER_ROLES } = require('./utils/globals');

const app = express();
const server = http.createServer(app);

connectDB();

// routes
const authRouter = require('./routers/auth/authRouter');
const refreshRouter = require('./routers/auth/refresh');
const userRouter = require('./routers/user/userRouter');
const User = require('./models/User/User');

app.set('view engine', 'ejs');
app.use(credentials);
app.use(cors(corsOptions));
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/refresh', refreshRouter);
app.use('/user', userRouter);

app.use(verifyJWT);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'views', 'apiHome.ejs'));
});

app.use(notFound);
app.use(schemaErrorHandler);
app.use(errorHandler);

mongoose.connection.once('open', async () => {
  await User.updateMany({}, { role: USER_ROLES.member });
  server.listen(PORT, () => log(`Server is running on URL => ${BASE_URL}`));
});
