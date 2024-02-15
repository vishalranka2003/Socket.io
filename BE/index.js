import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { promises as fsPromises } from "fs"; // Use the promisified version of writeFile
import os from "os";
import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const { writeFile } = fsPromises;
const __filenam = fileURLToPath(import.meta.url);
const __dirname = dirname(__filenam);
const app = express();
app.use(cors());

var server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// app.get("/", (req, res) => {
//   res.send("Chat BE started.");
//   res.end();
// });

app.use(express.static(path.join(__dirname, "../FE/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../FE/build", "index.html"));
});

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("newMessage", ({ newMessage, room }) => {
    io.in(room).emit("getLatestMessage", newMessage);
  });

  //   socket.on("upload", (file, name,callback) => {
  //     console.log(file); // <Buffer 25 50 44 ...>
  // const filePath = path.join("D:\\Development\\chat\\BE\\upload", name);

  //     // save the content to the disk, for example
  //     writeFile(filePath, file, (err) => {
  //       callback({ message: err ? "failure" : "success" });
  //     });
  //   });

  socket.on("upload", async (file, fileName, name, callback) => {
    try {
      const filePath = path.join("D:\\Development\\chat\\FE\\public", fileName);

      // Save the file to the disk
      await writeFile(filePath, file);

      // Emit a message with the file name and a download link
      // const downloadLink = `/download/${name}`; // Adjust the route as needed
      callback({
        message: "success",
        fileName: fileName,
        filePath: filePath,
        name: name,
      });
    } catch (error) {
      console.error(error);
      callback({ message: "failure" });
    }
  });
});

const port = process.env.PORT || 2000;

server.listen(port, () => {
  console.log(`App started at port ${port}`);
});
