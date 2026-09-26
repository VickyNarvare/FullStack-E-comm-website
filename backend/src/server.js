import app from './app/app.js';
import { dbConnect } from './config/db.config.js';
import { env } from './config/env.config.js';

await dbConnect();
app.listen(env.port, () => {
  console.log('server runnning on port :', env.port);
});
