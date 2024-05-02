import app from './src/app/main/app.js';
import 'dotenv/config';

const PORT = process.env.PORT || 3002;

app.listen(PORT);
console.log('server running!!!', 3002);
