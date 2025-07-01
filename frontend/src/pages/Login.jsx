import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import { loginUser } from '../services/authService'
import {useAuth} from '../contexts/authContext'

const Login = () => {

  const {login} = useAuth();



  const [form,setForm] = useState({
    email: '',  
    password: ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({...form,[e.target.name]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const {token , user} = await loginUser(form);
    login({token, user});
      navigate('/dashboard');
    }catch(error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  }
  return (
    <>
    <div className='flex items-center justify-center h-screen bg-gray-700'>
      <form 
      onSubmit={handleSubmit}
      className='bg-white p-8 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
        <input type="email"
        name='email'
        placeholder='Email'
        className='w-full p-2 mb-4 border border-gray-300 rounded'
        onChange={handleChange}
        required
         />
        <input type="password"
        name='password'
        placeholder='Password'
        className='w-full p-2 mb-4 border border-gray-300 rounded'
        onChange={handleChange}
        required
         />
         <button
         type='submit'
         className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200' 
         >
          Login
         </button>
         <p className='text-center mt-4 text-gray-600'>
          Don't have an account? <span className='text-blue-500 cursor-pointer' onClick={() => navigate('/register')}>Register</span>
         </p>

      </form>
    </div>
    </>
  )
}


export default Login