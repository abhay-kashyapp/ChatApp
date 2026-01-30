import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { chatStore } from "../store/chatStore";

const HomePage = () => {
    // ✅ Correct: Call chatStore as a hook to subscribe to state changes
    const selectedUser = chatStore((state) => state.selectedUser);

    return (
        <div className="flex flex-row min-h-screen overflow-hidden bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
            {/* Sidebar: hidden on mobile when chat is selected, always visible on larger screens */}
            <div className={`${selectedUser ? 'hidden md:block' : 'block'}`}>
                <Sidebar />
            </div>
            {/* Main chat area: full width on mobile, flex-1 on larger screens */}
            <main className={`flex-1 bg-gray-900 ${selectedUser ? 'block' : 'hidden md:block'}`}>
                {selectedUser ? <ChatContainer /> : <NoChatSelected />}
            </main>
        </div>
    );
};

export default HomePage;
