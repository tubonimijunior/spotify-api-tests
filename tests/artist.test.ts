import { getToken } from './helpers/auth.ts';
import { describe, it, expect, beforeAll } from 'vitest';
import type { components } from './types/spotify.ts';
import { spotifyUrl } from './helpers/config.ts';

const artistId = '4Z8W4fKeB5YxbusRsdQVPb';

const ArtistData = {
    name: 'Radiohead',
    type: 'artist',
    uri: 'spotify:artist:4Z8W4fKeB5YxbusRsdQVPb',
};

type Artist = components['schemas']['ArtistObject'];

let token: string;
beforeAll(async () => {
    token = await getToken();
});
describe('GET Artists details', () => {
    it('Should return a 401 when user does not have a valid token', async () => {
        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { Authorization: `Bearer gwjrwguwfghefhfhgwhf` },
        });

        expect(response.status).toBe(401); //HTTP status line
        const apiResponse = await response.json();
        expect(apiResponse).toMatchObject({
            error: {
                message: expect.any(String),
                status: 401,
            },
        });
    });

    it('Should return a 401 when user does not pass in a token', async () => {
        const response = await fetch(`${spotifyUrl}/artists/${artistId}`);

        expect(response.status).toBe(401); //HTTP status line
        const apiResponse = await response.json();
        expect(apiResponse).toMatchObject({
            error: {
                message: expect.any(String),
                status: 401,
            },
        });
    });

    it('Should return a 200 and Artist detail when user has access and the artist ID exists', async (test) => {
        if (!artistId) {
            test.skip();
        }
        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status).toBe(200); //HTTP status line
        const apiResponse = (await response.json()) as Artist;
        expect(apiResponse.name).toEqual(ArtistData.name);
        expect(apiResponse.type).toEqual(ArtistData.type);
        expect(apiResponse.uri).toEqual(ArtistData.uri);
        // expect(apiResponse).toMatchObject(ArtistData)
    });

    it('Should return a 404 when the artist ID does not exist', async () => {
        const artistId = '4Z8W4fKeB5YxbusRsdQdpd';

        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status).toBe(404); //HTTP status line
        const apiResponse = await response.json();
        expect(apiResponse).toMatchObject({
            error: {
                message: expect.any(String),
                status: 404,
            },
        });
    });

    it('Should return an error for a malformed test ID', async () => {
        const artistId = 'not-a-valid-id';

        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status).toBe(400); //HTTP status line
        const apiResponse = await response.json();
        expect(apiResponse).toMatchObject({
            error: {
                message: expect.any(String),
                status: 400,
            },
        });
    });
});
