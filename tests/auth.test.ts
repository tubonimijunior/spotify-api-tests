import { describe, it, expect } from 'vitest';
import 'dotenv/config';
import { authUrl } from './helpers/config.js';

const client_id = process.env.CLIENTID
const client_secret = process.env.CLIENTSECRET

describe('Spotify API Authentication Tests', () => {
    it('Should return a 200 status code for valid credentials', async () => {
        if (client_id === undefined || client_secret === undefined) {
            throw new Error('client_id or client_secret is undefined');
        }
        const response = await fetch(`${authUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                client_id,
                client_secret
            })
        });
        expect(response.status).toBe(200);
        const authResponse = await response.json();
        expect(authResponse).toHaveProperty('access_token');
        expect(authResponse.token_type).toBe('Bearer');
    });

    it('Should return a 400 status code for invalid client id', async () => {
        if (client_secret === undefined) {
            throw new Error('client_secret is undefined');
        }
        const response = await fetch(`${authUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                client_id: 'd669w9234596799963030969362',
                client_secret
            })
        });

        expect(response.status).toBe(400);
        const authResponse = await response.json();
        expect(authResponse.error).toBe('invalid_client');
    });
    it('should return a 400 status code for invalid client secret', async () => {
        if (client_id === undefined) {
            throw new Error ('client_secret is undefined');
        }
        const response = await fetch(`${authUrl}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
                client_id,
                client_secret: 'invalid_client_secret'
            })
        });
        expect(response.status).toBe(400);
        const authResponse = await response.json();
        expect(authResponse.error).toBe('invalid_client');
        });

        it('Should return a 400 status code for missing client id & secret', async () => {
            const response = await fetch(`${authUrl}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    'grant_type': 'client_credentials',
                    'client_id': '',
                    'client_secret': ''
                })
            });
            expect(response.status).toBe(400);
            const authResponse = await response.json();
            expect(authResponse.error).toBe('invalid_client');
        })
    });

