import app from './app';
import { config } from './config';

app.listen(config.http.port, () => {
  console.log(`Server listening on port ${config.http.port}`);
});
