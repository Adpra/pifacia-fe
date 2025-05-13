import { useEffect, useState } from "react";
import defaultAxios from "../../../utils/DefaultAxios";
import Button from "../../../components/buttons/Button";
import FullPageLoader from "../../../components/common/FullPageLoader";
import TextArea from "../../../components/form/input/TextArea";
import Input from "../../../components/form/input/InputField";

interface LeaveApproval {
  id: string;
  status: "pending" | "approved" | "rejected";
  reason: string;
  start_date: string;
  end_date: string;
  user: string;
  type: string;
  attachment: string;
  user_id: string;
  additional_info: {
    replacement_person: string;
    delegated_task: string;
  };
}

export default function LeaveApprovalRequest() {
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState<LeaveApproval[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchApprovals = () => {
    setLoading(true);
    defaultAxios
      .get("http://127.0.0.1:8000/api/v1/leave-requests/approval", {
        params: {
          search,
        },
      })
      .then((res) => {
        const responseData = res.data.data;

        const parsedData = responseData.map((item: any) => {
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
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setLoading(true);
    setFormErrors({});
    setSubmitError(null);

    const note = noteMap[id] || "";
    const requestItem = approvals.find((item) => item.id === id);

    if (!requestItem) {
      setSubmitError("Leave request not found.");
      setLoading(false);
      return;
    }

    try {
      await defaultAxios.post("http://127.0.0.1:8000/api/v1/leave-approvals", {
        leave_request_id: requestItem.id,
        user_id: requestItem.user_id,
        status,
        note,
      });
      fetchApprovals();
    } catch (error) {
      const err = error as any;

      if (err.response?.status === 422) {
        setFormErrors(err.response.data.errors);
      } else {
        setSubmitError("Failed to process approval request.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  if (loading) return <FullPageLoader />;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Leave Approval Requests
      </h1>

      <div className="flex gap-2 mb-4">
        <Input
          name="search"
          placeholder="Search by user name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button text="Search" onClick={fetchApprovals} />
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}

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
                <td>
                  <div className="font-semibold">{item.user ?? "-"}</div>
                </td>
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
                      href={"http://127.0.0.1:8000" + item.attachment}
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
                  {formErrors.note && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.note[0]}
                    </p>
                  )}
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
      </div>
    </div>
  );
}
