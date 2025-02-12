import { getSocket } from '@/data/utils/socket';
import { useEffect, useState } from 'react';

interface Friend {
  _id: string;
  username: string;
  isOnline: boolean;
  lastSeen: Date;
}

export default function FriendList({
  userId,
  onSelectFriend,
}: {
  userId: string;
  onSelectFriend: (friendId: string) => void;
}) {
  const socket = getSocket();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch(`/api/friends/${userId}`)
      .then((res) => res.json())
      .then(setFriends);
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/messages/unreadCount");
        const data = await res.json();
        console.log(data)
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("🚨 Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  useEffect(() => {
    socket.on('userStatusUpdate', () => {
      fetch(`/api/friends/${userId}`)
        .then((res) => res.json())
        .then(setFriends);
    });

    return () => {
      socket.off('userStatusUpdate');
    };
  }, []);
  console.log(friends);

  const formatLastSeen = (date: any) => {
    if (!date) return 'Unknown';
    const diff = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 60000
    ); // in minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 24 * 60) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / (24 * 60))} days ago`;
  };

  return (
    <div>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Friends List</h2>
        {friends.length === 0 ? <p>No friends found</p> : null}
        {friends.map((friend) => (
          <button
            key={friend._id}
            onClick={() => onSelectFriend(friend._id)}
            className="block w-full text-left p-2 mt-2 bg-white rounded-lg shadow-sm hover:bg-blue-100"
          >
            <span
              className={`w-3 h-3 p-4 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
            >
              {friend.username}
              <span className="text-gray-600 text-sm">
                {friend.isOnline
                  ? 'Online'
                  : `Last seen ${formatLastSeen(friend.lastSeen)}`}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
