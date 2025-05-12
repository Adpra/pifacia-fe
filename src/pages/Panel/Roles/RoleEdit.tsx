import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultAxios from "../../../utils/DefaultAxios";
import InputField from "../../../components/form/input/InputField";
import Button from "../../../components/buttons/Button";
import TextArea from "../../../components/form/input/TextArea";
import FullPageLoader from "../../../components/common/FullPageLoader";

function RoleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (id) {
      setLoading(true);
      defaultAxios
        .get(`http://127.0.0.1:8000/api/v1/roles/${id}`)
        .then((res) => {
          const role = res.data.data;
          setName(role.name);
          setDescription(role.description || "");
        })
        .catch((err) => {
          console.error("Error fetching role:", err);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    defaultAxios
      .put(`http://127.0.0.1:8000/api/v1/roles/${id}`, { name, description })
      .then(() => {
        navigate("/panel/role", {
          state: { message: "Role successfully updated", status: "success" },
        });
      })
      .catch((err) => {
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          console.error("Failed to update role:", err);
          navigate("/panel/role", {
            state: { message: "Failed to update role", status: "error" },
          });
        }
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="w-full mx-auto mt-10 bg-white p-6 rounded-lg shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Edit Role</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <InputField
            placeholder="Role Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <TextArea
            placeholder="Description"
            value={description}
            onChange={setDescription}
            rows={4}
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
