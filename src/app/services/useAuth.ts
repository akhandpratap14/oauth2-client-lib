import useInstance from "./instance";

export default function UseAuth() {
  const { instance: api } = useInstance();

  const loginUser = async (obj: { email: string; password: string }) => {
    const response = await api.post("login", obj);
    return response.data;
  };
  return {
    loginUser,
  };
}
