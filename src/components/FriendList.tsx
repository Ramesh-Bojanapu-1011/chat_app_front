import { useEffect, useState } from "react";

interface Friend {
  _id: string;
  username: string;
}

export default function FriendList({
  userId,
  onSelectFriend,
}: {
  userId: string;
  onSelectFriend: (friendId: string) => void;
}) {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    fetch(`/api/friends/${userId}`)
      .then((res) => res.json())
      .then(setFriends);
  }, []);

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
            {friend.username}
          </button>
        ))}
      </div>
    </div>
  );
}
