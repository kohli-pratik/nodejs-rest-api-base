const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const dropCollections = require('./commonMethods').dropCollections;

let testCategoryId = '';

describe('Testing Category API Calls', () => {
    afterAll((done) => {
        dropCollections(mongoose);
        done();
    });

    test('Create Category: should return 200 and _id', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .post('/categories')
            .send('name=Others');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        testCategoryId = response.body._id;
        done();
    });

    test('Get Category: should return 200 and _id', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .get(`/categories/${testCategoryId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        done();
    });

    test('Get All Categories: should return 200 and categories array', async (done) => {
        expect.assertions(2);
        const response = await request(app)
            .get('/categories');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        done();
    });

    test('Delete Category: should return 200', async (done) => {
        expect.assertions(1);
        const response = await request(app)
            .delete(`/categories/${testCategoryId}`);
        expect(response.status).toBe(200);
        done();
    });

    test('Delete All Categories: should return success or empty datastrore message', async (done) => {
        expect.assertions(1);
        const response = await request(app)
            .delete('/categories');
        if (response.status === 200) {
            expect(response.body.message).toBe('All categories successfully deleted');
        } else if (response.status === 404) {
            expect(response.body.message).toBe('No categories stored in the database');
        }
        done();
    });
});
