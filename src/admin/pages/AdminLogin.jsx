import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [form,setForm] = useState({
    useremail:"",
    userpassword:""
  });

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit = async()=>{

    try{

      const res = await axios.post(
        "http://localhost:8000/auth/login",
        form
      );

      if(res.data.success){

        if(res.data.role !== "admin"){
          alert("Not an admin");
          return;
        }

        localStorage.setItem("token",res.data.token);
        localStorage.setItem("role",res.data.role);

        navigate("/admin/dashboard");

      }

    }catch{
      alert("Admin login failed");
    }

  };

  return(

    <Box
      sx={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}
    >

      <Box sx={{width:350}}>

        <Typography variant="h5">
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="useremail"
          onChange={handleChange}
          sx={{mt:2}}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          name="userpassword"
          onChange={handleChange}
          sx={{mt:2}}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{mt:2}}
          onClick={handleSubmit}
        >
          Login
        </Button>

      </Box>

    </Box>

  );
}