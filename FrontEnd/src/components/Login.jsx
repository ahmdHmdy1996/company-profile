import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { DEFAULT_CREDENTIALS, MOCK_TOKEN } from "../config/auth";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const existingToken = localStorage.getItem("auth_token");
    if (existingToken) {
      // Verify token is still valid by making a test request
      apiService.setToken(existingToken);
      apiService
        .getCurrentUser()
        .then(() => {
          // Token is valid, login automatically
          onLogin(existingToken);
        })
        .catch(() => {
          // Token is invalid, clear it
          apiService.setToken(null);
        });
    }
  }, [onLogin]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const fillDemoCredentials = () => {
    setCredentials({
      email: DEFAULT_CREDENTIALS.email,
      password: DEFAULT_CREDENTIALS.password,
    });
    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const errors = {};

    if (!credentials.email.trim()) {
      errors.email = "يرجى إدخال البريد الإلكتروني";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = "يرجى إدخال بريد إلكتروني صحيح";
    }

    if (!credentials.password.trim()) {
      errors.password = "يرجى إدخال كلمة المرور";
    } else if (credentials.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون أكثر من 6 أحرف";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.login(credentials);
      console.log("Login response:", response);

      // Check if the response is successful and has the expected structure
      if (response.status && response.data && response.data.token) {
        setSuccess("تم تسجيل الدخول بنجاح");
        setTimeout(() => {
          apiService.setToken(response.data.token);
          onLogin(response.data.token);
        }, 500);
      } else {
        setError("فشل في تسجيل الدخول. حاول مرة أخرى");
      }
    } catch (err) {
      console.error("Login error:", err);

      // Clear any existing token on login error
      apiService.setToken(null);

      // If backend is not available, check demo credentials
      if (
        credentials.email === DEFAULT_CREDENTIALS.email &&
        credentials.password === DEFAULT_CREDENTIALS.password
      ) {
        setSuccess("تم تسجيل الدخول بنجاح باستخدام البيانات التجريبية");
        setTimeout(() => {
          apiService.setToken(MOCK_TOKEN);
          onLogin(MOCK_TOKEN);
        }, 1000);
      } else {
        // Handle different error scenarios
        if (err.status === 401) {
          setError("بيانات تسجيل الدخول غير صحيحة");
        } else if (err.isNetworkError) {
          setError("خطأ في الشبكة. تحقق من اتصال الإنترنت");
        } else if (err.status >= 500) {
          setError("خطأ في الخادم. حاول مرة أخرى لاحقاً");
        } else {
          setError(err.message || "حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى");
        }
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
            <p className="text-sm text-blue-800 font-medium mb-2">
              بيانات تسجيل الدخول التجريبية:
            </p>
            <p className="text-sm text-blue-600">
              البريد الإلكتروني: admin@company.com
            </p>
            <p className="text-sm text-blue-600 mb-3">
              كلمة المرور: password123
            </p>
            <button
              type="button"
              onClick={fillDemoCredentials}
              disabled={loading}
              className="w-full px-3 py-2 text-sm text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              استخدام البيانات التجريبية
            </button>
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
                disabled={loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="كلمة المرور"
                value={credentials.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-green-800">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="mr-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
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
