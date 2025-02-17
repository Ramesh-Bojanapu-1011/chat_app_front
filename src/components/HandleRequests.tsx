import { getSocket } from '@/data/utils/socket';
import { useEffect, useState } from 'react';

interface Request {
  _id: string;
  username: string;
  email: string;
}

export default function HandleRequests({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<Request[]>([]);

  const socket = getSocket();

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch(`/api/friends/getRequests?userId=${userId}`);
      const data = await res.json();
      console.log(data);
      setRequests(data.requests);
    };

    socket.on('requestUpdate', () => {
      fetchRequests();
    });

    fetchRequests();
    return () => {
      socket.off('requestUpdate');
    };
  }, [userId]);

  //   console.log(requests)

  const handleRequest = async (
    friendId: string,
    action: 'accept' | 'reject'
  ) => {
    await fetch('/api/friends/handleRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, friendId, action }),
    });
    if (action == 'accept') {
      socket.emit('acceptRequest', friendId, userId);
    }

    setRequests((prev) => prev.filter((req) => req._id !== friendId));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Friend Requests</h2>
      {requests.length === 0 ? <p>No pending requests</p> : null}
      {requests.map((req, index) => (
        <div
          key={index}
          className="mt-2 p-2 bg-white rounded-lg shadow-sm flex justify-between"
        >
          <p>{req.username}</p>
          <div>
            <button
              onClick={() => handleRequest(req._id, 'accept')}
              className="bg-green-500 text-white px-2 py-1 rounded-lg"
            >
              Accept
            </button>
            <button
              onClick={() => handleRequest(req._id, 'reject')}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
