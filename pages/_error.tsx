import Error from 'next/error';

export async function getServerSideProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js');
  const errorCode = res.ok ? false : res.status;
  const json = await res.json();

  return {
    props: { errorCode, stars: json.stargazers_count },
  };
}

interface PageProps {
  errorCode: number | boolean;
  stars: number;
}

export default function Page({ errorCode, stars }: PageProps) {
  if (errorCode) {
    return <Error statusCode={errorCode as number} />;
  }

  return <div>Next stars: {stars}</div>;
}
