import Chat from '@/components/Chat';
import FriendList from '@/components/FriendList';
import FriendRequest from '@/components/FriendRequest';
import HandleRequests from '@/components/HandleRequests';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session]);

  if (!session) {
    return <div>Not logged in</div>;
  }

  console.log(session.data);

  return (
    <>
      {session.data && (
        <div className="p-6">
          <h1 className="text-2xl">
            Welcome, {session?.data?.user?.email || ''}!
          </h1>
          <p>You are now logged in.</p>
          <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
          <FriendRequest userId={session?.data?.user?.id || ''} />
          <HandleRequests userId={session?.data?.user?.id || ''} />
          <FriendList
            userId={session?.data?.user?.id || ''}
            onSelectFriend={setSelectedFriendId}
          />
          {selectedFriendId ? (
            <Chat
              userId={session?.data?.user?.id || ''}
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
