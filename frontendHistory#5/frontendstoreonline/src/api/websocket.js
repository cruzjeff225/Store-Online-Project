export const setupWebSocket = (userId, token, onNotification, onError) => {
  let socket;

  try {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    socket = new WebSocket(`${protocol}//${host}/ws?token=${encodeURIComponent(token)}`);
    
    socket.onopen = () => {
      console.log('WebSocket conectado');
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.tipo === 'notificacion') {
          console.log('Nueva notificación recibida:', data.data);
          onNotification(data.data); // Trigger the callback to update notifications in real-time
        }
      } catch (err) {
        console.error('Error al procesar mensaje WebSocket:', err);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError(error);
    };
    
    socket.onclose = () => {
      console.log('WebSocket desconectado');
    };
    
  } catch (error) {
    console.error('Error al configurar WebSocket:', error);
    onError(error);
  }
  
  return () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
};