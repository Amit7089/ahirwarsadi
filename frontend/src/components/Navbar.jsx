
import { useEffect, useState, useCallback } from "react";
import {
  Heart,
  Menu,
  Bell,
  X,
  UserRound,
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Home,
  Search,
  Crown,
  Info,
  Mail,
} from "lucide-react";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

function Navbar() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/api/profile/me`, {
        withCredentials: true,
      });

      const user = response.data.user;

      setIsLoggedIn(true);
      setIsAdmin(user?.role === "admin");
      return true;
    } catch {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setNotifications([]);
      setUnreadCount(0);
      return false;
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const [notificationResponse, countResponse] = await Promise.all([
        axios.get(`${API}/api/notifications`, {
          withCredentials: true,
        }),
        axios.get(`${API}/api/notifications/unread-count`, {
          withCredentials: true,
        }),
      ]);

      if (notificationResponse.data.success) {
        setNotifications(notificationResponse.data.notifications || []);
      }

      if (countResponse.data.success) {
        setUnreadCount(countResponse.data.count || 0);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  }, []);

  useEffect(() => {
    let interval;
    let cancelled = false;

    const initializeNavbar = async () => {
      const loggedIn = await checkLoginStatus();

      if (loggedIn && !cancelled) {
        await fetchNotifications();

        interval = setInterval(() => {
          fetchNotifications();
        }, 15000);
      }
    };

    initializeNavbar();

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [checkLoginStatus, fetchNotifications, location.pathname]);

  const closeMenus = () => {
    setShowMobileMenu(false);
    setShowNotifications(false);
  };

  const markNotificationRead = async (notification) => {
    if (notification.isRead) return;

    await axios.patch(
      `${API}/api/notifications/${notification._id}/read`,
      {},
      { withCredentials: true }
    );

    setNotifications((previous) =>
      previous.map((item) =>
        item._id === notification._id
          ? { ...item, isRead: true }
          : item
      )
    );

    setUnreadCount((previous) => Math.max(0, previous - 1));
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationRead(notification);
      setShowNotifications(false);

      if (notification.type === "report_update") {
        return;
      }

      if (notification.sender?._id) {
        navigate(`/profiles/${notification.sender._id}`);
      }
    } catch (error) {
      console.error("Notification click error:", error);
    }
  };

  const handleInterestResponse = async (notification, status) => {
    if (!notification.relatedId) {
      alert("Interest ID nahi mili.");
      return;
    }

    try {
      setLoadingId(notification._id);

      await axios.put(
        `${API}/api/interest/${notification.relatedId}/respond`,
        { status },
        { withCredentials: true }
      );

      await markNotificationRead(notification);

      setNotifications((previous) =>
        previous.filter((item) => item._id !== notification._id)
      );

      setShowNotifications(false);

      alert(
        status === "accepted"
          ? "Interest accepted! ❤️ Match ban gaya."
          : "Interest rejected."
      );

      await fetchNotifications();
    } catch (error) {
      console.error("Interest response error:", error);
      alert(
        error.response?.data?.message ||
          "Action complete nahi ho paya. Dobara try karein."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API}/api/users/logout`,
        {},
        { withCredentials: true }
      );

      setIsLoggedIn(false);
      setIsAdmin(false);
      setNotifications([]);
      setUnreadCount(0);
      closeMenus();

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout nahi ho paya. Dobara try karein.");
    }
  };

  const homePath = isLoggedIn
    ? isAdmin
      ? "/admin"
      : "/dashboard"
    : "/";

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 transition-colors ${
      isActive ? "text-rose-700 font-semibold" : "text-gray-700 hover:text-rose-700"
    }`;

  const NavItem = ({ to, children, onClick, className = "" }) => (
    <Link
      to={to}
      onClick={onClick || closeMenus}
      className={`${navLinkClass({
        isActive:
          location.pathname === to ||
          (to !== "/" && location.pathname.startsWith(`${to}/`)),
      })} ${className}`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="relative z-50 w-full border-b border-rose-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          to={homePath}
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100">
            <Heart size={26} className="fill-rose-700 text-rose-700" />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-rose-800 sm:text-2xl">
              AhirwarSadi
            </h1>
            <p className="text-[11px] text-gray-500 sm:text-xs">
              रिश्तों की नई शुरुआत
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex">
          <NavItem to={homePath}>
            <Home size={17} />
            Home
          </NavItem>

          <NavItem to="/browse">
            <Search size={17} />
            Browse Profiles
          </NavItem>

          <NavItem to="/membership" className="font-medium">
            <Crown size={17} />
            Membership
          </NavItem>

          {isLoggedIn && isAdmin && (
            <>
              <NavItem to="/admin">
                <LayoutDashboard size={17} />
                Dashboard
              </NavItem>

              <NavItem to="/admin/users">
                <Users size={17} />
                Users
              </NavItem>

              <NavItem to="/admin/reports">
                <FileText size={17} />
                Reports
              </NavItem>
            </>
          )}

          {isLoggedIn && !isAdmin && (
            <>
              <NavItem to="/interests">Interests</NavItem>
              <NavItem to="/matches">Matches</NavItem>
              <NavItem to="/my-reports">
                <FileText size={17} />
                My Reports
              </NavItem>
            </>
          )}

          {!isLoggedIn && (
            <>
              <NavItem to="/about">
                <Info size={17} />
                About Us
              </NavItem>

              <NavItem to="/contact">
                <Mail size={17} />
                Contact
              </NavItem>
            </>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !showNotifications;
                  setShowNotifications(nextState);
                  if (nextState) fetchNotifications();
                }}
                className="relative rounded-full p-2 text-rose-800 transition hover:bg-rose-50"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <Bell size={23} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <button
                    aria-label="Close notifications"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setShowNotifications(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b p-4">
                      <div>
                        <h3 className="font-bold text-gray-800">
                          Notifications
                        </h3>
                        <p className="text-xs text-gray-500">
                          {unreadCount} unread
                        </p>
                      </div>

                      <button
                        onClick={() => setShowNotifications(false)}
                        className="rounded-full p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-700"
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="max-h-[65vh] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                          <Bell
                            size={30}
                            className="mx-auto mb-2 text-gray-300"
                          />
                          <p className="text-sm text-gray-500">
                            No notifications yet
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification._id}
                            className={`border-b p-4 last:border-b-0 ${
                              !notification.isRead ? "bg-rose-50/70" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                                <Heart
                                  size={18}
                                  className="text-rose-700"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {notification.title}
                                </p>

                                <p className="mt-1 break-words text-sm text-gray-600">
                                  {notification.message}
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {notification.type === "interest" &&
                                    !isAdmin && (
                                      <>
                                        <button
                                          disabled={
                                            loadingId === notification._id
                                          }
                                          onClick={() =>
                                            handleInterestResponse(
                                              notification,
                                              "accepted"
                                            )
                                          }
                                          className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-50"
                                        >
                                          {loadingId === notification._id
                                            ? "Please wait..."
                                            : "Accept ❤️"}
                                        </button>

                                        <button
                                          disabled={
                                            loadingId === notification._id
                                          }
                                          onClick={() =>
                                            handleInterestResponse(
                                              notification,
                                              "rejected"
                                            )
                                          }
                                          className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                                        >
                                          Reject
                                        </button>
                                      </>
                                    )}

                                  <button
                                    onClick={() =>
                                      handleNotificationClick(notification)
                                    }
                                    className="px-2 py-2 text-xs font-semibold text-rose-700 hover:underline"
                                  >
                                    {notification.type === "report_update"
                                      ? "Mark as Read"
                                      : "View Profile"}
                                  </button>
                                </div>
                              </div>

                              {!notification.isRead && (
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-600" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Desktop Login/Profile */}
          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <>
                {!isAdmin && (
                  <NavItem to="/profile" className="font-medium">
                    <UserRound size={18} />
                    My Profile
                  </NavItem>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-semibold text-rose-800 hover:text-rose-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-full bg-rose-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-900"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu((previous) => !previous)}
            className="rounded-lg p-2 text-rose-800 hover:bg-rose-50 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={showMobileMenu}
          >
            {showMobileMenu ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="max-h-[75vh] space-y-1 overflow-y-auto border-t border-rose-100 bg-white px-5 py-4 shadow-lg lg:hidden">
          <NavItem to={homePath} className="rounded-lg px-3 py-3">
            <Home size={18} />
            Home
          </NavItem>

          <NavItem to="/browse" className="rounded-lg px-3 py-3">
            <Search size={18} />
            Browse Profiles
          </NavItem>

          <NavItem to="/membership" className="rounded-lg px-3 py-3">
            <Crown size={18} />
            Membership
          </NavItem>

          {isLoggedIn && isAdmin && (
            <>
              <NavItem to="/admin" className="rounded-lg px-3 py-3">
                <LayoutDashboard size={18} />
                Admin Dashboard
              </NavItem>

              <NavItem to="/admin/users" className="rounded-lg px-3 py-3">
                <Users size={18} />
                Manage Users
              </NavItem>

              <NavItem to="/admin/reports" className="rounded-lg px-3 py-3">
                <FileText size={18} />
                Reports
              </NavItem>
            </>
          )}

          {isLoggedIn && !isAdmin && (
            <>
              <NavItem to="/profile" className="rounded-lg px-3 py-3">
                <UserRound size={18} />
                My Profile
              </NavItem>

              <NavItem to="/interests" className="rounded-lg px-3 py-3">
                <Heart size={18} />
                Interests
              </NavItem>

              <NavItem to="/matches" className="rounded-lg px-3 py-3">
                <Heart size={18} />
                Matches
              </NavItem>

              <NavItem to="/my-reports" className="rounded-lg px-3 py-3">
                <FileText size={18} />
                My Reports
              </NavItem>
            </>
          )}

          {!isLoggedIn && (
            <>
              <NavItem to="/about" className="rounded-lg px-3 py-3">
                <Info size={18} />
                About Us
              </NavItem>

              <NavItem to="/contact" className="rounded-lg px-3 py-3">
                <Mail size={18} />
                Contact Us
              </NavItem>

              <NavItem to="/login" className="rounded-lg px-3 py-3">
                Login
              </NavItem>

              <Link
                to="/register"
                onClick={closeMenus}
                className="mt-2 flex items-center justify-center rounded-xl bg-rose-800 px-4 py-3 font-semibold text-white hover:bg-rose-900"
              >
                Create Free Profile
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-3 font-semibold text-rose-700 hover:bg-rose-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
