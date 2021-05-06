import React, { useState } from "react";
import moment from "moment";

export default function Slot() {
  const [slotText, setSlotText] = useState(
    "Click button to start making requests"
  );

  function getSlotsAtInterval(dateString) {
    setTimeout(async function () {
      fetch(
        "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" +
          this.pincodeInput.value +
          "&date=" +
          dateString
      )
        .then((res) => res.json())
        .then(
          (result) => {
            let sessions = result.sessions;
            let validSessions = sessions.filter(
              (session) =>
                session.min_age_limit < this.ageInput &&
                session.available_capacity > 0
            );

            if (validSessions.length > 0) {
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(validSessions)
              };
              fetch(
                "https://mailer-ap05.herokuapp.com/sendEmail?email=" +
                  this.emailInput.value,
                requestOptions
              )
                .then((res) => res.json())
                .then(
                  (result) => {
                    setSlotText(result);
                  },
                  (error) => {
                    // setSlotText(error);
                    console.log(error);
                  }
                );
            }
            let date = new Date();
            setSlotText(JSON.stringify(validSessions) + "\n" + date.getTime());
            console.log(date.getTime());
          },
          (error) => {
            console.log(error);
          }
        )
        .catch((err) => console.log(err));
    }, 3600000);
  }

  function getSlotsForUpcomingFiveDays() {
    const day = moment();
    for (let i = 0; i < 5; i++) {
      let dateString = day.format("DD-MM-YYYY");
      getSlotsAtInterval(dateString);
      day.add(1, "day");
    }
  }

  return (
    <div>
      <p>{slotText}</p>
      <form>
        <label>Pincode: </label>
        <input
          type="number"
          name="pincodeInput"
          ref={(pincodeInput) => (this.pincodeInput = pincodeInput)}
        />
        <br />
        <label>Email: </label>
        <input
          type="email"
          name="emailInput"
          ref={(emailInput) => (this.emailInput = emailInput)}
        />
        <br />
        <label>Age: </label>
        <input
          type="number"
          name="ageInput"
          ref={(ageInput) => (this.ageInput = ageInput)}
        />
      </form>
      <button onClick={getSlotsForUpcomingFiveDays}>Start Requests</button>
    </div>
  );
}
