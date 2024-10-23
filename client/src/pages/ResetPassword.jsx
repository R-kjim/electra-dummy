import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from "yup";


const ResetPassword = () => {

  let navigate=useNavigate()

  const formSchema=yup.object().shape({
    email:yup.string().email("Invalid email").required("Must enter email"),
    password:yup.string().required("Must enter a name").max(15),
    confirmPassword:yup.string().required("Must be a name").max(15)
  })
  const formik=useFormik(
    {
        initialValues:{email:"",password:"",confirmPassword:""},
        validationSchema:formSchema,
        onSubmit:(values)=>{
            handleSubmit(values)
        }
    }
  )
  //function to navigate to login page and reload to update details
  function navigateFn(){
    navigate("/login")
    window.location.reload()
    toast.success("Password updated successsfully. Proceed to login")
  
  }
 

  const handleSubmit = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    fetch(`http://127.0.0.1:5555/user/${formData.email}`,{
        method:"PATCH",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    })
    .then(res=>{
        if(res.ok){navigateFn(); return res.json()}
        else{return res.json().then(data=>toast.error(data.error[0]))}
    })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Reset Your Password</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.email}
              onChange={formik.handleChange}
              className="border p-2 rounded-lg w-full"
              placeholder="Enter your email"
              required
            />
            <p style={{ color: "red" }}> {formik.errors.email}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.password}
              onChange={formik.handleChange}
              className="border p-2 rounded-lg w-full"
              placeholder="Enter new password"
              required
            />
            <p style={{ color: "red" }}> {formik.errors.password}</p>
            </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Repeat Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.confirmPassword}
              onChange={formik.handleChange}
              className="border p-2 rounded-lg w-full"
              placeholder="Repeat new password"
              required
            />
            <p style={{ color: "red" }}> {formik.errors.confirmPassword}</p>
            </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
