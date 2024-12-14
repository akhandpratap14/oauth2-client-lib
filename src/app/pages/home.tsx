import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import useSignOut from "react-auth-kit/hooks/useSignOut";

const Home = () => {
  const location = useLocation();
  const user = location.state?.user;
  const navigate = useNavigate();
  const signOut = useSignOut();
  const logoutUser = () => {
    signOut();
    navigate("/login");
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        className="flex justify-center items-center"
        sx={{ maxWidth: 400, boxShadow: 3, borderRadius: 2, padding: 2 }}
      >
        <div>
          <img
            src={user.picture}
            height={1}
            width={1}
            alt="img"
            className="h-28 w-28 rounded-full shadow-sm"
          />
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" align="center">
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Email: {user.email}
          </Typography>
          <Typography
            variant="body2"
            color={user.email_verified ? "success.main" : "error.main"}
            align="center"
            sx={{ marginTop: 1 }}
          >
            {user.email_verified ? "Email Verified" : "Email Not Verified"}
          </Typography>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={() => {
          logoutUser();
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Home;
