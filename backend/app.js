const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bookRoutes = require('./routes/book');

mongoose.connect('mongodb+srv://root:toortoor@monvieuxgrimoire.ndwjlwp.mongodb.net/?retryWrites=true&w=majority&appName=MonVieuxGrimoire',
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !')
);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/book', bookRoutes);

module.exports = app;
