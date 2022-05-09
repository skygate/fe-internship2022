export const loginUser = async (url: string, data: {}) => {
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
    })  
    return response.json();
};