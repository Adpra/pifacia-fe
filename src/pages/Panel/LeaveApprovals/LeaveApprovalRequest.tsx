import { useEffect, useState } from "react";
import defaultAxios from "../../../utils/DefaultAxios";
import Button from "../../../components/buttons/Button";
import FullPageLoader from "../../../components/common/FullPageLoader";
import TextArea from "../../../components/form/input/TextArea";
import Input from "../../../components/form/input/InputField";
import Select from "../../../components/form/Select";

interface LeaveApproval {
  id: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  start_date: string;
  end_date: string;
  user: string;
  type: string;
  additional_info: {
    replacement_person: string;
    delegated_task: string;
  };
  attachment: string;
  user_id: string;
}
interface Meta {
  current_page: number;
  last_page: number;
}

export default function LeaveApprovalRequest() {
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState<LeaveApproval[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1 });

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const fetchApprovals = (page = 1, keyword = "", sort = "") => {
    setLoading(true);
    defaultAxios
      .get("http://127.0.0.1:8000/api/v1/leave-requests/approval", {
        params: {
          page,
          search: keyword,
          sort,
        },
      })
      .then((res) => {
        const parsedData = res.data.data.map((item: any) => {
          let additional_info = {};
          if (typeof item.additional_info === "string") {
            try {
              additional_info = JSON.parse(item.additional_info);
            } catch {
              additional_info = {};
            }
          } else {
            additional_info = item.additional_info || {};
          }

          return {
            ...item,
            additional_info,
          };
        });

        setApprovals(parsedData);
        setMeta(res.data.meta);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setLoading(true);
    const note = noteMap[id] || "";
    try {
      await defaultAxios.post(`http://127.0.0.1:8000/api/v1/leave-approvals`, {
        leave_request_id: id,
        user_id: approvals.find((item) => item.id === id)?.user_id,
        status,
        note,
      });
      fetchApprovals(meta.current_page, search, sortOrder);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals(1, search, sortOrder);
  }, [sortOrder]);

  const handleSearch = () => {
    fetchApprovals(1, search, sortOrder);
  };

  const changePage = (page: number) => {
    fetchApprovals(page, search, sortOrder);
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Leave Approval Requests
      </h1>
      <div className="flex gap-10 items-center flex-wrap mb-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search"
            className="w-full"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Button text="Search" color="secondary" onClick={handleSearch} />
        </div>
        <div>
          <Select
            placeholder="Sort By"
            options={[
              { value: "ASC", label: "Oldest" },
              { value: "DESC", label: "Newest" },
            ]}
            onChange={(value) => setSortOrder(value)}
            defaultValue={sortOrder}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Start date</th>
              <th>End date</th>
              <th>Replacement</th>
              <th>Task</th>
              <th>Status</th>
              <th>Attachment</th>
              <th>Note</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {approvals.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.user ?? "-"}</td>
                <td>{item.type ?? "-"}</td>
                <td>{item.reason ?? "-"}</td>
                <td>{item.start_date ?? "-"}</td>
                <td>{item.end_date ?? "-"}</td>
                <td>{item.additional_info.replacement_person ?? "-"}</td>
                <td>{item.additional_info.delegated_task ?? "-"}</td>
                <td>
                  <p className="font-semibold text-warning">
                    {item.status ?? "-"}
                  </p>
                </td>
                <td className="text-center">
                  {item.attachment ? (
                    <a
                      href={`http://127.0.0.1:8000${item.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-800"
                    >
                      📄
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <TextArea
                    placeholder="Note"
                    value={noteMap[item.id] || ""}
                    onChange={(value) =>
                      setNoteMap((prev) => ({ ...prev, [item.id]: value }))
                    }
                  />
                </td>
                <td className="flex gap-2">
                  <Button
                    text="Approve"
                    color="success"
                    onClick={() => handleAction(item.id, "approved")}
                  />
                  <Button
                    text="Reject"
                    color="danger"
                    onClick={() => handleAction(item.id, "rejected")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {approvals.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No approval requests found.
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
    </div>
  );
}
