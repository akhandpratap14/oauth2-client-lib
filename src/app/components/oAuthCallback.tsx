import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OAuthClient } from "../../../oauth-client-lib/oauth-client";
import { GOOGLE_OAUTH_CONFIG } from "../utils/google-oauth-config";
import toast from "react-hot-toast";
import axios from "axios";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { CircularProgress, Box } from "@mui/material";

const oauthClient = new OAuthClient(GOOGLE_OAUTH_CONFIG);

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
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            }
          );
          const userInfo = userInfoResponse.data;

          const isSigned = signIn({
            auth: {
              token: tokenResponse.access_token,
              type: "Bearer",
            },
          });

          if (isSigned) {
            navigate("/home", { state: { user: userInfo } });
          }
        } catch (e) {
          toast.error("Error during callback handling:", e);
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
