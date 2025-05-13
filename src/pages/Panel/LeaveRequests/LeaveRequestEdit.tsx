import React, { useState, useEffect } from "react";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import TextArea from "../../../components/form/input/TextArea";
import FullPageLoader from "../../../components/common/FullPageLoader";
import defaultAxios from "../../../utils/DefaultAxios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "../../../components/form/Select";

interface LeaveType {
  id: string;
  name: string;
}

function LeaveRequestEdit() {
  const { id } = useParams();
  const [LeaveRequest, setLeaveRequest] = useState<LeaveType[]>([]);
  const [data, setData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    attachment: null as File | null,
    replacement_person: "",
    delegated_task: "",
  });

  const [existingAttachmentUrl, setExistingAttachmentUrl] = useState<
    string | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    defaultAxios
      .get(`http://127.0.0.1:8000/api/v1/leave-requests/${id}`)
      .then((res) => {
        const responseData = res.data.data;

        let parsedAdditionalInfo = {
          replacement_person: "",
          delegated_task: "",
        };

        if (responseData.additional_info) {
          try {
            parsedAdditionalInfo = JSON.parse(responseData.additional_info);
          } catch (e) {
            console.error("Failed to parse additional_info:", e);
          }
        }
        setExistingAttachmentUrl(
          responseData.attachment ? responseData.attachment : null
        );

        setData({
          leave_type_id: responseData.leave_type_id,
          start_date: responseData.start_date,
          end_date: responseData.end_date,
          reason: responseData.reason,
          attachment: null,
          replacement_person: parsedAdditionalInfo.replacement_person || "",
          delegated_task: parsedAdditionalInfo.delegated_task || "",
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch leave request:", err);
        setLoading(false);
      });

    defaultAxios
      .get("http://127.0.0.1:8000/api/v1/leave-types")
      .then((res) => {
        setLeaveRequest(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch leave types:", err);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setData({ ...data, attachment: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("leave_type_id", data.leave_type_id);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("reason", data.reason);
    formData.append(
      "additional_info",
      JSON.stringify({
        replacement_person: data.replacement_person,
        delegated_task: data.delegated_task,
      })
    );
    if (data.attachment) {
      formData.append("attachment", data.attachment);
    }

    try {
      setLoading(true);
      await defaultAxios.post(
        `http://127.0.0.1:8000/api/v1/leave-requests/${id}?_method=PUT`,
        formData
      );
      navigate("/panel/leave-request", {
        state: {
          message: "Leave request successfully updated",
          status: "success",
        },
      });
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Edit Leave Request
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>
            Leave Type <span className="text-error-500">*</span>
          </Label>
          <Select
            placeholder="Select Leave Type"
            options={LeaveRequest.map((lt) => ({
              value: lt.id,
              label: lt.name,
            }))}
            onChange={(val) => setData({ ...data, leave_type_id: val })}
            defaultValue={data.leave_type_id}
          />
          {errors.leave_type_id && (
            <p className="text-sm text-red-500 mt-1">
              {errors.leave_type_id[0]}
            </p>
          )}
        </div>

        <div>
          <Label>
            Start Date <span className="text-error-500">*</span>
          </Label>
          <Input
            name="start_date"
            type="date"
            onChange={handleChange}
            value={data.start_date}
          />
          {errors.start_date && (
            <p className="text-sm text-red-500 mt-1">{errors.start_date[0]}</p>
          )}
        </div>

        <div>
          <Label>
            End Date <span className="text-error-500">*</span>
          </Label>
          <Input
            name="end_date"
            type="date"
            onChange={handleChange}
            value={data.end_date}
          />
          {errors.end_date && (
            <p className="text-sm text-red-500 mt-1">{errors.end_date[0]}</p>
          )}
        </div>

        <div>
          <Label>
            Reason <span className="text-error-500">*</span>
          </Label>
          <TextArea
            placeholder="Enter your reason"
            value={data.reason}
            onChange={(val) => setData({ ...data, reason: val })}
          />
          {errors.reason && (
            <p className="text-sm text-red-500 mt-1">{errors.reason[0]}</p>
          )}
        </div>

        <div>
          <Label>Attachment (optional)</Label>
          <Input
            type="file"
            name="attachment"
            onChange={handleFileChange}
            accept=".pdf"
          />
          {errors.attachment && (
            <p className="text-sm text-red-500 mt-1">{errors.attachment[0]}</p>
          )}
          {existingAttachmentUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Current Attachment:</p>
              <iframe
                src={"http://127.0.0.1:8000" + existingAttachmentUrl}
                title="Current Attachment"
                className="w-full h-64 border rounded"
              ></iframe>
              <p className="text-sm text-error-500 mt-1">
                Note: Only PDF files are allowed.
              </p>
            </div>
          )}
        </div>

        <div>
          <Label>Pengganti Selama Cuti</Label>
          <Input
            name="replacement_person"
            placeholder="Masukkan nama pengganti"
            onChange={handleChange}
            value={data.replacement_person}
          />
        </div>

        <div>
          <Label>Tugas yang Didelegasikan</Label>
          <Input
            name="delegated_task"
            placeholder="Contoh: Handle email harian, laporan mingguan"
            onChange={handleChange}
            value={data.delegated_task}
          />
        </div>

        <div className="flex justify-between">
          <Button
            text="Back"
            color="secondary"
            onClick={() => navigate("/panel/leave-request")}
          />
          <Button text="Update Request" color="primary" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default LeaveRequestEdit;
