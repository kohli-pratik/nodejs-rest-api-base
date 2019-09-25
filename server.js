const app = require('./app');

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`RESTful API server started on: ${port}`));
