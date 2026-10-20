import 'dotenv/config';
import { authUrl } from './config.ts';

export async function getToken(): Promise<string> {
    if (
        process.env.CLIENTID === undefined ||
        process.env.CLIENTSECRET === undefined
    ) {
        throw new Error('client_id or client_secret is undefined');
    }
    const response = await fetch(`${authUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.CLIENTID,
            client_secret: process.env.CLIENTSECRET,
        }),
    });
    // const authResponse = await response.json();
    // if (response.status !== 200 || !authResponse.access_token) {
    //     throw new Error('Failed to get token');
    // }

    if (response.status !== 200) {
        throw new Error(`Failed with error code: ${response.status}`);
    }
    const authResponse = await response.json();
    if (!authResponse.access_token) {
        throw new Error('Failed to get access token');
    }
    return authResponse.access_token;
}
