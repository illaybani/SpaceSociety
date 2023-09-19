
/* *****************************************
there are more routes, but they cannot be tested here because the data in that routes is received from user token.
    we tested them directly from the website and they all work
    
    ***************************************** */

const fetch = require('node-fetch');
const assert = require('chai').assert;
const baseURL_users = 'http://localhost:8181/api/users';
const baseURL_cards = 'http://localhost:8181/api/cards';


describe('cards routes', () => {

    it('should get all cards', async () => {
        const response = await fetch(`${baseURL_cards}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        assert.equal(response.status, 200);
    });

    it('should get a card by id', async () => {
        const response = await fetch(`${baseURL_cards}/card/64e5fe9b1ad452861a52800c`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        assert.equal(response.status, 200);
    });

    it('should get the number of cards in the database', async () => {
        const response = await fetch(`${baseURL_cards}/count`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        assert.equal(response.status, 200);
    });

    it('should delete a card by id', async () => {
        const response = await fetch(`${baseURL_cards}/card-user/64e5fe9b1ad452861a52800c`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: "",
        });
        assert.equal(response.status, 200);
    });

});



describe('User routes', () => {

    it('should register a new user', async () => {
        const response = await fetch(`${baseURL_users}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: {
                    firstName: "Miki",
                    lastName: "Poleg",
                },
                email: "miki@gmail.com",
                password: "Bb!12345",
            }),
        });
        assert.equal(response.status, 200);
    });


    it('should login a user', async () => {
        const response = await fetch(`${baseURL_users}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "riki@gmail.com",
                password: "Bb!12345",
            }),
        });
        assert.equal(response.status, 200);
    });

    it('should get all users', async () => {
        const response = await fetch(`${baseURL_users}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        assert.equal(response.status, 200);
    });


    it('should update the followers and following when a user is deleted', async () => {
        const response = await fetch(`${baseURL_users}/updateFollowersAndFollowing/64e5fe841ad452861a528001`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: "",
        });
        assert.equal(response.status, 200);
    });


    it('should update user last login time', async () => {
        const response = await fetch(`${baseURL_users}/userLastLoginTime`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: "64e5fe841ad452861a528001",
                lastLoginTime: new Date(),
            }),
        });
        assert.equal(response.status, 200);
    });


    it('should delete a user by id', async () => {
        const response = await fetch(`${baseURL_users}/64e5fe841ad452861a528001`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: "",
        });
        assert.equal(response.status, 200);
    });
});

