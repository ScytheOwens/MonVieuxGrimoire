const mongoose = require('mongoose');

const rateSchema = mongoose.Schema({
    userId: { type: String, required: true},
    grade: { type: Number, required: true},
})

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true},
    title: { type: String, required: true},
    author: { type: String, required: true},
    imageUrl: { type: String, required: true},
    year: { type: Number, required: true},
    genre: { type: String, required: true},
    ratings: [rateSchema],
    averageRating: { type: Number },
});

module.exports = mongoose.model('Book', bookSchema);
