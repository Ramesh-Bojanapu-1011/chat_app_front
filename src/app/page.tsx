export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center h-screen gap-5 w-screen">
        <a href="/login" className="text-xl ">
          login
        </a>
        <a href="/dashboard" className="text-xl ">
          dashboard
        </a>
      </div>
    </>
  );
}
