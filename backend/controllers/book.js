const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    const originalFilename = req.file.filename;
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error })
    );
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(404).json({ error });
       });
};

exports.findBestRatedBooks = (req, res, next) => {
    Book.find()
        .then(books => {
            books.sort(function(a, b){
                return b.averageRating - a.averageRating;
            });

            books = books.slice(0, 3);
            res.status(200).json(books)
        })
        .catch(error => res.status(404).json({ error }))
    ;
};

exports.findBookById = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }))
    ;
};

exports.findBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }))
    ;
};

exports.rateBook = (req, res, next) => {
    const rateObject = { ...req.body };

    delete rateObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            let hasRated = false;
            book.ratings.forEach(rate => {
                if (rate.userId === req.auth.userId) {
                    hasRated = true;
                }
            });

            if (hasRated == true) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                const rating = {
                    userId: req.auth.userId,
                    grade: rateObject.rating
                };
                const countRatings = book.ratings.push(rating);
                let newAverage = 0;

                book.ratings.forEach(rate => { newAverage = newAverage+rate.grade });
                newAverage = newAverage/countRatings;

                Book.updateOne({_id: req.params.id}, { ratings: book.ratings, averageRating: newAverage })
                    .then(() => res.status(200).json(book))
                    .catch(error => res.status(400).json({ error })
                );
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        })
    ;
};

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'Unauthorized request'});
            } else {
                if (req.file) {
                    const oldFilename = book.imageUrl.split("/images/")[1];
                    fs.unlink(`images/${oldFilename}`, (error) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log("Old media deleted");
                        }
                    });
                }

                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Objet modifié !'});
                    })
                    .catch(error => res.status(401).json({ error })
                );
            }
        })
        .catch((error) => {
            res.status(404).json({ error });
        })
    ;
};
