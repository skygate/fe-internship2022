import Config from 'config';

const url = `${Config.API_URL}/user/login`;

export const loginUser = async (data: {}) => {
    try {
        const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000/",
        },
        body: JSON.stringify(data),
    });  
    return response.json();
    } catch (error) {
        throw new Error("Couldn't log user")
    }  
};