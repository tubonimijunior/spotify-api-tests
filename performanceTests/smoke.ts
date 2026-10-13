import { getToken } from './helper/k6Auth.ts';
import http from 'k6/http';
import { check, sleep } from 'k6';
import { spotifyUrl } from '../tests/helpers/config.ts';

const artistId = '0TnOYISbd1XYRBk9myaseg';

export const options = {
    vus: 1,
    duration: '30s',
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
        checks: ['rate==1'],
    },
};

export function setup() {
    return { token: getToken() };
}

export default function (data: { token: string }) {
    const res = http.get(`${spotifyUrl}/artists/${artistId}`, {
        headers: { Authorization: `Bearer ${data.token}` },
    });
    check(res, {
        'status is 200': (r) => r.status === 200,
        'returns the right artist': (r) => r.json('id') === artistId,
    });
    sleep(1);
}
