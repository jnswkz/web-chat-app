import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";

const io = new Server({
    cors:{
        origin: "*",
    }
});

const users = {};

io.on("connection", (socket) => {
    console.log("connected");

    socket.on("send-chat-message", (data) => {
        console.log(data);
        socket.broadcast.emit("chat-message", { message: data, name: users[socket.id] });
    });
    
    socket.on("new-user", (data) => {
        console.log(data);
        users[socket.id] = data;
        socket.broadcast.emit("user-connected", data);
    })

    socket.on("disconnect", () => {
        console.log("disconnected");
        socket.broadcast.emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
    });
    
    // socket.on('send-image-message', (base64Image) => {
    //     // broadcast the image to all other clients
    //     socket.broadcast.emit('image-message', base64Image);
    // });
    
});

await serve(io.handler(), {
  port: 3000,
});