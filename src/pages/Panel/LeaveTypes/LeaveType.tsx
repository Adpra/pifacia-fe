import { useEffect, useState } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/form/input/InputField";
import defaultAxios from "../../../utils/DefaultAxios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FullPageLoader from "../../../components/common/FullPageLoader";
import { CheckCircleIcon } from "../../../icons";
import { XCircleIcon } from "lucide-react";
import Select from "../../../components/form/Select";
interface TypeData {
  id: string;
  name: string;
  description: string;
  days: number;
  is_active: boolean;
}

interface Meta {
  current_page: number;
  last_page: number;
}

function LeaveType() {
  const location = useLocation();
  const [alert, setAlert] = useState<{
    message: string;
    status: string;
  } | null>(null);
  const [types, setTypes] = useState<TypeData[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState<string>("");
  const [sortOrder, setSortOrder] = useState("");

  const navigate = useNavigate();

  const getTypes = (page = 1, keyword = "", is_active = "", sort = "") => {
    setLoading(true);
    defaultAxios
      .get(`http://127.0.0.1:8000/api/v1/leave-types`, {
        params: {
          page,
          search: keyword,
          is_active,
          sort,
        },
      })
      .then((res) => {
        setTypes(res.data.data);
        setMeta(res.data.meta);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getTypes(1, search, filterActive, sortOrder);

    if (location.state?.message) {
      setAlert({
        message: location.state.message,
        status: location.state.status,
      });

      window.history.replaceState({}, document.title);

      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [filterActive, sortOrder]);

  const handleSearch = () => {
    getTypes(1, search, filterActive, sortOrder);
  };

  const changePage = (page: number) => {
    getTypes(page, search, filterActive, sortOrder);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this types?"
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await defaultAxios.delete(
        `http://127.0.0.1:8000/api/v1/leave-types/${id}`
      );
      setAlert({
        message: "Types deleted successfully.",
        status: "success",
      });
      getTypes(meta.current_page, search);
    } catch (error) {
      console.error("Delete failed:", error);
      setAlert({
        message: "Failed to delete types.",
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
        <h1 className="text-3xl font-bold pb-5">Leave Types</h1>

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
          <div className="flex gap-10 items-center">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search by name"
                className="w-full"
                name="search"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <Button text="Search" color="secondary" onClick={handleSearch} />
            </div>
            <div>
              <Select
                placeholder="Filter By Status"
                options={[
                  { value: "", label: "All" },
                  { value: "1", label: "Active" },
                  { value: "0", label: "Inactive" },
                ]}
                onChange={(value) => {
                  setFilterActive(value);
                }}
                defaultValue={filterActive}
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
          </div>

          <div className="flex justify-end py-5">
            <Link to="/panel/leave-type/create">
              <Button text="Add Types" color="secondary" />
            </Link>
          </div>
        </div>
        <table className="table">
          <thead className="bg-base-100 text-white">
            <tr>
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th>Days</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {types.map((item, index) => (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.days}</td>
                <td>
                  {item.is_active ? (
                    <CheckCircleIcon />
                  ) : (
                    <XCircleIcon className="text-red-500 w-5 h-5" />
                  )}
                </td>
                <td className="flex gap-2">
                  <Button
                    text="Edit"
                    color="warning"
                    onClick={() =>
                      navigate(`/panel/leave-type/edit/${item.id}`)
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

export default LeaveType;
