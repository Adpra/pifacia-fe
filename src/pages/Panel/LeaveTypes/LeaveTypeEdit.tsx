import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import Checkbox from "../../../components/form/input/Checkbox";
import FullPageLoader from "../../../components/common/FullPageLoader";
import defaultAxios from "../../../utils/DefaultAxios";

function LeaveTypeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    description: "",
    days: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);

  // Fetch data by ID
  useEffect(() => {
    const fetchLeaveType = async () => {
      try {
        const response = await defaultAxios.get(
          `http://127.0.0.1:8000/api/v1/leave-types/${id}`
        );
        const leaveType = response.data.data;
        setData({
          name: leaveType.name,
          description: leaveType.description || "",
          days: leaveType.days,
          is_active: leaveType.is_active,
        });
      } catch (error) {
        navigate("/panel/leave-type", {
          state: { message: "Failed to fetch leave type", status: "error" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveType();
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setData({
      ...data,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await defaultAxios.put(
        `http://127.0.0.1:8000/api/v1/leave-types/${id}`,
        data
      );

      navigate("/panel/leave-type", {
        state: { message: "Type successfully updated", status: "success" },
      });
    } catch (error) {
      const err = error as any;
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        navigate("/panel/leave-type", {
          state: { message: "Failed to update type", status: "error" },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Leave Type</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>
            Name <span className="text-error-500">*</span>
          </Label>
          <Input
            name="name"
            placeholder="Enter name"
            onChange={handleChange}
            value={data.name}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <Label>Description</Label>
          <TextArea
            placeholder="Enter description"
            onChange={(value) => setData({ ...data, description: value })}
            value={data.description}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description[0]}</p>
          )}
        </div>

        <div>
          <Label>
            Days <span className="text-error-500">*</span>
          </Label>
          <Input
            name="days"
            type="number"
            placeholder="Enter days"
            onChange={handleChange}
            value={data.days}
          />
          {errors.days && (
            <p className="text-sm text-red-500 mt-1">{errors.days[0]}</p>
          )}
        </div>

        <div>
          <Label>Active</Label>
          <Checkbox
            checked={data.is_active}
            onChange={(checked) => setData({ ...data, is_active: checked })}
          />
          {errors.is_active && (
            <p className="text-sm text-red-500 mt-1">{errors.is_active[0]}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            text="Back"
            color="secondary"
            onClick={() => navigate("/panel/leave-type")}
          />
          <Button text="Update Type" color="primary" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default LeaveTypeEdit;
