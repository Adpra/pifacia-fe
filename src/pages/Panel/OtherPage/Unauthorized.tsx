import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 text-center space-y-4 px-4">
      <h1 className="text-5xl font-bold text-error">Unauthorized</h1>
      <p className="text-2xl text-gray-400 font-semibold">403</p>
      <p className="text-base text-gray-300">
        You are not authorized to access this page.
      </p>
      <Link to="/panel">
        <button className="btn btn-primary mt-4">Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default Unauthorized;
