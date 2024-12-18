import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OAuthClient } from "../../../oauth-client-lib/oauth-client";
import { AUTHO_CONFIG } from "../utils/autho-config";
import toast from "react-hot-toast";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { CircularProgress, Box } from "@mui/material";

const oauthClient = new OAuthClient(AUTHO_CONFIG);

const CallbackPage = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const tokenResponse = await oauthClient.handleCallback({ code });

          const userInfoResponse = await axios.get(
            "https://dev-adqqhipcwhhafqtf.us.auth0.com/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );
          const userInfo = userInfoResponse.data;

          const isSigned = signIn({
            auth: {
              token: tokenResponse.id_token,
              type: "Bearer",
            },
            userState: {
              email: userInfo.email,
              email_verified: userInfo.email_verified,
              family_name: userInfo.family_name,
              given_name: userInfo.given_name,
              name: userInfo.name,
              picture: userInfo.picture,
              sub: userInfo.sub,
            },
          });

          if (isSigned) {
            navigate("/home", { state: { user: userInfo } });
          }
        } catch (e) {
          toast.error(`Error during callback handling: ${e}`);
        }
      } else {
        toast.error("Authorization code is missing from the URL");
      }
    };

    handleOAuthCallback();
  }, [navigate, signIn]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default CallbackPage;
