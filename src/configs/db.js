const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/inventory', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            serverSelectionTimeoutMS: 30000 // default 30 seconds
        }).then(() => {
            console.log('Connected to MongoDB');
        }).catch((err) => {
            console.error('Error connecting to MongoDB:', err);
        });
        console.log("MongoDB connected~");
    } catch (err) {
        console.log("Mongoose: ", err);
    }
}




