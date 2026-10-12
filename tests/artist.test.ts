import { getToken } from './helpers/auth.js';
import { describe, it, expect, beforeAll } from 'vitest';
import type { components } from './types/spotify.js';
import { spotifyUrl} from './helpers/config.js'

const artistId = '4Z8W4fKeB5YxbusRsdQVPb';
// const url = `https://api.spotify.com/v1/`;


const ArtistData = {
    'name': 'Radiohead',
    'type': 'artist',
    'uri': 'spotify:artist:4Z8W4fKeB5YxbusRsdQVPb'
}

type Artist = components['schemas']['ArtistObject'];

let token: string;
beforeAll(async () => {
    token = await getToken();
});
describe('GET Artists details', () => {
    it('Should return a 401 when user does not have a valid token', async () => {

        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { 'Authorization': `Bearer gwjrwguwfghefhfhgwhf` }
        });

        expect(response.status).toBe(401);
        const apiResponse = await response.json();
        expect(apiResponse.error.message).toEqual('Missing/invalid/expired access token');// brittle
        expect(apiResponse.error.message).toBeTruthy();
        expect(apiResponse.error.status).toBe(401);
    })

    it('Should return a 401 when user does not pass in a token', async () => {

        const response = await fetch(`${spotifyUrl}/artists/${artistId}`);

        expect(response.status).toBe(401);
        const apiResponse = await response.json();
        expect(apiResponse.error.message).toEqual('Missing/invalid/expired access token');// brittle
        expect(apiResponse.error.message).toBeTruthy();
        expect(apiResponse.error.status).toBe(401);
    })

    it('Should return a 200 and Artist detail when user has access and the artist ID exists', async (test) => {
        if (!artistId) {
            test.skip();
        }
        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            // 'Authorization': { `Type': 'Bearer ${token}` }
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(response.status).toBe(200);
        const apiResponse = await response.json() as Artist;
        expect(apiResponse.name).toEqual(ArtistData.name);
        expect(apiResponse.type).toEqual(ArtistData.type);
        expect(apiResponse.uri).toEqual(ArtistData.uri);
    })

    it('Should return a 404 when the artist ID does not exist', async () => {
        const artistId = '4Z8W4fKeB5YxbusRsdQdpd'

        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(response.status).toBe(404);
        const apiResponse = await response.json();
        expect(apiResponse.error.status).toEqual(404);
        expect(apiResponse.error.message).toEqual('Resource not found');// brittle
        // expect(apiResponse.error.message).toBeFalsy();
    })

    it('Should return and error for a malformed test ID', async () => {
        const artistId = 'not-a-valid-id';

        const response = await fetch(`${spotifyUrl}/artists/${artistId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        expect(response.status).toBe(400);
        const apiResponse = await response.json();
        expect(apiResponse.error.status).toEqual(400);
        expect(apiResponse.error.message).toEqual('Invalid base62 id');
    });
});