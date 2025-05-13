import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import defaultAxios from "../../utils/DefaultAxios";
import Button from "../buttons/Button";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setAlert({
        message: location.state.message,
        status: location.state.status,
      });

      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({});
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await defaultAxios.post(
        "http://127.0.0.1:8000/api/v1/login",
        data
      );
      const token = res.data.access_token;
      await login(token);
      navigate("/panel");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        const status = err.response.status;

        if (status === 422) {
          setErrors(err.response.data.errors);
        } else if (status === 401) {
          setMessage("Email atau password salah.");
        } else {
          setMessage("Terjadi kesalahan saat login.");
        }
      } else {
        setMessage("Tidak dapat terhubung ke server.");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-y-auto">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {alert && (
                  <div
                    className={`mb-4 p-3 rounded ${
                      alert.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {alert.message}
                  </div>
                )}
                {message && (
                  <div className="text-sm text-red-500">{message}</div>
                )}

                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    onChange={handleChange}
                    name="email"
                    value={data.email}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      name="password"
                      onChange={handleChange}
                      value={data.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    text="Sign In"
                  />
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account?
                <Link
                  to="/sign-up"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
