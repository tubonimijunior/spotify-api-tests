import { describe, it, expect, beforeAll } from 'vitest';
import { getToken } from './helpers/auth.js';
import { spotifyUrl } from './helpers/config.js';
import axios from 'axios';

// const artistName = 'Tupac';
const searchParam = new URLSearchParams({
    q: 'Tupac',
    type: 'album',
});
// const artistName = searchParam.get('q');

let token: string;
beforeAll(async () => {
    token = await getToken();
});

describe('Search for Artists & details', () => {
    it('Should return a 200 and artist albums', async () => {
        // const response = await fetch(`${spotifyUrl}/search?q=${artistName}&type=album`, {
        const response = await axios.get(
            `${spotifyUrl}/search?${searchParam.toString()}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        );
        expect(response.status).toBe(200);
        const apiResponse = await response.data;
        expect(apiResponse.albums.items.length).toBeGreaterThan(0);
        const albums = apiResponse.albums.items.map(
            (album: { name: string }) => album.name,
        );
        expect(albums).toContain('All Eyez On Me');
        expect(apiResponse.albums.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: 'All Eyez On Me' }),
            ]),
        );
    });
});
