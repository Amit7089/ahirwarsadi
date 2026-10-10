
import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, RefreshCw, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const API = "https://ahirwarsadi-api.onrender.com";

function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReports = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/api/reports/my-reports`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setReports(response.data.reports || []);
      }
    } catch (error) {
      console.error("Fetch My Reports Error:", error);
      toast.error(
        error.response?.data?.message || "Reports load nahi ho payi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";

      case "Under Review":
        return "bg-blue-100 text-blue-800";

      case "Resolved":
        return "bg-green-100 text-green-800";

      case "Rejected":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    if (status === "Resolved") return <CheckCircle size={17} />;
    if (status === "Rejected") return <AlertCircle size={17} />;
    return <Clock size={17} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-rose-800">
              My Reports
            </h1>
            <p className="text-gray-500 mt-2">
              Apni submitted reports aur unka status yahan dekhein.
            </p>
          </div>

          <button
            onClick={fetchMyReports}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-rose-800 text-white px-5 py-3 rounded-xl hover:bg-rose-900 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Reports load ho rahi hain...
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Reports Yet
            </h2>
            <p className="text-gray-500 mt-2">
              Aapne abhi tak koi profile report nahi ki hai.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {reports.map((report) => (
              <div
                key={report._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                  <div className="flex items-center gap-4">
                    <img
                      src={
                        report.reportedUser?.profileImage ||
                        "https://via.placeholder.com/100"
                      }
                      alt="Reported profile"
                      className="w-16 h-16 rounded-full object-cover border"
                    />

                    <div>
                      <h2 className="font-semibold text-lg text-gray-800">
                        {report.reportedUser?.fullName || "User unavailable"}
                      </h2>

                      <p className="text-sm text-gray-500">
                        Report Reason: {report.reason}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(report.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(report.status)}`}
                  >
                    {getStatusIcon(report.status)}
                    {report.status}
                  </span>
                </div>

                {report.description && (
                  <div className="mt-5 bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Your Description
                    </p>
                    <p className="text-sm text-gray-700">
                      {report.description}
                    </p>
                  </div>
                )}

                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Admin Response
                  </p>

                  {report.adminNote ? (
                    <p className="text-sm text-gray-600 bg-rose-50 p-4 rounded-xl">
                      {report.adminNote}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Admin ne abhi koi note nahi diya hai.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;
