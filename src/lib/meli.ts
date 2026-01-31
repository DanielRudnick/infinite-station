export const MELI_AUTH_URL = "https://auth.mercadolivre.com.br/authorization";
export const MELI_API_URL = "https://api.mercadolibre.com";

export function getMeliAuthUrl() {
    const clientId = process.env.ML_CLIENT_ID;
    const redirectUri = process.env.ML_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        console.error("ML_CLIENT_ID or ML_REDIRECT_URI not set in environment");
        return "#";
    }

    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri,
    });

    return `${MELI_AUTH_URL}?${params.toString()}`;
}

export async function exchangeMeliCodeForToken(code: string) {
    const clientId = process.env.ML_CLIENT_ID;
    const clientSecret = process.env.ML_CLIENT_SECRET;
    const redirectUri = process.env.ML_REDIRECT_URI;

    const response = await fetch(`${MELI_API_URL}/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: clientId || "",
            client_secret: clientSecret || "",
            code: code,
            redirect_uri: redirectUri || "",
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to exchange code: ${JSON.stringify(error)}`);
    }

    return response.json();
}
