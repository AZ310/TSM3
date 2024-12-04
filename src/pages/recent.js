import React, { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";
import { Link } from "react-router-dom";

//component
import TicketCard from "../components/TicketCard";

function TicketList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTicketData() {
      try {
        const { data, error } = await supabase.from("ticket").select("*");
        console.log(data);

        if (error) {
          console.error("Error fetching ticket data:", error.message);
        } else {
          setTickets(data || []);
        }
      } catch (error) {
        console.error("Error fetching ticket data:", error.message);
      }
    }

    fetchTicketData();
  }, []);

  const removeTicket = (id) => {
    setTickets(tickets.filter((ticket) => ticket.id !== id));
    supabase
      .from("ticket")
      .delete()
      .match({ id })
      .then(() => console.log(`Ticket with ID ${id} removed`))
      .catch((error) => console.error("Error removing ticket:", error.message));
  };

  return (
    <div>
      <div>
        <div className="flex justify-between px-3 items-center border-b-2 border-gray-300">
          {" "}
          {/* Navigation Bar */}
          <Link to="/" className="flex items-center cursor-pointer">
            {" "}
            {/* Link for the logo */}
            <img
              className="w-14"
              src="img/train.jpg"
              alt="website-logo"
            />
            <span className="font-bold px-0">TSM</span>
          </Link>
          <div>
            <h1 className="font-bold">Welcome to TSM</h1>
          </div>
          <div>
            <nav class="flex justify-start items-center">
              <div class="mr-3 pr-3 border-r border-gray-800">
                <a
                  class="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
                  href="recent"
                >
                  Recent Tickets
                </a>
              </div>
              <a
                href="login"
                className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
              >
                Sign in
              </a>
              <a
                href="signup"
                className="bg-white text-gray-800 border-2 rounded-full border-gray-800 p-2 transition ease-out hover:scale-105 hover:bg-gray-800 hover:text-white"
              >
                Sign up
              </a>
            </nav>
          </div>
        </div>
        <div id="tickets">
          {/* Render each ticket using the TicketCard component */}
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              removeTicket={removeTicket}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketList;
