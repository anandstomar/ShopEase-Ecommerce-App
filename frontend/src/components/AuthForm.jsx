import { motion } from 'framer-motion';
import { useState } from 'react';
import { handleGoogleLogin } from '../firebase';

export default function AuthForm({ onSubmit, type}) {
  const [formData, setFormData] = useState({ name: '',email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form space-y-4">
      <h2 className="flex items-center justify-center text-xl font-semibold">
        {type === 'login' ? 'Login' : 'Register'}</h2>

        {type === 'register' && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="input"
          onChange={handleChange}
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input "
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required={type === 'login' ? true : false}
        className="input "
        onChange={handleChange}
      />
      <button type="submit" className="btn">
        {type === 'login' ? 'Login' : 'Register'}
      </button>
      <div className="text-center text-sm">or</div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={handleGoogleLogin}
        className="btn bg-red-500 text-white "
      >
        Sign in with Google
      </motion.button>
    </form>
  );
}


// import { useState } from 'react';

// export default function AuthForm({ onSubmit, type }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//   });

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="auth-form">
//       <h2>{type === 'login' ? 'Login' : 'Register'}</h2>

//       {type === 'register' && (
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           required
//           onChange={handleChange}
//         />
//       )}

//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         required
//         onChange={handleChange}
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         required
//         onChange={handleChange}
//       />

//       <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
//     </form>
//   );
// }

