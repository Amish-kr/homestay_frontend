import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function User_home() {
  const [userDetails, setUserDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [Start_date, setStart_date] = useState("");
  const [End_date, setEnd_date] = useState("");
  const [number_of_person, setnumber_of_person] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const navigate = useNavigate();

  const HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/getdetail`, //////
          {
            method: "GET",
            headers: HEADERS,
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();

        const updatedBookings = data.bookings.map((booking) => ({
          ...booking,
          isActive: Date.now() <= new Date(booking.End_date).getTime(),
        }));

        setUserDetails({ ...data, bookings: updatedBookings });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  });

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
    } catch (error) {}
  };
  const handleBookingCreation = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/createbooking`,
        {
          method: "POST",
          headers: HEADERS,
          credentials: "include",
          body: JSON.stringify({
            Start_date: Start_date,
            End_date: End_date,
            number_of_person: number_of_person,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add TODO");
      }

      setShowForm(false);
      console.log("Booking created successfully!");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };
  const handleExtend = async (bookingId) => {
    if (!newEndDate) return;

    const [day, month, year] = newEndDate.split("/");
    const parsedDate = new Date(`${year}-${month}-${day}`);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/extendbooking/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newEndDate: parsedDate.toISOString().split("T")[0],
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Booking extended successfully!", data);
      } else {
        console.error("Failed to extend booking:", data.error);
      }
    } catch (error) {
      console.error("Error extending booking:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {userDetails?.name}!</h1>
      <h2>Your Bookings:</h2>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Number of person</th>
            <th>Start_date</th>
            <th>End_date</th>

            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userDetails?.bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking._id}</td>
              <td>{booking.number_of_person}</td>
              <td>{new Date(booking.Start_date).toLocaleDateString()}</td>
              <td>{new Date(booking.End_date).toLocaleDateString()}</td>

              <td>{booking.isActive ? "Active" : "Inactive"}</td>
              <td>
                {booking.isActive && (
                  <div>
                    <p>Extend booking with ID: {booking._Id}</p>
                    <input
                      type="date"
                      className="input"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                    />

                    <button onClick={() => handleExtend(booking._id)}>
                      Extend Booking
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setShowForm(true)}>Create Booking</button>
      {showForm && (
        <div className="booking-form-modal">
          <h2>Create a Booking</h2>
          <form onSubmit={handleBookingCreation}>
            <label>
              Start Date:
              <input
                type="date"
                value={Start_date}
                onChange={(e) => setStart_date(e.target.value)}
                required
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                value={End_date}
                onChange={(e) => setEnd_date(e.target.value)}
                required
              />
            </label>

            <label>
              Number of Persons:
              <input
                type="number"
                value={number_of_person}
                onChange={(e) => setnumber_of_person(e.target.value)}
                min="1"
                required
              />
            </label>

            <button type="submit">Create Booking</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <button className="button1" id="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default User_home;
