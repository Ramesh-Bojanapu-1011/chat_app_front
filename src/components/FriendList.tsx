import { getSocket } from "@/data/utils/socket";
import { useEffect, useState } from "react";

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
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {},
  );

  useEffect(() => {
    fetch(`/api/friends/${userId}`)
      .then((res) => res.json())
      .then(setFriends);
  }, []);

  useEffect(() => {
    socket.on("userStatusUpdate", () => {
      fetch(`/api/friends/${userId}`)
        .then((res) => res.json())
        .then(setFriends);
    });
    socket.on("requestUpdate", () => {
      fetch(`/api/friends/${userId}`)
        .then((res) => res.json())
        .then(setFriends);
    });

    return () => {
      socket.off("requestUpdate");
      socket.off("userStatusUpdate");
    };
  }, [userId]);

  /* The `useEffect` hook you provided is responsible for fetching the unread message count from the
server and updating the state with that count. Here's a breakdown of what it does: */
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`/api/messages/unreadCount?userId=${userId}`);
        const data = await res.json();
        setUnreadCounts(data.unreadCounts);
        console.log(data.unreadCounts);
      } catch (error) {
        console.error("🚨 Error fetching unread count:", error);
      }
    };

    socket.on("unreadcount", () => {
      fetchUnreadCount();
    });
    fetchUnreadCount();

    return () => {
      socket.off("unreadcount");
    };
  }, []);

  console.log(friends);

  const formatLastSeen = (date: any) => {
    if (!date) return "Unknown";
    const diff = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 60000,
    ); // in minutes
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 24 * 60) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / (24 * 60))} days ago`;
  };

  return (
    <div>
      <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Friends List</h2>
        {friends.length === 0 ? <p>No friends found</p> : null}

        {friends.map((friend) => {
          const friendId = friend._id;

          return (
            <button
              key={friend._id}
              onClick={() => onSelectFriend(friend._id)}
              className="flex w-full text-left p-2 mt-2 bg-white rounded-lg justify-between shadow-sm hover:bg-blue-100"
            >
              <div
                className={`  flex w-fit p-4 items-center justify-center rounded-full ${friend.isOnline ? "bg-green-500" : "bg-gray-400"}`}
              >
                {friend.username}

                <span className="text-gray-600 text-sm">
                  {friend.isOnline
                    ? "Online"
                    : `Last seen ${formatLastSeen(friend.lastSeen)}`}
                </span>
              </div>
              {unreadCounts[friendId] && unreadCounts[friendId] > 0 && (
                <span className="text-xl  w-fit items-start justify-end p-3 rounded-2xl bg-green-500">
                  {unreadCounts[friendId]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
