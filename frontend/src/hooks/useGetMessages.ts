// import { useEffect, useState } from "react";
// import useConversation from "../zustand/useConversation";
// import toast from "react-hot-toast";
// import { useAuthContext } from "../context/AuthContext";

// const useGetMessages = () => {
// 	const [loading, setLoading] = useState(false);
// 	const { messages, setMessages, selectedConversation } = useConversation();
// 	const { authUser } = useAuthContext();

// 	useEffect(() => {
// 		const getMessages = async () => {
// 			if (!selectedConversation) return;
// 			setLoading(true);
// 			setMessages([]);
// 			try {
// 				const res = await fetch(`/api/messages/${selectedConversation.id}`);
// 				const data = await res.json();
// 				if (!res.ok) throw new Error(data.error || "An error occurred");
// 				setMessages(data);
// 			} catch (error: any) {
// 				toast.error(error.message);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		getMessages();
// 	}, [selectedConversation, setMessages]);

// 	return { messages, loading };
// };
// export default useGetMessages;

// import { useEffect, useState } from "react";
// import { useAuthContext } from "../context/AuthContext"; // Assuming you have an auth context
// import toast from "react-hot-toast";

// export type MessageType = {
// 	id: string;
// 	body: string;
// 	senderId: string;
// 	createdAt: string;
// 	imageUrl?: string;
// 	shouldShake?: boolean;
//   };

// const useGetMessages = (conversationId: string) => {
//     const [loading, setLoading] = useState(false);
//     const [messages, setMessages] = useState<MessageType[]>([]);
//     // const { authUser } = useAuthContext(); // Assuming this contains the user info

//     useEffect(() => {
//         const getMessages = async () => {
//             if (!conversationId) return; // Exit if no conversationId

//             setLoading(true);
//             try {
//                 // const token = localStorage.getItem('token'); // Adjust according to your storage method

//                 const res = await fetch(`/api/messages/${conversationId}`);
//                 //     method: "GET",
//                 //     headers: {
//                 //         "Content-Type": "application/json",
//                 //         "Authorization": `Bearer ${token}`
//                 //     },
//                 // });

//                 if (!res.ok) {
//                     const errorData = await res.json();
//                     throw new Error(errorData.error || 'An error occurred');
//                 }

//                 const data:MessageType[] = await res.json();
//                 setMessages(data);
//             } catch (error:any) {
//                 toast.error(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getMessages();
//     }, [conversationId]);

//     return { loading, messages };
// };

// export default useGetMessages;

import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			if (!selectedConversation) return;
			setLoading(true);
			setMessages([]);
			try {
				const res = await fetch(`/api/messages/${selectedConversation.id}`);
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "An error occurred");
				setMessages(data);
			} catch (error: any) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getMessages();
	}, [selectedConversation, setMessages]);

	return { messages, loading };
};
export default useGetMessages;