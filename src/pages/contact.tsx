import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSnackbar } from "notistack";


export default function ContactUs() {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    email: user?.data.email || "", // Default to user's main email
    title: "",
    description: "",
  });
  const [useMainEmail, setUseMainEmail] = useState(!!user?.data.email);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleEmailChange = () => {
    if (!user?.data.email) return;
    setUseMainEmail(!useMainEmail);
    setForm((prevForm) => ({
      ...prevForm,
      email: useMainEmail ? "" : user?.data.email || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.title || !form.description) {
      enqueueSnackbar("All fields are required!", {
        variant: "error",
      });
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Simulate sending the form data to a backend API
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      setSuccessMessage("Your message has been sent successfully.");
      setForm({ email: user?.data.email || "", title: "", description: "" });
      setUseMainEmail(!!user?.data.email);
    } catch  {
      enqueueSnackbar("Failed to send message. Please try again later.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-10 bg-gray-100 flex items-center justify-center">
      <div className="w-full flex flex-col lg:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left Section - Contact Info */}
        <div className="w-full lg:w-1/2 p-6 bg-gray-200">
          <h2 className="text-3xl font-bold text-textBlue mb-4">Contact Information</h2>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Main Office Address:</strong> Jl. Made-Up Street No. 123, Jakarta, Indonesia
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Email Address:</strong> cs@babycycle.com
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Phone:</strong> +62 821 8297 8729
          </p>

          {/* Google Map */}
          <iframe
            title="Google Map"
            src="https://maps.google.com/maps?q=Jakarta%20Indonesia&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="250px"
            className="rounded-lg border-2 border-gray-300"
            loading="lazy"
          ></iframe>
        </div>

        {/* Right Section - Contact Form */}
        <div className="w-full lg:w-1/2 p-6">
          <h1 className="text-4xl font-medium text-textBlue mb-4">Contact Us</h1>
          <form onSubmit={handleSubmit}>
            {/* Preferred Email */}
            <label className="block mb-2 text-textGray">Preferred Email:</label>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={useMainEmail}
                onChange={handleEmailChange}
                disabled={!user?.data.email} // Disable if email is "not available"
                className="mr-2"
              />
              <span className="text-sm">
                {user?.data.email
                  ? `Use my main email (${user?.data.email})`
                  : "Main email not available"}
              </span>
            </div>
            {!useMainEmail && (
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none"
              />
            )}

            {/* Title */}
            <label className="block mb-2 text-textGray">Title:</label>
            <input
              type="text"
              placeholder="Enter the title of your message"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none"
            />

            {/* Description */}
            <label className="block mb-2 text-textGray">Description:</label>
            <textarea
              placeholder="Enter the description of your message"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              className="w-full p-3 border mb-4 focus:ring-2 focus:ring-buttonBlue focus:outline-none"
              rows={5}
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-buttonBlue hover:bg-textBlue text-white py-2 rounded transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          {/* Error and Success Messages */}
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
        </div>
      </div>
    </div>
  );
}
