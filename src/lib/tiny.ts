export const TINY_API_URL = "https://api.tiny.com.br/api2";

export async function validateTinyToken(token: string) {
    if (!token) throw new Error("Token is required");

    // We use a simple lightweight endpoint to validate the token
    // 'info.get.php' is often used to get account status/info
    const response = await fetch(`${TINY_API_URL}/info.get.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            token: token,
            format: "json",
        }),
    });

    if (!response.ok) {
        throw new Error(`Tiny API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.retorno?.status === "Erro") {
        const errorMsg = data.retorno.erros?.[0]?.erro || "Token inválido ou sem permissão";
        throw new Error(errorMsg);
    }

    return data.retorno;
}
