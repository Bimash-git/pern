import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import LZString from "lz-string";

import { MessageCircle } from "lucide-react";

const MessageContainer = () => {
	const { selectedConversation } = useConversation();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const { authUser } = useAuthContext();

		// image compression and sending function
	const handleImageUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if(!file) return;

		// set selected image file
		setImageFile(file);

		// compressing image using LZString
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onloadend = async () => {
			const base64String = reader.result as string;
			const compressedImage = LZString.compressToBase64(base64String);

			// sending compressed image to backend
			try {
				const response = await fetch("/api/messages/image", {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						conversationId: selectedConversation?.id,
						senderId: authUser?.id,
						compressedImage
					})
				});

				if (!response.ok) {
					throw new Error("Failed to send an image");
				}

				const data = await response.json();
				console.log("Image sent sucessfully: ", data);
			} catch (error) {
				console.error("Error sending image: ", error)
			}
		}
	}


	return (
		<div className='w-full flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header */}
					<div className='bg-slate-500 px-4 py-2 mb-2'>
						<span className='label-text'>To:</span>{" "}
						<span className='text-gray-900 font-bold'>{selectedConversation.fullname}</span>
					</div>

					<Messages />
					{/* File upload input moved here */}
					<input type="file" accept="image/*" onChange={handleImageUpload} />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser?.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<MessageCircle className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};
