let wss = null;

export function initWebSocket(websocketServer) {
    wss = websocketServer;
}

export function broadcast(type, data) {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === 1) {
                client.send(JSON.stringify({ type, data }));
            }
        });
    }
}