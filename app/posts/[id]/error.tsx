'use client';

type Props = {
  error: Error;
};

const Error = ({ error }: Props) => {
  return <p>Could not fetch post details. {error.message}</p>;
};

export default Error;
