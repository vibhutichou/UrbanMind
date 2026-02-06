import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (userId, onMessage) => {
  console.log("Attempting to connect to WebSocket for user:", userId);

  // If already connected, just subscribe
  if (stompClient && stompClient.connected) {
    console.log("Already connected. Subscribing...");
    subscribeToUser(stompClient, userId, onMessage);
    return;
  }

  // If there's an existing client but not connected, deactivate it first to be safe
  if (stompClient) {
    try {
      stompClient.deactivate();
    } catch (e) {
      console.warn("Error deactivating old client", e);
    }
  }

  // Use standard WebSocket URI to route through Gateway without SockJS /info handshake
  // Note: /ws/info is an internal SockJS endpoint. Using direct WebSocket passes valid Stomp frames directly.
  const client = new Client({
    brokerURL: 'ws://localhost:9000/ws/websocket',
    reconnectDelay: 5000,
    debug: (str) => console.log("[STOMP Debug]:", str),
    onConnect: () => {
      console.log("Connected to WebSocket via Gateway!");
      subscribeToUser(client, userId, onMessage);
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });

  stompClient = client; // Update global reference
  client.activate();
};

const subscribeToUser = (client, userId, onMessage) => {
  if (!client || !client.connected) {
    console.error("Cannot subscribe: Client not connected.");
    return;
  }

  // Private notifications
  client.subscribe(`/topic/notifications/${userId}`, (message) => {
    console.log("Received Private Message:", message.body);
    const notification = JSON.parse(message.body);
    onMessage(notification);
  });

  // Broadcast announcements
  client.subscribe(`/topic/announcements`, (message) => {
    console.log("Received Broadcast:", message.body);
    const notification = JSON.parse(message.body);
    onMessage(notification);
  });
};

export const disconnectSocket = () => {
  if (stompClient) {
    console.log("Disconnecting WebSocket...");
    stompClient.deactivate();
  }
};
