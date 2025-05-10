import Nav from "../components/navbar/Nav";
import Footer from "../components/footer/Footer";
import Button from "../components/buttons/Button";
import { Link } from "react-router-dom";

function Signin() {
  return (
    <>
      <Nav />
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mb-10 text-center">
          <p className="mt-5 text-bold">Sign in to your account</p>
        </div>

        <div className="card w-96 border-solid bg-neutral shadow-xl">
          <div className="card-body">
            <div className="mb-6 items-center justify-center text-center">
              <h2 className="font text-xl font-bold">Login</h2>
            </div>

            {/* User Name */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Email / Username"
                className="input input-bordered input-md w-full"
              />
            </div>

            {/* Password */}
            <div className="mb-2">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered input-md w-full"
              />
            </div>

            {/* I agree */}
            <div className="form-control mb-2">
              <label className="card-actions cursor-pointer">
                <input type="checkbox" className="checkbox" />
                <span className="label-text">Remember me</span>
              </label>
            </div>

            <div className="card-actions mb-2">
              <Button text="Login" />
            </div>

            <div className="space-x-1">
              <span className="space-x-1 text-sm">
                You don't have an account?
              </span>
              <span className="text-sm">
                <Link to="/sign-up" className="font-bold text-blue-400">
                  Sign Up
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signin;
