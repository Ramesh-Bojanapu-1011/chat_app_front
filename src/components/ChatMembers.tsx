import { useEffect, useState } from 'react';

const ChatMembers = ({ conversationId }: { conversationId: string }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch(`/api/conversations/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setConversations(data));
  }, [conversationId]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Chat memebrse</h2>
      <ul>
        {conversations && conversations.length === 0 && <li>No members</li>}
        {conversations.map((conv: any) => (
          <li key={conv._id}>
            {conv.members
              .filter((member: any) => member._id !== conversationId) // Exclude the logged-in user
              .map((member: any) => member.username)
              .join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatMembers;
