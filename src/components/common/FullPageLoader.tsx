interface FullPageLoaderProps {
  fullscreen?: boolean;
  size?: number;
}

const FullPageLoader = ({
  fullscreen = true,
  size = 10,
}: FullPageLoaderProps) => {
  const containerClass = fullscreen
    ? "min-h-screen flex items-center justify-center bg-white"
    : "flex items-center justify-center";

  const spinnerSize = `h-${size} w-${size}`;

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        <svg
          className={`animate-spin text-blue-600 ${spinnerSize}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-gray-600 font-medium text-sm">Memuat data...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
