
const mongoose = require('mongoose'),
    request = require('supertest'),
    app = require('../../app'),
    testUsers = require('./testData').users,
    Constants = require('../utils/constants');

describe('Testing User API Calls', () => {
    afterAll(done => {
        const collections = mongoose.connection.collections;
        Object.keys(collections).forEach(key => {
            mongoose.connection.dropCollection(key, () => { });
        });
        done();
    });

    testUsers.forEach(testUser => {
        let testUserId = '';
        let testAccessToken = '';

        describe(`User permission level: ${testUser.permissionLevel}`, () => {
            test('Create User: should return 200 and _id', async (done) => {
                expect.assertions(2);
                const response = await request(app)
                    .post('/users')
                    .send(testUser);
                expect(response.statusCode).toEqual(201);
                expect(response.body).toHaveProperty('_id');
                testUserId = response.body._id;
                done();
            });

            test('User Authentication: should return 200 and tokens', async (done) => {
                expect.assertions(3);
                const response = await request(app)
                    .post('/auth')
                    .send({ email: testUser.email, password: testUser.password });
                expect(response.statusCode).toEqual(201);
                expect(response.body).toHaveProperty('accessToken');
                expect(response.body).toHaveProperty('refreshToken');
                testAccessToken = response.body.accessToken;
                done();
            });

            test('Get User: should return 200 and _id', async (done) => {
                expect.assertions(2);
                const response = await request(app)
                    .get(`/users/${testUserId}`)
                    .set('Authorization', `Bearer ${testAccessToken}`);
                expect(response.statusCode).toEqual(200);
                expect(response.body).toHaveProperty('_id');
                done();
            });

            const getAllDes = (testUser.permissionLevel === Constants.permissionLevels.ADMIN)
                ? 'should return 200 and users array'
                : 'should return 403';
            test(`Get All Users: ${getAllDes}`, async (done) => {
                const response = await request(app)
                    .get('/users')
                    .set('Authorization', `Bearer ${testAccessToken}`);

                if (testUser.permissionLevel === Constants.permissionLevels.ADMIN) {
                    expect.assertions(2);
                    expect(response.statusCode).toEqual(200);
                    expect(response.body).toBeInstanceOf(Array)
                } else {
                    expect.assertions(1);
                    expect(response.statusCode).toEqual(403);
                }
                done();
            });

            test('Update User: should return 200 and _id', async (done) => {
                expect.assertions(2);
                const response = await request(app)
                    .put(`/users/${testUserId}`)
                    .set('Authorization', `Bearer ${testAccessToken}`)
                    .send({ email: `${testUser.firstName}.${testUser.lastName}-updated@test.com` });
                expect(response.statusCode).toEqual(200);
                expect(response.body).toHaveProperty('_id');
                done();
            });

            const deleteDes = (testUser.permissionLevel === Constants.permissionLevels.ADMIN)
                ? 'should return 200'
                : 'should return 403';
            test(`Delete User: ${deleteDes}`, async (done) => {
                expect.assertions(1);
                const response = await request(app)
                    .delete(`/users/${testUserId}`)
                    .set('Authorization', `Bearer ${testAccessToken}`);
                (testUser.permissionLevel === Constants.permissionLevels.ADMIN)
                    ? expect(response.statusCode).toEqual(200)
                    : expect(response.statusCode).toEqual(403);
                done();
            });
        });
    });
});