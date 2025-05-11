import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultAxios from "../../../utils/DefaultAxios";
import InputField from "../../../components/form/input/InputField";
import Button from "../../../components/buttons/Button";
import TextArea from "../../../components/form/input/TextArea";

function RoleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch role data by ID
  useEffect(() => {
    if (id) {
      defaultAxios
        .get(`http://127.0.0.1:8000/api/v1/roles/${id}`)
        .then((res) => {
          const role = res.data.data;
          setName(role.name);
          setDescription(role.description);
        })
        .catch((err) => {
          console.error("Error fetching role:", err);
        });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    defaultAxios
      .put(`http://127.0.0.1:8000/api/v1/roles/${id}`, { name, description })
      .then(() => {
        navigate("/panel/role");
      })
      .catch((err) => {
        console.error("Failed to update role:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full mx-auto mt-10 bg-white p-6 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Edit Role</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          placeholder="Role Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          placeholder="Description"
          value={description}
          onChange={setDescription}
          rows={4}
        />
        <div className="flex justify-between">
          <Button
            text="Back"
            color="secondary"
            onClick={() => navigate("/panel/role")}
          />
          <Button
            text={loading ? "Saving..." : "Update"}
            color="primary"
            disabled={loading}
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}

export default RoleEdit;
