import express from 'express';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(orderRoutes);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening at http://localhost:${port}`);
});
