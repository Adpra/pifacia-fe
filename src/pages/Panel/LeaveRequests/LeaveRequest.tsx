import { useEffect, useState } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/form/input/InputField";
import defaultAxios from "../../../utils/DefaultAxios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FullPageLoader from "../../../components/common/FullPageLoader";
import Select from "../../../components/form/Select";
import Audit from "../Audits/Audit";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import Label from "../../../components/form/Label";

interface LeaveRequestData {
  id: string;
  user: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  file: string;
}

interface Meta {
  current_page: number;
  last_page: number;
}

function LeaveRequest() {
  const { authUser } = useAuth();

  const location = useLocation();
  const [alert, setAlert] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequestData[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();

  const getLeaveRequest = (page = 1, keyword = "", status = "", sort = "") => {
    setLoading(true);
    defaultAxios
      .get(`http://127.0.0.1:8000/api/v1/leave-requests`, {
        params: {
          page,
          search: keyword,
          status,
          sort,
        },
      })
      .then((res) => {
        setLeaveRequest(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getLeaveRequest(1, search, filterStatus, sortOrder);

    if (location.state?.message) {
      setAlert({
        message: location.state.message,
        status: location.state.status,
      });

      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [filterStatus, sortOrder]);

  const handleSearch = () => {
    getLeaveRequest(1, search, filterStatus, sortOrder);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await defaultAxios.delete(
        `http://127.0.0.1:8000/api/v1/leave-requests/${id}`
      );
      setAlert({
        message: "Request deleted successfully.",
        status: "success",
      });
      getLeaveRequest(meta.current_page, search);
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert({
        message: "Failed to delete request.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const exportData = leaveRequest.map((item) => ({
      user: item.user,
      type: item.type,
      start_date: item.start_date,
      end_date: item.end_date,
      status: item.status,
      reason: item.reason,
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
    formData.append("table", "leave_requests");

    try {
      setLoading(true);

      const res = await defaultAxios.post(
        "http://127.0.0.1:8000/api/v1/excel/import",
        formData
      );

      console.log("Import success:", res.data);

      getLeaveRequest(meta.current_page, search, filterStatus, sortOrder);

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

  return (
    <>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white p-4 shadow text-base-100">
        <h1 className="text-3xl font-bold pb-5">Leave Request</h1>

        {loading ? (
          <FullPageLoader fullscreen={false} />
        ) : (
          <>
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
              <div className="flex gap-5 items-center">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Search by user and reason"
                    className="w-full"
                    name="search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <Button
                    text="Search"
                    color="secondary"
                    onClick={handleSearch}
                  />
                </div>
                <div>
                  <Select
                    placeholder="Filter By Status"
                    options={[
                      { value: "", label: "All" },
                      { value: "pending", label: "Pending" },
                      { value: "approve", label: "Approve" },
                      { value: "reject", label: "Reject" },
                    ]}
                    onChange={(value) => {
                      setFilterStatus(value);
                    }}
                    defaultValue={filterStatus}
                  />
                </div>
                <div>
                  <Select
                    placeholder="Sort By Date"
                    options={[
                      { value: "", label: "None" },
                      { value: "ASC", label: "Oldest" },
                      { value: "DESC", label: "Newest" },
                    ]}
                    onChange={(value) => {
                      setSortOrder(value);
                    }}
                    defaultValue={sortOrder}
                  />
                </div>
                <div>
                  <Button
                    text="Export"
                    color="info"
                    onClick={handleExport}
                    disabled={authUser?.role !== "admin"}
                  />
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
                <Link to="/panel/leave-request/create">
                  <Button text="Add Request" color="secondary" />
                </Link>
              </div>
            </div>
            <table className="table">
              <thead className="bg-base-100 text-white">
                <tr>
                  <th></th>
                  <th>user</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequest.map((item, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{item.user}</td>
                    <td>{item.type}</td>
                    <td>{item.start_date}</td>
                    <td>{item.end_date}</td>
                    <td>{item.reason}</td>
                    <td>
                      <span
                        className={` ${
                          item.status === "pending"
                            ? "text-warning"
                            : item.status === "approved"
                            ? "text-success"
                            : "text-error"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <Button
                        text="Edit"
                        color="warning"
                        onClick={() =>
                          navigate(`/panel/leave-request/edit/${item.id}`)
                        }
                        disabled={item.status !== "pending"}
                      />
                      <Button
                        text="Delete"
                        color="danger"
                        onClick={() => handleDelete(item.id)}
                        disabled={item.status !== "pending"}
                      />
                      <Button
                        text="Details"
                        color="info"
                        onClick={() =>
                          navigate(`/panel/leave-request/detail/${item.id}`)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {leaveRequest.length === 0 && (
              <div className="text-center py-5">
                <h1 className="text-1xl font-bold">No Leave Request Found</h1>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-4 gap-2">
              {[...Array(meta.last_page)].map((_, index) => {
                const page = index + 1;
                const isActive = meta.current_page === page;

                return (
                  <button
                    key={page}
                    onClick={() =>
                      getLeaveRequest(page, search, filterStatus, sortOrder)
                    }
                    className={`px-3 py-1 rounded ${
                      isActive ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Audits */}
      {authUser?.role === "admin" && <Audit type="LeaveRequest" />}
    </>
  );
}

export default LeaveRequest;
