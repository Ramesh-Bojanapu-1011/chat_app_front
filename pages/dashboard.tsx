import Chat from '@/components/Chat';
import FriendList from '@/components/FriendList';
import FriendRequest from '@/components/FriendRequest';
import HandleRequests from '@/components/HandleRequests';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [session, router]);

  if (!session) {
    return null; // Prevent rendering until redirection happens
  }

  console.log(session);

  return (
    <div className="p-6">
      <h1 className="text-2xl">Welcome, {session.user?.email}!</h1>
      <p>You are now logged in.</p>
      <FriendRequest userId={session.user?.id || ''} />
      <HandleRequests userId={session.user?.id || ''} />
      <FriendList
        userId={session.user?.id || ''}
        onSelectFriend={setSelectedFriendId}
      />
      {selectedFriendId ? (
        <Chat userId={session.user?.id || ''} friendId={selectedFriendId} />
      ) : (
        <p className="p-4 bg-gray-200 rounded-lg">
          Select a friend to start chatting.
        </p>
      )}
    </div>
  );
}
