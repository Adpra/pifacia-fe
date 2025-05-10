import { Link } from "react-router-dom";
import Button from "../buttons/Button";

function Nav() {
  return (
    <div>
      <div className="navbar bg-neutral  text-white shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Paficia
          </Link>
        </div>
        <div className="flex-none">
          <Link to="/sign-in">
            <Button text="Login" color="warning" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Nav;
