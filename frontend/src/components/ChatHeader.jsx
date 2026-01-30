import { authStore } from "../store/authStore";
import { chatStore } from "../store/chatStore";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = chatStore();
  const { onlineUsers } = authStore();

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-between px-3 py-2 bg-base-200 shadow-lg rounded-md lg:rounded-none w-full bg-gray-800">
        <div className="text-gray-400">No conversation selected</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-base-200 shadow-lg rounded-md md:rounded-none w-full bg-gray-800">
      <div className="flex items-center gap-2 md:gap-3">
        {/* Back button - only visible on mobile */}
        <button
          className="p-2 rounded-full hover:bg-base-300 md:hidden"
          onClick={() => setSelectedUser(null)}
          title="Back to contacts"
        >
          <FaArrowLeft className="w-5 h-5 text-gray-300" />
        </button>
        {selectedUser.profilepic ? (
          <img
            src={selectedUser.profilepic}
            alt="User Avatar"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
        )}
        <div>
          <h2 className="text-base md:text-lg lg:text-xl font-semibold truncate max-w-[150px] md:max-w-none">
            {selectedUser.username}
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-base-content/60">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      {/* Close button - hidden on mobile (back button used instead) */}
      <button
        className="p-2 lg:p-3 rounded-full hover:bg-base-300 hidden md:block"
        onClick={() => setSelectedUser(null)}
        title="Close chat"
      >
        <IoClose className="w-5 h-5 md:w-6 md:h-6 text-gray-300" />
      </button>
    </div>
  );
};

export default ChatHeader;
