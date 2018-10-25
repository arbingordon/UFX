var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    router = express.Router(),

    Listing = require("./models/listing");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test");

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection success!');
});

app.use('/', router);

// Get all Listings
router.route('/listings').get((req, res) => {
    Listing.find((err, listings) => {
        if (err)
            console.log(err);
        else
            res.json(listings);
    });
});

// Get a single Listing
router.route('/listings/:id').get((req, res) => {
    Listing.findById(req.params.id, (err, listing) => {
        if (err)
            console.log(err);
        else
            res.json(listing);
    });
});

// Add a Listing
router.route('/listings/add').post((req, res) => {
    let listing = new Listing(req.body);
    listing.save()
        .then(listing => {
            res.status(200).json({ 'listing': 'Added Successfully' });
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

// Update a Listing
router.route('/listings/update/:id').post((req, res, next) => {
    Listing.findById(req.params.id, (err, listing) => {
        if (!listing)
            return next(new Error('Could not load document'));
        else {
            listing.title = req.body.title;
            listing.price = req.body.price;
            listing.description = req.body.description;
            listing.category = req.body.category;

            listing.save().then(listing => {
                res.json('Update Complete');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

// Delete a Listing 
router.route('/listings/delete/:id').get((req, res) => {
    Listing.findByIdAndRemove({_id: req.params.id }, (err, listing) => {
      if (err)
        res.json(err);
      else
        res.json('Removed Successfully');
    });
  });


app.listen(4000, () => console.log('Running on port 4000'));