import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function User_home() {
  const [userDetails, setUserDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [Start_date, setStart_date] = useState("");
  const [End_date, setEnd_date] = useState("");
  const [number_of_person, setnumber_of_person] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/getdetail`,
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
  }, []);
  const handlePayment = async (id, e) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/checkout`,
        {
          method: "POST",
          headers: HEADERS,
          credentials: "include",
          body: JSON.stringify({ bookingId: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const order = await response.json();
      console.log(order);
      if (order.success) {
        var options = {
          key: "rzp_test_a8RK1FJbMDqT9S", // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: order.currency,
          name: "yoyo Corp", //your business name
          description: "Test Transaction",
          order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          handler: async function (response) {
            const body = {
              ...response,
            };

            const validateRes = await fetch(
              `${process.env.REACT_APP_API_ENDPOINT}/order/validate`,
              {
                method: "POST",
                body: JSON.stringify(body),
                headers: HEADERS,
              }
            );
            const jsonRes = await validateRes.json();
            console.log(jsonRes);
          },
          prefill: {
            //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            name: "Web Dev Matrix", //your customer's name
            email: "webdevmatrix@example.com",
            contact: "9000000000", //Provide the customer's phone number for better conversion rates
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();
        e.preventDefault();
      } else {
        // Handle failure scenario, e.g., show an error message to the user
        console.error("Payment failed:", order.message);
        // Consider displaying this error message to the user
      }
    } catch (error) {
      console.error("Error processing payment:", error.message);
      // Consider displaying a generic error message to the user
    }
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
  const handleExtendBooking = async (bookingId) => {
    console.log(`Extend booking with ID: ${bookingId}`);

    const newEndDate = prompt(
      "Enter the new end date for the booking (DD/MM/YYYY format):"
    );

    if (!newEndDate) return; // If user cancels or doesn't provide a date.

    // Validate the newEndDate format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!dateRegex.test(newEndDate)) {
      console.error("Invalid date format provided.");
      return;
    }

    // Parse the date into a JavaScript Date object
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
            newEndDate: parsedDate.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Booking extended successfully!", data);
        // Handle success, e.g., close modal, refresh data, etc.
      } else {
        console.error("Failed to extend booking:", data.error);
        // Handle error, e.g., show error message to the user.
      }
    } catch (error) {
      console.error("Error extending booking:", error);
      // Handle other errors, e.g., show error message to the user.
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
            <th>payment_done</th>
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
              <td>
                {new Date(booking.Start_date) > new Date() &&
                booking.payment_done === "No" ? (
                  <button onClick={() => handlePayment(booking._id)}>
                    Pay Now
                  </button>
                ) : (
                  booking.payment_done
                )}
              </td>
              <td>{booking.isActive ? "Active" : "Inactive"}</td>
              <td>
                {booking.isActive && (
                  <button onClick={() => handleExtendBooking(booking._id)}>
                    Extend
                  </button>
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
