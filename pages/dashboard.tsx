import Chat from '@/components/Chat';
import FriendList from '@/components/FriendList';
import FriendRequest from '@/components/FriendRequest';
import HandleRequests from '@/components/HandleRequests';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session } = useSession();
  // const router = useRouter();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
  }, []);



  return (
    <>
      {session && (
        <div className="p-6">
          <h1 className="text-2xl">Welcome, {session?.user?.email || ''}!</h1>
          <p>You are now logged in.</p>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
          <FriendRequest userId={session?.user?.id || ''} />
          <HandleRequests userId={session?.user?.id || ''} />
          <FriendList
            userId={session?.user?.id || ''}
            onSelectFriend={setSelectedFriendId}
          />
          {selectedFriendId ? (
            <Chat
              userId={session?.user?.id || ''}
              friendId={selectedFriendId}
            />
          ) : (
            <p className="p-4 bg-gray-200 rounded-lg">
              Select a friend to start chatting.
            </p>
          )}
        </div>
      )}
    </>
  );
}
