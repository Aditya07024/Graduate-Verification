import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import io from "socket.io-client";
import { Send, Smile, MessageSquare } from "lucide-react";

const UserChatPage = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [admin, setAdmin] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const chatapi = import.meta.env.VITE_CHAT_ROUTE;

  // Fetch conversation with admin
  const fetchConversation = useCallback(
    async (adminId) => {
      try {
        const res = await axios.get(`${chatapi}/conversation/${adminId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading conversation:", err);
      }
    },
    [chatapi]
  );

  // Fetch assigned admin
  const fetchAdmin = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${chatapi}/user/get-admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("fetchAdmin response data:", res.data);

      if (res.data.success) {
        setAdmin(res.data.admin);
        await fetchConversation(res.data.admin._id);
      } else {
        setError("No admin available");
      }
    } catch (err) {
      console.error("Failed to fetch admin:", err);
      setError("Failed to connect to support");
      console.log("fetchAdmin error:", err);
    } finally {
      setLoading(false);
    }
  }, [chatapi, fetchConversation]);

  // Initialize socket and data
  useEffect(() => {
    (async () => {
      // 1. Connect to socket
      socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      // 2. Set up socket listeners
      socketRef.current.on("receive-message", (message) => {
        if (
          message.sender._id === admin?._id ||
          message.recipient._id === currentUser._id
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });

      socketRef.current.on("typing", ({ isTyping, senderId }) => {
        if (senderId === admin?._id) {
          setIsTyping(isTyping);
        }
      });

      // 3. Fetch assigned admin
      await fetchAdmin();
    })();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [admin, currentUser._id, fetchAdmin, fetchConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !admin) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      sender: currentUser,
      recipient: admin,
      content: newMessage,
      createdAt: new Date(),
      read: false,
      isTemp: true,
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      // 1. Emit socket event
      socketRef.current.emit("send-message", {
        recipientId: admin._id,
        content: newMessage,
      });

      // 2. Send to API
      const payload = {
        recipientId: admin._id,
        recipientType: "Admin",
        content: newMessage,
      };

      const res = await axios.post(`${chatapi}/send`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Replace temp message with server response
      setMessages((prev) => prev.map((m) => (m._id === tempId ? res.data : m)));
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const handleTyping = (isTyping) => {
    if (!admin) return;
    socketRef.current.emit("typing", {
      recipientId: admin._id,
      isTyping,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Connecting you to support...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchAdmin}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      {/* <div className="p-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {admin ? `${admin.firstName} ${admin.lastName}` : 'Connecting...'}
              {isTyping && ' • typing...'} </p>
          </div>
        </div>
      </div> */}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              Start your conversation with support
            </p>
          </div>
        ) : (
          messages
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message) => (
              <div
                key={message._id}
                className={`mb-4 flex ${
                  message.sender._id === currentUser._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    message.sender._id === currentUser._id
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-600 dark:text-gray-100"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-80">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-blue-600">
            <Smile className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping(e.target.value.length > 0);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
