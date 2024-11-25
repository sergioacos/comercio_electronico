const request = require('supertest');
const express = require('express');

const app = express();

app.get('/status', (req, res) => {
    res.status(200).send('Servidor funcionando');
});

describe('GET /status', () => {
    it('Debería responder con status 200 si el servidor está funcionando', async () => {
        const response = await request(app)
            .get('/status');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Servidor funcionando');
    });
});