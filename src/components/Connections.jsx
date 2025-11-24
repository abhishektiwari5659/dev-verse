import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      console.log("Fetched connections:", res.data);

      dispatch(addConnection(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  if (!connections || connections.length === 0)
    return (
      <h1 className="text-center text-gray-400 mt-10 text-xl">
        No connections found
      </h1>
    );

  return (
    <div className="flex flex-col items-center my-10 w-full">
      <h2 className="font-bold text-3xl mb-6 text-white">Connections</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {connections.map((connection, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 w-72"
          >
            {/* Photo */}
            <div className="w-full h-56 overflow-hidden bg-gray-700">
              <img
                src={connection.photoUrl || "https://via.placeholder.com/400"}
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col gap-2">
              <div className="text-xl font-semibold">
                {connection.firstName} {connection.lastName}
              </div>

              <div className="text-gray-400 text-sm">
                {connection.age && <p>Age: {connection.age}</p>}
                {connection.gender && <p>Gender: {connection.gender}</p>}
              </div>

              {connection.about && (
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                  {connection.about}
                </p>
              )}

              <div className="mt-3 flex justify-end">
                <button className="btn btn-sm btn-primary rounded-lg px-4">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
