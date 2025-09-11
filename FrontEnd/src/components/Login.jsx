import React, { useState } from "react";
import { apiService } from "../services/api";
import { DEFAULT_CREDENTIALS, MOCK_TOKEN } from "../config/auth";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if credentials match default ones (for demo purposes)
      if (
        credentials.email === DEFAULT_CREDENTIALS.email &&
        credentials.password === DEFAULT_CREDENTIALS.password
      ) {
        // Use mock token for demo
        apiService.setToken(MOCK_TOKEN);
        onLogin(MOCK_TOKEN);
      } else {
        // Try to authenticate with backend
        const response = await fetch(
          "https://backend-company-profile.codgoo.com/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );

        const data = await response.json();
console.log(data);

        if (response.ok) {
          apiService.setToken(data.token);
          onLogin(data.token);
        } else {
          setError(data.message || "فشل في تسجيل الدخول");
        }
      }
    } catch (err) {
      // If backend is not available, check demo credentials
      if (
        credentials.email === DEFAULT_CREDENTIALS.email &&
        credentials.password === DEFAULT_CREDENTIALS.password
      ) {
        apiService.setToken(MOCK_TOKEN);
        onLogin(MOCK_TOKEN);
      } else {
        setError("بيانات تسجيل الدخول غير صحيحة");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            للوصول إلى لوحة التحكم
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              بيانات تسجيل الدخول التجريبية:
            </p>
            <p className="text-sm text-blue-600">
              البريد الإلكتروني: admin@company.com
            </p>
            <p className="text-sm text-blue-600">كلمة المرور: password123</p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="البريد الإلكتروني"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="كلمة المرور"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
