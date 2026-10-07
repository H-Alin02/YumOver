const VITE_API_URL = import.meta.env.VITE_API_URL;

export async function callAPI(path, options) {
    const response = await fetch(`${VITE_API_URL}/${path}`, options);

    if (!response.ok) {
        throw new Error(`Il server ha risposto ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}