import React, { useEffect, useState } from "react";


export function useConversationHistory(auth) {
    const [conversationHistory, setConversationHistory] = useState([])

    useEffect(() => {
        const response = async () => await fetch(`http://127.0.0.1:8000/conversations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth["token_type"] + " " + auth["access_token"],
            },
        }).then(async (response) => {
            setConversationHistory(await response.json())
            console.log("History: ", conversationHistory)
        }).catch(err => {
            console.log("Error: ", err)
        });

        return response;
    })

    return conversationHistory;
}

export function getActiveHistory(conversationID, setMessages) {
    useEffect(() => {
        const response = async () => await fetch(`http://127.0.0.1:8000/conversations/${conversationID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth["token_type"] + " " + auth["access_token"],
            },
        }).then(async (response) => {
            setMessages(await response.json())
        }).catch(err => {
            console.log("Error: ", err)
        });
        return response;
    })
}