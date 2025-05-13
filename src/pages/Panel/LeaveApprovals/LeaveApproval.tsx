import { useEffect, useState } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/form/input/InputField";
import defaultAxios from "../../../utils/DefaultAxios";
import { useLocation, useNavigate } from "react-router-dom";
import FullPageLoader from "../../../components/common/FullPageLoader";
import Select from "../../../components/form/Select";

interface LeaveApproval {
  id: string;
  user: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment: string | null;
  additional_info: string | null;
  status: string;
  note: string;
  approved_by_name: string;
  created_at: string;
}

interface Meta {
  current_page: number;
  last_page: number;
}

function LeaveApproval() {
  const location = useLocation();
  const navigate = useNavigate();

  const [alert, setAlert] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const [approvals, setApprovals] = useState<LeaveApproval[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1 });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = (page = 1, keyword = "", status = "", sort = "") => {
    setLoading(true);
    defaultAxios
      .get("http://127.0.0.1:8000/api/v1/leave-approvals", {
        params: { page, search: keyword, status, sort },
      })
      .then((res) => {
        setApprovals(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => console.error("Error fetching approvals:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(1, search, statusFilter, sortOrder);

    if (location.state?.message) {
      setAlert({
        message: location.state.message,
        status: location.state.status,
      });

      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusFilter, sortOrder]);

  const handleSearch = () => {
    fetchData(1, search, statusFilter, sortOrder);
  };

  const changePage = (page: number) => {
    fetchData(page, search, statusFilter, sortOrder);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this approval?")) return;

    try {
      setLoading(true);
      await defaultAxios.delete(
        `http://127.0.0.1:8000/api/v1/leave-approvals/${id}`
      );
      setAlert({
        message: "Approval deleted successfully.",
        status: "success",
      });
      fetchData(meta.current_page, search, statusFilter, sortOrder);
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert({
        message: "Failed to delete approval.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white p-4 shadow text-base-100">
      <h1 className="text-3xl font-bold pb-5">Leave Approvals</h1>

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

      <div className="flex flex-wrap justify-between items-center gap-4 py-5">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search (user / approved by)"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Button text="Search" color="secondary" onClick={handleSearch} />
        </div>

        <div className="flex gap-2">
          <Select
            placeholder="Filter by Status"
            options={[
              { value: "", label: "All" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
            onChange={(val) => setStatusFilter(val)}
            defaultValue={statusFilter}
          />
          <Select
            placeholder="Sort by Date"
            options={[
              { value: "", label: "None" },
              { value: "ASC", label: "Oldest First" },
              { value: "DESC", label: "Newest First" },
            ]}
            onChange={(val) => setSortOrder(val)}
            defaultValue={sortOrder}
          />
        </div>
      </div>

      {/* Table */}
      <table className="table">
        <thead className="bg-base-100 text-white">
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Type</th>
            <th>Date Range</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Note</th>
            <th>Approved By</th>
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.user}</td>
              <td>{item.type}</td>
              <td>
                {item.start_date} - {item.end_date}
              </td>
              <td>{item.reason}</td>
              <td>
                <span
                  className={`${
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
              <td>{item.note || "-"}</td>
              <td>{item.approved_by_name}</td>
              <td className="text-center">
                {item.attachment ? (
                  <a
                    href={`http://127.0.0.1:8000${item.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📄
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="flex gap-2">
                <Button
                  text="Edit"
                  color="warning"
                  onClick={() =>
                    navigate(`/panel/leave-approval/edit/${item.id}`)
                  }
                />
                <Button
                  text="Delete"
                  color="danger"
                  onClick={() => handleDelete(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        {[...Array(meta.last_page)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => changePage(page)}
              className={`px-3 py-1 rounded ${
                meta.current_page === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LeaveApproval;
