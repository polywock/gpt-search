
export async function bump(chatId: string, auth: string) {
    const title = await getTitle(chatId, auth);
    if (!title) throw 'No title';

    const res = await fetch(`https://chatgpt.com/backend-api/conversation/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: title }),
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) throw 'Bump not OK';
}

async function getTitle(chatId: string, auth: string) {
    const json = await (await fetch(`https://chatgpt.com/backend-api/conversation/${chatId}`, {
        method: 'GET',
        headers: {
            'Authorization': auth
        }
    })).json()
    return json.title 
}
