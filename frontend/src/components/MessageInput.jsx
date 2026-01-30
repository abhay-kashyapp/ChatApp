
import { MdImage } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { chatStore } from "../store/chatStore";
import { useState } from "react";
import { useRef } from "react";

const MessageInput = () => {
  const { sendMessage } = chatStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({
        text: text.trim(),
        image: image,
      });

      setText("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("failed to send message");
    }
  };

  return (
    <div className="p-2 md:p-3 bg-base-200 w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="rounded-lg hover:bg-base-300 flex items-center justify-center flex-shrink-0"
          title="Attach image"
        >
          <MdImage className="size-8 md:size-10 text-primary" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImage}
        />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 min-w-0 p-2 md:p-3 rounded-lg md:rounded-xl focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-gray-100 bg-slate-700 shadow-sm border border-base-300 text-sm md:text-base"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="p-2 md:p-3 bg-primary text-white rounded-lg md:rounded-xl hover:bg-primary-focus flex items-center justify-center shadow-xl bg-slate-700 flex-shrink-0"
        >
          <LuSendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
