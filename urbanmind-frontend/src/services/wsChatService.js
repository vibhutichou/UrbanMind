// wsChatService.js
// Minimal WebSocket wrapper for plain WebSocket backend (no STOMP/SockJS)

export const WS_BASE = 'ws://localhost:8084/ws/chat';

/**
 * createChatSocket
 * - roomId: string|number
 * - onMessage: function(messageObject)
 * - onOpen: function()
 * - onClose: function()
 * - onError: function(error)
 *
 * returns: { ws, send }
 * - ws: the WebSocket instance
 * - send: function(payload) that JSON.stringify(payload) and ws.send
 */
export function createChatSocket(roomId, onMessage = () => { }, onOpen = () => { }, onClose = () => { }, onError = () => { }) {
  const url = `${WS_BASE}?roomId=${encodeURIComponent(roomId)}`;
  const ws = new WebSocket(url);

  ws.onopen = () => {
    onOpen();
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('Failed to parse WebSocket message', err);
    }
  };

  ws.onclose = () => {
    onClose();
  };

  ws.onerror = (e) => {
    onError(e);
  };

  const send = (payload) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    } else {
      throw new Error('WebSocket is not open');
    }
  };

  return { ws, send };
}
