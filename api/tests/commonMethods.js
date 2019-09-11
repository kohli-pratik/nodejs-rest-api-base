const dropCollections = (mongoose) => {
    const collections = mongoose.connection.collections;
    Object.keys(collections).forEach(key => {
        mongoose.connection.dropCollection(key, () => { });
    });
}

module.exports = {
    'dropCollections': dropCollections
};