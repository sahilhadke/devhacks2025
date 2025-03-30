import {
  Card,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return (
    <div className="relative flex items-start justify-center min-h-screen pt-16"> {/* Added pt-16 for top padding */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover"
          alt="background"
        />
      </div>
      
      {/* Card positioned higher */}
      <Card className="w-full max-w-md mx-auto z-10 mt-8"> {/* Added mt-8 for additional top margin */}
        <CardBody className="p-8">
          <div className="text-center">
            <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
            <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
              Enter your email and password to Sign In.
            </Typography>
          </div>
          
          <div className="mt-8 mb-2">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const { email, name, picture } = jwtDecode(credentialResponse.credential) || {};
                  const user = {
                    email,
                    name,
                    picture,
                  };
                  login(user);
                  navigate("/dashboard/home");
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default SignIn;