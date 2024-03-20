import { jwtDecode } from "jwt-decode";

const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true; // Token does not exist, consider it expired
    try {
        const decodedToken = jwtDecode(token);

        if (decodedToken == null)
            throw Error("Invalid token.");

        if (decodedToken.exp === undefined) {
            throw new Error("Expiration time not found in token");
        }

        return decodedToken.exp < Date.now() / 1000; // Compare expiration time with current time
    } catch (error) {
        console.error('Error decoding token:', error);
        console.error('Token has expired.')
        return true;
    }
};

export { isTokenExpired };
