import { useState } from "react";
import defaultAxios from "../../../utils/DefaultAxios";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/form/input/InputField";
import TextArea from "../../../components/form/input/TextArea";

function RoleCreate() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await defaultAxios.post("http://127.0.0.1:8000/api/v1/roles", {
        name,
        description,
      });

      navigate("/panel/role");
    } catch (error) {
      console.error("Gagal membuat role:", error);
      alert("Gagal menyimpan data");
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Role</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text font-semibold">Role Name</span>
          </label>
          <Input
            placeholder="Enter role name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text font-semibold">Description</span>
          </label>
          <TextArea
            placeholder="Enter description"
            value={description}
            onChange={setDescription}
          />
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
