import { useState } from "react";

export default function FriendRequest({ userId }: { userId: string }) {
  const [friendEmail, setFriendEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendRequest = async () => {
    setMessage("");

    const res = await fetch("/api/friends/sendRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendEmail }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Friend request sent!");
    } else {
      setMessage(data.error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold">Send Friend Request</h2>
      <input
        type="text"
        placeholder="Enter friend's email"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
        className="mt-2 p-2 w-full border rounded-lg"
      />
      <button
        onClick={sendRequest}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Send Request
      </button>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
}
