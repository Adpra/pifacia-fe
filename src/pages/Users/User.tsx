import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/buttons/Button";
import FullPageLoader from "../../components/common/FullPageLoader";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Meta {
  current_page: number;
  last_page: number;
}

function User() {
  const location = useLocation();
  const [alert, setAlert] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getUsers = (page = 1, keyword = "") => {
    setLoading(true);
    defaultAxios
      .get(`http://127.0.0.1:8000/api/v1/users?page=${page}&search=${keyword}`)
      .then((res) => {
        setUsers(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getUsers();

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

  const handleSearch = () => {
    getUsers(1, search);
  };

  const changePage = (page: number) => {
    getUsers(page, search);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this role?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await defaultAxios.delete(`http://127.0.0.1:8000/api/v1/users/${id}`);
      setAlert({
        message: "User deleted successfully.",
        status: "success",
      });
      getUsers(meta.current_page, search);
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert({
        message: "Failed to delete user.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white p-4 shadow text-base-100">
        <h1 className="text-3xl font-bold pb-5">Users</h1>

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

        <div className="flex justify-between items-center py-5">
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Search"
              className="w-full"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button text="Search" color="secondary" onClick={handleSearch} />
          </div>

          <div className="flex justify-end py-5">
            <Link to="/panel/user/create">
              <Button text="Add User" color="secondary" />
            </Link>
          </div>
        </div>
        <table className="table">
          <thead className="bg-base-100 text-white">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="flex gap-2">
                  <Button
                    text="Edit"
                    color="warning"
                    onClick={() => navigate(`/panel/user/edit/${user.id}`)}
                  />
                  <Button
                    text="Delete"
                    color="danger"
                    onClick={() => handleDelete(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(meta.last_page)].map((_, index) => {
            const page = index + 1;
            const isActive = meta.current_page === page;

            return (
              <button
                key={page}
                onClick={() => changePage(page)}
                className={`px-3 py-1 rounded ${
                  isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default User;
