import { useState } from "react";
import defaultAxios from "../../../utils/DefaultAxios";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";
import Label from "../../../components/form/Label";
import FullPageLoader from "../../../components/common/FullPageLoader";

function RoleCreate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await defaultAxios.post("http://127.0.0.1:8000/api/v1/roles", {
        name,
        description,
      });

      navigate("/panel/role", {
        state: { message: "Role successfully created", status: "success" },
      });
    } catch (error) {
      const err = error as any;
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        navigate("/panel/role", {
          state: { message: "Failed to create role", status: "error" },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Role</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>
            Role Name <span className="text-error-500">*</span>
          </Label>
          <Input
            placeholder="Enter role name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <Label>Description</Label>
          <TextArea
            placeholder="Enter description"
            value={description}
            onChange={setDescription}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description[0]}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            text="Back"
            color="secondary"
            onClick={() => navigate("/panel/role")}
          />
          <Button text="Save Role" color="primary" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default RoleCreate;
