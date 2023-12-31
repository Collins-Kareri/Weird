interface RequestOptions {
    method: "GET" | "POST" | "DELETE" | "PUT";
    body: string;
}

export default async function makeRequest(url: string, options?: RequestOptions) {
    return await new Promise((resolve, reject) => {
        fetch(url, options)
            .then(async (res) => {
                const data = await res.json();
                if (res.status >= 400) {
                    throw { msg: "Request failed", data };
                }
                resolve(data);
                return;
            })
            .catch((err) => reject(err));
    });
}
