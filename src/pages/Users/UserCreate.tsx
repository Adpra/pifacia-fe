import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/form/input/InputField";
import Button from "../../components/buttons/Button";
import defaultAxios from "../../utils/DefaultAxios";
import Label from "../../components/form/Label";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Select from "../../components/form/Select";
import FullPageLoader from "../../components/common/FullPageLoader";

interface Role {
  id: string;
  name: string;
}

function UserCreate() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const res = await defaultAxios.get(
          "http://127.0.0.1:8000/api/v1/roles"
        );
        setRoles(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil roles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setData({ ...data, role_id: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await defaultAxios.post("http://127.0.0.1:8000/api/v1/users", data);
      navigate("/panel/users", {
        state: { message: "User successfully created", status: "success" },
      });
    } catch (error) {
      const err = error as any;
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        navigate("/panel/users", {
          state: { message: "Failed to create user", status: "error" },
        });
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <FullPageLoader />;

  return (
    <div className="w-full mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>
            Name <span className="text-error-500">*</span>
          </Label>
          <Input
            name="name"
            placeholder="Enter name"
            value={data.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <Label>
            Email <span className="text-error-500">*</span>
          </Label>
          <Input
            name="email"
            placeholder="Enter email"
            value={data.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email[0]}</p>
          )}
        </div>

        <div>
          <Label>
            Password <span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </span>
          </div>
        </div>

        <div>
          <Label>
            Confirm Password <span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={handleChange}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password[0]}</p>
          )}
        </div>

        <div>
          <Label>
            Role <span className="text-error-500">*</span>
          </Label>
          <Select
            placeholder="Select Role"
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={handleRoleChange}
            defaultValue={data.role_id}
          />
          {errors.role_id && (
            <p className="text-sm text-red-500 mt-1">{errors.role_id[0]}</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            text="Back"
            color="secondary"
            onClick={() => navigate("/panel/user")}
          />
          <Button text="Save User" color="primary" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default UserCreate;
