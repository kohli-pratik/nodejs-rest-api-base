const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const dropCollections = require('./commonMethods').dropCollections;

let testProductId = '';

describe('Testing Product API Calls', () => {
    afterAll((done) => {
        dropCollections(mongoose);
        done();
    });

    test('Create Product: should return 200 and _id', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .post('/products')
            .attach('productImage', 'testFiles/coffee-mug-black.jpg')
            .field('name', 'coffee-mug-black')
            .field('price', '12.99');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        testProductId = response.body._id;
        done();
    });

    test('Get Product: should return 200 and _id', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .get(`/products/single/${testProductId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        done();
    });

    test('Get All Products: should return 200 and products array', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .get('/products');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
    });

    test('Update Product: should return 200 and _id', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .put(`/products/single/${testProductId}`)
            .attach('updatedProductImage', 'testFiles/coffee-mug-white-2.jpg')
            .attach('updatedProductImage', 'testFiles/coffee-mug-white-3.jpg')
            .field('name', 'coffee-mug-white')
            .field('price', '32.99');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        testProductId = response.body._id;
        done();
    });

    test('Delete Product: should return 200 and success message', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .delete(`/products/single/${testProductId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Product ${testProductId} successfully deleted`);
        done();
    });

    test('Get All Filtered Products: should return 200 and products array', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .get('/products/filtered');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
    });

    test('Get All Sorted Products: should return 200 and products array', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .get('/products/sorted');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
    });

    test('Delete All Products: should success or empty datastore message', async (done) => {
        expect.assertions(1);
        const response = await request(app)
            .delete('/products');
        if (response.status === 200) {
            expect(response.body.message).toBe('All products successfully deleted');
        } else if (response.status === 404) {
            expect(response.body.message).toBe('No products stored in the database');
        }
        done();
    });
});
