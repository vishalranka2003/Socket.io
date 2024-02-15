import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { IoMdSend } from "react-icons/io";
const MainForm = () => {
  let navigate = useNavigate();

  const [data, setData] = useState({ name: "", room: "" });
  const [errorName, setNameError] = useState("");
  const [errorRoom, setRoomError] = useState("");
  const validation = () => {
    let isValid = true;

    if (!data.name) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!data.room) {
      setRoomError("Please select room.");
      isValid = false;
    } else {
      setRoomError("");
    }

    return isValid;
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validation();
    if (isValid) {
      navigate(`/chat/${data.room}`, { state: data });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white flex justify-center">
              Welcome to Chatzy
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter your name"
                  required=""
                  onChange={handleChange}
                />
                {errorName ? (
                  <small className="text-danger m-auto">{errorName}</small>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label
                  htmlFor="text"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Room
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="room"
                  aria-label="Default select example"
                  onChange={handleChange}
                >
                  <option value="">Select Room</option>
                  <option value="coding">Coding</option>
                  <option value="gaming">Gaming</option>
                  <option value="socialMedia">Social Media</option>
                  //{" "}
                </select>
                {errorRoom ? (
                  <small className="text-danger m-auto">{errorRoom}</small>
                ) : (
                  ""
                )}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-2xl px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 flex justify-center items-center gap-2"
              >
                Lets Start <IoMdSend size={17} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainForm;
