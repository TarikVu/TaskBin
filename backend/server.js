const express = require('express');
const app = express();

// Used for serving static files or for handling file paths
const path = require('path');

const PORT = process.env.PORT || 3500;

// ------- MOUNTING MIDDLEWARE --------
// These will now have access to req, res and next objects. 
/* app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); */

// ------- MOUNTING ROUTE HANDLERS --------
app.use('/', require('./routes/root'));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));