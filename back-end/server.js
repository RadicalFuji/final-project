import express from 'express';
import path from 'path';

// Importing routers
import newsRouter from './routes/news/news.js';
import queriesRouter from './routes/queries/queries.js';
import usersRouter from './routes/users/users.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Using routers
app.use('/news', newsRouter);
app.use('/queries', queriesRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});