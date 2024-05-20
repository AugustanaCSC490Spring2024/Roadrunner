import { useEffect, useState } from "react";
import { API_URL } from "../constants/config";

export function useConversationHistory(auth, sidebarVisible) {
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    console.log("Fetching conversation history");
    const response = async () =>
      await fetch(`${API_URL}/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth["token_type"] + " " + auth["access_token"],
        },
      })
        .then(async (response) => {
          setConversationHistory(await response.json());
        })
        .catch((err) => {
          console.log("Error: ", err);
        });

    return response;
  }, [sidebarVisible]);

  return conversationHistory;
}

export function getActiveHistory(conversationID, setMessages, auth) {
  useEffect(() => {
    const response = async () =>
      await fetch(`${API_URL}/conversations/${conversationID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth["token_type"] + " " + auth["access_token"],
        },
      })
        .then(async (response) => {
          res = await response.json();
          setMessages(res.context);
        })
        .catch((err) => {
          console.log("Error: ", err);
        });
    return response;
  });
}
