import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import defaultAxios from "../../utils/DefaultAxios";
import Input from "../../components/form/input/InputField";
import Button from "../../components/buttons/Button";
import FullPageLoader from "../../components/common/FullPageLoader";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Label from "../../components/form/Label";

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
  const { authUser } = useAuth();
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

  const handleExport = async () => {
    const exportData = users.map((item) => ({
      name: item.name,
      email: item.email,
      role: item.role,
    }));

    try {
      setLoading(true);
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v1/excel/export",
        {
          data: exportData,
          filename: "leave_requests_export",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authUser?.access_token}`,
          },
        }
      );

      const filePath = res.data.file_path;
      const fileUrl = `http://127.0.0.1:8000${filePath}`;

      setTimeout(() => {
        window.open(fileUrl, "_blank");
      }, 3000);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("table", "users");
    formData.append("unique_by[]", "email");

    try {
      setLoading(true);

      const res = await defaultAxios.post(
        "http://127.0.0.1:8000/api/v1/excel/import",
        formData
      );

      console.log("Import success:", res.data);

      getUsers(meta.current_page, search);

      setAlert({
        message: "Import success",
        status: "success",
      });
    } catch (error) {
      console.error("Import error:", error);
      setAlert({
        message: "Import failed",
        status: "error",
      });
    } finally {
      setLoading(false);
      e.target.value = "";
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
            <div>
              <Button text="Export" color="info" onClick={handleExport} />
            </div>
            <div className="flex gap-2 items-center">
              <Label className="text-indigo-400">Import</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImport}
                disabled={authUser?.role !== "admin"}
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </div>
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
