import { Link } from "react-router-dom";
import Nav from "../components/navbar/Nav";
import Footer from "../components/footer/Footer";
import Button from "../components/buttons/Button";

function Signup() {
  return (
    <>
      <Nav />
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="mb-5 text-center">
          <p className="mt-5 text-bold ">Sign Up to your account</p>
        </div>

        <div className="card w-96 border-solid bg-neutral shadow-xl">
          <div className="card-body">
            <div className="mb-6 items-center justify-center text-center">
              <h2 className="font text-xl font-bold">Register</h2>
            </div>

            {/* Name */}
            <div className="mb-2">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered input-md w-full"
              />
            </div>

            {/* Email */}
            <div className="mb-2">
              <input
                type="email"
                placeholder="Email"
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
                <span className="label-text">
                  I agree the Terms and Conditions
                </span>
              </label>
            </div>

            <div className="card-actions mb-2">
              <Button text="Sign Up" color="primary" />
            </div>

            <div className="mb-2 space-x-1">
              <span className="text-sm ">Already have an account?</span>
              <span className="">
                <Link to="/sign-in" className="font-bold text-blue-400">
                  Sign In
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

export default Signup;
