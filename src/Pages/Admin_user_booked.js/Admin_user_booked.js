import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useParams } from "react-router-dom";

function Admin_User() {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [inactivebookings, setinactivebookings] = useState([]);
  const [error, setError] = useState(null);
  const { role } = useAuth();
  const HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchactiveBookings();
    fetchinactiveBookings();
  }, []);

  const fetchactiveBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getallactivebookings/${id}`,
        {
          method: "GET",
          headers: HEADERS,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch active bookings");
      }

      const responseData = await response.json();
      if (Array.isArray(responseData.data)) {
        setBookings(responseData.data);
      } else {
        console.error(
          "Active bookings data received is not an array:",
          responseData
        );
        setError("Failed to fetch active bookings");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchinactiveBookings = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/getallinactivebookings/${id}`,
        {
          method: "GET",
          headers: HEADERS,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch inactive bookings");
      }

      const responseData = await response.json();
      if (Array.isArray(responseData.data)) {
        setinactivebookings(responseData.data);
      } else {
        console.error(
          "Inactive bookings data received is not an array:",
          responseData
        );
      }
    } catch (error) {}
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div>
      Active bookings
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Number of persons</th>
            <th>Start_date</th>
            <th>End_date</th>
            {role === 1 && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bookings) &&
            bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.id}</td>
                <td>{booking.number_of_person}</td>
                <td>{formatDate(booking.Start_date)}</td>
                <td>{formatDate(booking.End_date)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      Inactive bookings
      /////////////////////////////////////////////////////////////////////////
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Number of persons</th>
            <th>Start_date</th>
            <th>End_date</th>

            {role === 1 && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bookings) &&
            inactivebookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.id}</td>
                <td>{booking.number_of_person}</td>
                <td>{formatDate(booking.Start_date)}</td>
                <td>{formatDate(booking.End_date)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {error && <p>Error: {error}</p>}
      <button onClick={() => navigate(-1)}>Go back</button>{" "}
    </div>
  );
}

export default Admin_User;
