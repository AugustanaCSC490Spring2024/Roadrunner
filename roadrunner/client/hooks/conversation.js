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
        }).then(response => {
            console.log("Fetching History")
            console.log(response.data)
            setConversationHistory(response.data)
        }).catch(err => {
            console.log("Error: ", err)
        });

        return response
    })

    return conversationHistory
}