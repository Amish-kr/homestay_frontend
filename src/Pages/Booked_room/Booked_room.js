import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function BookList() {
  const [bookings, setBookings] = useState([]);
  const [inactivebookings, setinactivebookings] = useState([]);
  const [error, setError] = useState(null);
  const { isLoggedIn, role } = useAuth();
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
        `${process.env.REACT_APP_API_ENDPOINT}/getallactivebookings`,
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
        `${process.env.REACT_APP_API_ENDPOINT}/getallinactivebookings`,
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
        // You can store these bookings in a different state if needed
        setinactivebookings(responseData.data);
      } else {
        console.error(
          "Inactive bookings data received is not an array:",
          responseData
        );
        // setError("Failed to fetch inactive bookings"); // Uncomment if you want to show errors for inactive bookings
      }
    } catch (error) {
      // setError(error.message); // Uncomment if you want to show errors for inactive bookings
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_ENDPOINT}/logout`, {
        method: "POST",
        credentials: "include",
      });
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
      window.location.reload();
    } catch (error) {
      setError(`Error during logout: ${error.message}`);
    }
  };

  return (
    <div>
      <button className="button1" id="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Number of persons</th>
            <th>Start_date</th>
            <th>End_date</th>
            <th>payment_done</th>
            <th>User</th>
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
                <td>{booking.payment_done}</td>
                <td>{booking.User}</td>
              </tr>
            ))}
        </tbody>
      </table>
      /////////////////////////////////////////////////////////////////////////
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Number of persons</th>
            <th>Start_date</th>
            <th>End_date</th>
            <th>payment_done</th>
            <th>User</th>
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
                <td>{booking.payment_done}</td>
                <td>{booking.User}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default BookList;
