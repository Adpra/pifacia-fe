import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import FullPageLoader from "../../../components/common/FullPageLoader";
import defaultAxios from "../../../utils/DefaultAxios";

interface LeaveApprovalData {
  status: string;
  note: string;
  user: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  attachment: string | null;
  additional_info: {
    replacement_person: string;
    delegated_task: string;
  };
}

function LeaveApprovalEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [data, setData] = useState<LeaveApprovalData>({
    status: "",
    note: "",
    user: "",
    type: "",
    start_date: "",
    end_date: "",
    reason: "",
    attachment: "",
    additional_info: {
      replacement_person: "",
      delegated_task: "",
    },
  });

  useEffect(() => {
    const fetchApproval = async () => {
      try {
        const res = await defaultAxios.get(
          `http://127.0.0.1:8000/api/v1/leave-approvals/${id}`
        );
        const approval = res.data.data;

        if (approval.additional_info) {
          try {
            approval.additional_info = JSON.parse(approval.additional_info);
          } catch {
            approval.additional_info = {};
          }
        }
        setData({
          status: approval.status,
          note: approval.note || "",
          user: approval.user,
          type: approval.type,
          start_date: approval.start_date,
          end_date: approval.end_date,
          reason: approval.reason,
          attachment: approval.attachment,
          additional_info: {
            replacement_person: approval.additional_info.replacement_person,
            delegated_task: approval.additional_info.delegated_task,
          },
        });
      } catch (error) {
        navigate("/panel/leave-approval", {
          state: { message: "Failed to fetch approval", status: "error" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApproval();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await defaultAxios.put(
        `http://127.0.0.1:8000/api/v1/leave-approvals/${id}`,
        {
          status: data.status,
          note: data.note,
        }
      );
      navigate("/panel/leave-approval", {
        state: { message: "Approval updated successfully", status: "success" },
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        navigate("/panel/leave-approval", {
          state: { message: "Failed to update approval", status: "error" },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Leave Approval
      </h1>
      <div className="mb-4 text-sm text-gray-600 space-y-1">
        <p>
          <strong>User:</strong> {data.user}
        </p>
        <p>
          <strong>Type:</strong> {data.type}
        </p>
        <p>
          <strong>Dates:</strong> {data.start_date} to {data.end_date}
        </p>
        <p>
          <strong>Reason:</strong> {data.reason}
        </p>
        {data.attachment && (
          <p>
            <strong>Attachment:</strong>{" "}
            <a
              href={"http://127.0.0.1:8000" + data.attachment}
              target="_blank"
              rel="noreferrer"
            >
              📄
            </a>
          </p>
        )}
        {data.additional_info && (
          <div>
            <div className="mt-1">
              <p>
                <strong>Replacement Person:</strong>{" "}
                {data.additional_info.replacement_person}
              </p>
              <p>
                <strong>Delegated Task:</strong>{" "}
                {data.additional_info.delegated_task}
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>
            Status <span className="text-error-500">*</span>
          </Label>
          <Select
            options={[
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
            defaultValue={data.status}
            onChange={(val) => setData({ ...data, status: val })}
          />
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status[0]}</p>
          )}
        </div>

        <div>
          <Label>Note</Label>
          <TextArea
            placeholder="Enter note"
            value={data.note}
            onChange={(val) => setData({ ...data, note: val })}
          />
          {errors.note && (
            <p className="text-sm text-red-500 mt-1">{errors.note[0]}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            text="Back"
            color="secondary"
            onClick={() => navigate("/panel/leave-approval")}
          />
          <Button type="submit" color="primary" text="Update Approval" />
        </div>
      </form>
    </div>
  );
}

export default LeaveApprovalEdit;
