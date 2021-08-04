const WebSocket = require("ws");
const port = process.env.port || 3000;
const wss = new WebSocket.Server({ port: port });
const time = new Date();
//  Creating websocket connetion
wss.on("connection", (ws) => {
 
  let userName;
  // Run when user send data
  ws.on("message", (rawData) => {
    console.log(rawData);
    try {
      const data = JSON.parse(rawData);
      userName = data.payload.userName;
      if (data.event == "Creating_connection") {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                event: "User_connected",
                payload: {
                  message: `${data.payload.userName} was connected`,
                  time: `${time.getHours()}.${time.getMinutes()}`,
                },
              })
            );
          }
        });
      } else if (data.event == "User_messsage") {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                event: "broad_message",
                payload: {
                  name: data.payload.userName,
                  message: `${data.payload.message}`,
                  time: `${time.getHours()}.${time.getMinutes()}`,
                },
              })
            );
          }
        });
        wss.clients.forEach((client) => {
          if (client === ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                event: "your_message",
                payload: {
                  name: data.payload.userName,
                  message: `${data.payload.message}`,
                  time: `${time.getHours()}.${time.getMinutes()}`,
                },
              })
            );
          }
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  });
  // Run when user disconnect
  ws.on("close", (ws) => {
   
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            event: "User_disconnected",
            payload: {
              messsage: `${userName} is disconnected at ${time.getHours()}.${time.getMinutes()}`,
            },
          })
        );
      }
    });
  });
});
