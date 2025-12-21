interface ErrorProps {
  message?: string;
}

export default function Error({ message = 'An error occurred' }: ErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

