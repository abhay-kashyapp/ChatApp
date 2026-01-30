import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import { chatStore } from "../store/chatStore";

const HomePage = () => {
    // ✅ Correct: Call chatStore as a hook to subscribe to state changes
    const selectedUser = chatStore((state) => state.selectedUser);

    return (
        <div className="flex flex-row min-h-screen overflow-hidden bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-8rem)]">
            <Sidebar />
            <main className="flex-1 bg-gray-900">
                {selectedUser ? <ChatContainer /> : <NoChatSelected />}
            </main>
        </div>
    );
};

export default HomePage;
