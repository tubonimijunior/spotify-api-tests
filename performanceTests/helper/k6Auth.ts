import http from 'k6/http';

export function getToken(): string {
    if (!__ENV.CLIENTID || !__ENV.CLIENTSECRET) {
        throw new Error("Missing credentials")
    }
    const res = http.post('https://accounts.spotify.com/api/token', {
        grant_type: 'client_credentials',
        client_id: __ENV.CLIENTID,
        client_secret: __ENV.CLIENTSECRET,
    })
    if (res.status !== 200) {
        throw new Error(`Failed to fetch token with: ${res.status} and ${res.body}`)
    }
    // return res.json('access_token') as string;
    const authResponse = res.json() as unknown as { access_token: string };
    return authResponse.access_token;
}