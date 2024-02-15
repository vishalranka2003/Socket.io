import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Moment from "react-moment";
import { io } from "socket.io-client";

const ChatRoom = () => {
  const location = useLocation();
  const msgBoxRef = useRef();

  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [allMessages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [file, setFile] = useState(null);
  const [receivedFiles, setReceivedFiles] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:2000");
    setSocket(socket);

    socket.on("connect", () => {
      console.log("socket Connected");
      socket.emit("joinRoom", location.state.room);
    });
  }, [location.state.room]);

  useEffect(() => {
    if (socket) {
      socket.on("getLatestMessage", (newMessage) => {
        setMessages([...allMessages, newMessage]);
        if (msgBoxRef.current) {
          msgBoxRef.current.scrollIntoView();
        }
        setMsg("");
        setFile(null);
        setLoading(false);
      });
    }
  }, [socket, allMessages]);

  useEffect(() => {
    setData(location.state);
  }, [location]);

  const handleChange = (e) => setMsg(e.target.value);
  const handleEnter = (e) => (e.keyCode === 13 ? onSubmit() : "");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const onAttachClick = () => {
    // Trigger click on the hidden file input
    fileInputRef.current.click();
  };

  const onSubmit = () => {
    if (msg || file) {
      setLoading(true);
      let newMessage;
      if (msg || file) {
        newMessage = { time: new Date(), msg, name: data.name, url: "" };

        if (file) {
          let fileName;
          let fileDownload;
          // const formData = new FormData();
          // formData.append("file", file);
          // console.log(file);
          // console.log(file.name);
          // formData.append("name", data.name);
          // console.log(data.name);
          // formData.append("message", JSON.stringify(newMessage));
          // console.log(newMessage);

          // Emit the "upload" event to the backend with the FormData
          socket.emit("upload", file, file.name, data.name, (response) => {
            if (response.message === "success") {
              fileName = response.fileName;
              fileDownload = response.filePath;
              alert(response.fileName + "uploaded successfully!");
              newMessage = {
                time: new Date(),
                msg: fileName,
                name: data.name,
                url: fileDownload,
              };
              socket.emit("newMessage", { newMessage, room: data.room });
            } else {
              console.error("File upload failed");
            }
            setLoading(false); // Update loading state based on your requirements
          });
          console.log("fileName: " + fileName);
        } else {
          socket.emit(
            "newMessage",
            { newMessage, room: data.room },
            (response) => {
              console.log(response);
              // Handle the response from the server if needed
              setLoading(false); // Update loading state based on your requirements
            }
          );
        }
      }

      setMsg("");
      setFile(null);
    }
  };

  const fileInputRef = useRef(null);
  return (
    <body class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800  dark:bg-gray-900 p-10">
      <div class="flex flex-col flex-grow w-full max-w-xl  dark:bg-gray-600 shadow dark:border  dark:border-gray-500 rounded-lg overflow-hidden  ">
        <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
          {allMessages.map((msg) => {
            return data.name === msg.name ? (
              <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                <div>
                  <div class="bg-blue-600 text-white p-2 rounded-l-lg rounded-br-lg">
                    <p class="text-sm mb-2">{msg.msg}</p>
                  </div>
                  <span class="text-xs text-gray-300 leading-none">
                    <Moment fromNow>{msg.time}</Moment>
                  </span>
                </div>
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex justify-center items-center">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div class="flex w-full mt-2 space-x-3 max-w-xs">
                <div class="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex justify-center items-center">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div class="bg-gray-300 p-2 rounded-r-lg rounded-bl-lg">
                    <p class="text-sm">{msg.msg}</p>
                  </div>
                  <span class="text-xs text-gray-300 leading-none">
                    <Moment fromNow>{msg.time}</Moment>
                  </span>
                </div>
              </div>
            );
          })}

          <div ref={msgBoxRef}></div>
        </div>

        <div class=" dark:bg-gray-700 shadow dark:border  dark:border-gray-700 p-4 flex">
          <div className="flex w-full items-center gap-2">
            <input
              class="flex items-center h-10 w-full rounded px-3 text-sm focus:outline-none"
              type="text"
              placeholder="Type your message…"
              name="message"
              onKeyDown={handleEnter}
              value={msg}
              onChange={handleChange}
            />
            {/* <button
              className="border border-blue-600 w-10 h-10 rounded-md"
              onClick={onAttachClick}>
              📎
            </button> */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*" // Adjust the accepted file types as needed
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <button
            className="btn bg-blue-600 mx-2"
            disabled={loading}
            onClick={onSubmit}>
            {loading ? (
              <div class="spinner-border spinner-border-sm bg-blue-600"></div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#fff"
                className="bi bi-send"
                viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </body>
  );
};

export default ChatRoom;
