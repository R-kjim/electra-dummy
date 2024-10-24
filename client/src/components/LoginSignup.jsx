import React, { useContext, useState } from 'react';
import { AppContext } from '../../AppContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from "yup";


const LoginSignup = () => {
  
  const value=useContext(AppContext)
  const isRegistering=value.isRegistering
  const setIsRegistering=value.setIsRegistering
  const navigate=useNavigate()

  const formSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email")
      .required("Enter a valid email"),
  
    password: yup
      .string()
      .required("Must enter a password")
      .max(15, "Password must be at most 15 characters"),
  
    repeatPassword: yup
      .string()
      .max(15, "Repeat password must be at most 15 characters"),
    name: yup
      .string()
      .max(30, "Name must be at most 30 characters")
  });
  
  // Initialize formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      role:"Voter"
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    }
  });
  const handleSubmit = (formData) => {
    if (isRegistering) {
      if(formData.password!==formData.repeatPassword){
        toast.error("Passwords do not match")
      }
      else{
        fetch("https://electra-dummy.onrender.com/signup",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(formData)
        }).then(res=>{
          if(res.ok){
            toast.success("Registration successful. Proceed to login")
            setIsRegistering(false)
            return res.json()
          }else{
            return res.json().then(errorData=>{
              toast.error(errorData.error[0])
            })
          }
        })
        .catch(error=>console.log(error))
      }
    } else {
      const loginData={"email":formData.email,"password":formData.password}
      fetch("https://electra-dummy.onrender.com/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(loginData)
      })
      .then(res=>{
        if(res.ok){
          return res.json().then(data=>{
            localStorage.setItem("userId",data.user)
            localStorage.setItem("accessToken",data.access_token)
            localStorage.setItem("refreshToken",data.referesh_token)
            if(data.role==="Voter"){
              navigate(`/dashboard/user/${localStorage.getItem("userId")}`)
                window.location.reload()
            }
              else if(data.role==="Admin"){
                navigate(`/admin/dashboard/${localStorage.getItem("userId")}`)
                // window.location.reload()
              }
          })
        }else{
          return res.json().then(errorData=>{
            toast.error(errorData.error[0])
          })
        }
      })
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {isRegistering ? 'Register' : 'Login'}
      </h2>
      <form onSubmit={formik.handleSubmit}>
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            <p style={{ color: "red" }}> {formik.errors.name}</p>

          </div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          <p style={{ color: "red" }}> {formik.errors.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formik.password}
            onChange={formik.handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
          <p style={{ color: "red" }}> {formik.errors.password}</p>
        </div>
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-700">Repeat Password</label>
            <input
              type="password"
              name="repeatPassword"
              value={formik.repeatPassword}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
            <p style={{ color: "red" }}> {formik.errors.repeatPassword}</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-md font-semibold"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      {!isRegistering && <p className="mt-4 text-center">
        Forgot password?
        <Link to='/reset-password'
          className="text-blue-700 font-semibold ml-1"
        >Click here
        </Link>
      </p>}
      <p className="mt-4 text-center">
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-blue-700 font-semibold ml-1"
        >
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
};

export default LoginSignup;
