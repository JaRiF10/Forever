const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from project directory (Index.html, draw.html, etc.)
app.use(express.static(path.join(__dirname)));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

// rooms: { roomId: [ {id, ws}, ... ] }
const rooms = new Map();
// Optional: pre-create permanent rooms that always exist server-side
const permanentRooms = new Set([ 'public-room' ]);
permanentRooms.forEach(r=>{ if (!rooms.has(r)) rooms.set(r, []); });

function send(ws, obj){ try{ ws.send(JSON.stringify(obj)); }catch(e){ console.error('send err', e); } }

wss.on('connection', function connection(ws){
  ws._id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
  ws._room = null;
  console.log('ws connected', ws._id);

  ws.on('message', function incoming(message){
    let msg = null;
    try{ msg = JSON.parse(message); }catch(e){ console.warn('invalid json', e); return; }

    if (msg.type === 'join' && msg.room){
      const room = msg.room;
      ws._room = room;
      if (!rooms.has(room)) rooms.set(room, []);
      const list = rooms.get(room);
      const peers = list.map(c=>c.id);
      // send joined info back to the joining client
      send(ws, { type: 'joined', you: ws._id, peers });
      // notify existing clients by keeping them in the room array
      list.push({ id: ws._id, ws });
      // If there was at least one existing peer before join, ask the first existing one to initiate an offer to the newcomer
      if (list.length >= 2){
        // find the newcomer index
        const newcomer = list[list.length - 1];
        const existing = list[0];
        if (existing && existing.ws && existing.id !== newcomer.id){
          send(existing.ws, { type: 'initiate', to: newcomer.id });
        }
      }
      return;
    }

    // Relay drawing events: forward to other clients in the same room
    if ((msg.type === 'draw' || msg.type === 'draw_partial' || msg.type === 'control') && ws._room){
      const room = ws._room;
      const list = rooms.get(room) || [];
      list.forEach(c=>{
        if (c.id === ws._id) return; // don't send back to sender
        if (c.ws && c.ws.readyState === WebSocket.OPEN){
          send(c.ws, Object.assign({}, msg, { from: ws._id }));
        }
      });
      return;
    }

    if (msg.type === 'signal' && msg.to){
      const room = ws._room;
      if (!room) return;
      const list = rooms.get(room) || [];
      const target = list.find(c=>c.id === msg.to);
      if (target && target.ws && target.ws.readyState === WebSocket.OPEN){
        send(target.ws, { type: 'signal', from: msg.from, data: msg.data });
      }
      return;
    }
  });

  ws.on('close', function(){
    // remove from room
    const room = ws._room;
    if (room && rooms.has(room)){
      const list = rooms.get(room).filter(c=>c.id !== ws._id);
      if (list.length) rooms.set(room, list); else rooms.delete(room);
    }
    console.log('ws closed', ws._id);
  });
});

server.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('WebSocket path: /ws');
});
