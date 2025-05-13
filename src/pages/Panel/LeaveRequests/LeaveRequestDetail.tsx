import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultAxios from "../../../utils/DefaultAxios";
import FullPageLoader from "../../../components/common/FullPageLoader";
import { ArrowLeftIcon } from "lucide-react";
import Button from "../../../components/buttons/Button";

function LeaveRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    defaultAxios
      .get(`http://127.0.0.1:8000/api/v1/leave-requests/${id}`)
      .then((res) => {
        const responseData = res.data.data;

        if (responseData.additional_info) {
          try {
            responseData.additional_info = JSON.parse(
              responseData.additional_info
            );
          } catch {
            responseData.additional_info = {};
          }
        }

        setData(responseData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <FullPageLoader />;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Leave Request Detail
        </h1>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate("/panel/leave-request")}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Leave Type</p>
            <p className="font-semibold text-gray-800">{data.type || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`badge ${statusColor(data.status)}`}>
              {data.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-semibold text-gray-800">{data.start_date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="font-semibold text-gray-800">{data.end_date}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">Reason</p>
          <p className="font-medium text-gray-800">{data.reason}</p>
        </div>

        {data.additional_info && (
          <>
            <div>
              <p className="text-sm text-gray-600">Replacement Person</p>
              <p className="text-gray-800 font-medium">
                {data.additional_info.replacement_person || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delegated Task</p>
              <p className="text-gray-800 font-medium">
                {data.additional_info.delegated_task || "-"}
              </p>
            </div>
          </>
        )}
        <Button
          text="Back"
          color="secondary"
          onClick={() => navigate("/panel/leave-request")}
        />

        {data.attachment && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Attachment (PDF)</p>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={"http://127.0.0.1:8000" + data.attachment}
                title="PDF Attachment"
                className="w-full h-96"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function statusColor(status: string) {
  switch (status) {
    case "pending":
      return "badge-warning text-gray-800";
    case "approved":
      return "badge-success text-gray-800";
    case "rejected":
      return "badge-error text-gray-800";
    default:
      return "badge-ghost text-gray-800";
  }
}

export default LeaveRequestDetail;
