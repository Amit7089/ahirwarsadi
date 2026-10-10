
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Send, ArrowLeft, Heart } from "lucide-react";
import { toast } from "sonner";

function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");

  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ===== READ RECEIPT HELPER =====

  const markMessagesAsRead = (socket, chatMatchId) => {
    if (socket?.connected && chatMatchId) {
      socket.emit("chat:read", chatMatchId);
    }
  };

  useEffect(() => {
    let socket;
    let isMounted = true;

    const setupChat = async () => {
      try {
        const matchRes = await axios.get(
          "https://ahirwarsadi-api.onrender.com/api/match",
          {
            withCredentials: true,
          }
        );

        const currentId = matchRes.data.currentUserId;

        if (!isMounted) return;

        setCurrentUserId(currentId);

        const currentMatch = matchRes.data.matches?.find(
          (item) => item._id.toString() === matchId
        );

        const otherUser = currentMatch?.users?.find(
          (user) =>
            user._id?.toString() !== currentId?.toString()
        );

        setPartner(otherUser || null);

        // ===== LOAD OLD MESSAGES =====

        const chatRes = await axios.get(
          `https://ahirwarsadi-api.onrender.com/api/chat/${matchId}`,
          {
            withCredentials: true,
          }
        );

        if (!isMounted) return;

        setMessages(chatRes.data.messages || []);

        // ===== SOCKET CONNECTION =====

        socket = io("https://ahirwarsadi-api.onrender.com", {
          withCredentials: true,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          setConnected(true);

          socket.emit("chat:join", matchId, (response) => {
            if (!response?.success) {
              toast.error(
                response?.message || "Chat join nahi ho payi"
              );
              return;
            }

            // Chat open hone par received messages read mark karo
            markMessagesAsRead(socket, matchId);
          });
        });

        socket.on("connect_error", (error) => {
          setConnected(false);

          toast.error(
            error.message || "Connection failed"
          );
        });

        socket.on("disconnect", () => {
          setConnected(false);
        });

        // ===== TYPING INDICATOR =====

        socket.on("chat:typing", (data) => {
          const typingUserId = data?.userId?.toString();

          if (typingUserId === currentId?.toString()) {
            return;
          }

          setTypingUserName(
            otherUser?.fullName || "Partner"
          );

          setIsTyping(true);

          clearTimeout(typingTimeoutRef.current);

          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTypingUserName("");
          }, 2000);
        });

        socket.on("chat:stop-typing", (data) => {
          const typingUserId = data?.userId?.toString();
          const partnerId = otherUser?._id?.toString();

          if (typingUserId === partnerId) {
            setIsTyping(false);
            setTypingUserName("");

            clearTimeout(typingTimeoutRef.current);
          }
        });

        // ===== RECEIVE MESSAGE =====

        socket.on("chat:receive", (newMessage) => {
          if (!isMounted) return;

          setMessages((prev) => {
            const alreadyExists = prev.some(
              (msg) =>
                msg._id?.toString() ===
                newMessage._id?.toString()
            );

            if (alreadyExists) {
              return prev;
            }

            return [...prev, newMessage];
          });

          setIsTyping(false);
          setTypingUserName("");

          const senderId =
            typeof newMessage.sender === "object"
              ? newMessage.sender?._id
              : newMessage.sender;

          // Partner ka message aaya toh read mark karo
          if (
            senderId?.toString() !== currentId?.toString()
          ) {
            markMessagesAsRead(socket, matchId);
          }
        });

        // ===== REAL-TIME SEEN STATUS =====

        socket.on("chat:read", (data) => {
          if (
            data?.matchId?.toString() !==
            matchId?.toString()
          ) {
            return;
          }

          const readerId = data?.readerId?.toString();

          // Apne hi read event ko ignore karo
          if (readerId === currentId?.toString()) {
            return;
          }

          setMessages((prev) =>
            prev.map((msg) => {
              const senderId =
                typeof msg.sender === "object"
                  ? msg.sender?._id
                  : msg.sender;

              // Sirf apne messages ko Seen mark karo
              if (
                senderId?.toString() ===
                currentId?.toString()
              ) {
                return {
                  ...msg,
                  isRead: true,
                };
              }

              return msg;
            })
          );
        });
      } catch (error) {
        console.error("Chat Error:", error);

        toast.error(
          error.response?.data?.message ||
            "Chat load nahi ho payi"
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setupChat();

    return () => {
      isMounted = false;

      clearTimeout(typingTimeoutRef.current);

      socket?.disconnect();
      socketRef.current = null;
    };
  }, [matchId]);

  // ===== AUTO SCROLL =====

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ===== SEND MESSAGE =====

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (!socketRef.current?.connected) {
      toast.error("Chat server se connection nahi hai");
      return;
    }

    socketRef.current.emit(
      "chat:send",
      {
        matchId,
        message: message.trim(),
      },
      (response) => {
        if (!response?.success) {
          toast.error(
            response?.message || "Message send nahi hua"
          );
        }
      }
    );

    socketRef.current.emit(
      "chat:stop-typing",
      matchId
    );

    setIsTyping(false);
    setTypingUserName("");
    setMessage("");
  };

  // ===== LOADING =====

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">

      {/* ===== CHAT HEADER ===== */}

      <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3 border-b">
        <button
          onClick={() => navigate("/matches")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="relative">
          <img
            src={
              partner?.profileImage ||
              "https://ui-avatars.com/api/?name=User&background=fce7f3&color=db2777"
            }
            alt={partner?.fullName || "Matched User"}
            className="w-12 h-12 rounded-full object-cover border"
          />

          {connected && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 truncate">
            {partner?.fullName || "Matched User"}
          </h2>

          <p className="text-xs text-gray-500">
            {connected ? "Connected" : "Connecting..."}
          </p>
        </div>

        <Heart className="text-pink-500" size={22} />
      </div>

      {/* ===== MESSAGES AREA ===== */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.length === 0 && (
          <div className="text-center mt-16">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="text-pink-600" size={28} />
            </div>

            <h3 className="font-semibold text-gray-700">
              Start Your Conversation ❤️
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Apni baat yahan se shuru karein.
            </p>
          </div>
        )}

        {/* ===== TYPING INDICATOR ===== */}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm text-sm">
              <span className="font-medium text-pink-600">
                {typingUserName || "Partner"}
              </span>{" "}
              is typing
              <span className="inline-block animate-pulse ml-1">
                ...
              </span>
            </div>
          </div>
        )}

        {/* ===== MESSAGE BUBBLES ===== */}

        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "object"
              ? msg.sender?._id
              : msg.sender;

          const isMine =
            senderId?.toString() ===
            currentUserId?.toString();

          const isSeen = msg.isRead === true;

          return (
            <div
              key={msg._id}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[65%] rounded-2xl px-4 py-2 shadow-sm ${
                  isMine
                    ? "bg-pink-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                {!isMine && (
                  <p className="text-xs font-semibold text-pink-600 mb-1">
                    {msg.sender?.fullName ||
                      partner?.fullName}
                  </p>
                )}

                <p className="break-words whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="flex items-center justify-end gap-1 mt-1">

                  <span
                    className={`text-[10px] ${
                      isMine
                        ? "text-pink-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* ===== READ RECEIPT UI ===== */}

                  {isMine && (
                    <span
                      title={isSeen ? "Seen" : "Sent"}
                      className={`text-[11px] font-semibold ${
                        isSeen
                          ? "text-sky-200"
                          : "text-pink-100"
                      }`}
                    >
                      {isSeen ? "✓✓ Seen" : "✓"}
                    </span>
                  )}

                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* ===== MESSAGE INPUT ===== */}

      <form
        onSubmit={sendMessage}
        className="bg-white p-3 flex gap-2 border-t items-center"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            if (socketRef.current?.connected) {
              if (e.target.value.trim()) {
                socketRef.current.emit(
                  "chat:typing",
                  matchId
                );
              } else {
                socketRef.current.emit(
                  "chat:stop-typing",
                  matchId
                );
              }
            }
          }}
          onBlur={() => {
            socketRef.current?.emit(
              "chat:stop-typing",
              matchId
            );
          }}
          placeholder="Type your message..."
          maxLength={2000}
          className="flex-1 min-w-0 border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
        />

        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default Chat;
