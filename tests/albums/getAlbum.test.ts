import { getToken } from '../helpers/auth.ts';
import { beforeAll, describe, it, expect } from 'vitest';
import { spotifyUrl } from '../helpers/config.ts';
import axios from 'axios';

const album = '78iX7tMceN0FsnmabAtlOC';

const albumDetails = {
    name: 'All Eyez On Me',
    type: 'album',
    uri: 'spotify:album:78iX7tMceN0FsnmabAtlOC',
    artists: [{ name: '2Pac' }],
} as any;

const albumSongs = [
    'Ambitionz Az A Ridah',
    'California Love (remix) (ft. Dr. Dre, Roger Troutman) - Remix',
    'Life Goes On',
];

const ids = [
    '382ObEPsp2rxGrnsizN5TX',
    '1A2GTWGtFfWp7KSQTwWOyo',
    '2noRn2Aes5aoNVsU6iWThc',
];

let token: string;
beforeAll(async () => {
    token = await getToken();
});

describe('Get Albums and details', () => {
    it('Should return a 200 and display ablum details', async () => {
        const response = await axios.get(`${spotifyUrl}/albums/${album}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status).toBe(200);
        const apiResponse = response.data;
        expect(apiResponse).toMatchObject(albumDetails);
        const song = apiResponse.tracks.items.map(
            (track: { name: string }) => track.name,
        );
        expect(song).toEqual(expect.arrayContaining(albumSongs));
    });

    it('should loop through different ids', async () => {
        const responses = await Promise.all(
            ids.map((id) =>
                axios.get(`${spotifyUrl}/albums/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ),
        );

        expect(responses).toHaveLength(ids.length);
        responses.forEach((response) => {
            expect(response.status).toBe(200);
        });
    });
});
