import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function SignOut() {
  const { logout } = useContext(AuthContext);

  logout();

    // Redirect to the sign-in page or any other page after logout
    window.location.href = "/auth/sign-in";

  return null;
}
