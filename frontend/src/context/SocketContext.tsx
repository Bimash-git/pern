import { createContext, useState, useEffect, useContext, ReactNode, useRef } from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
	socket: Socket | null;
	onlineUsers: string[];
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error("useSocketContext must be used within a SocketContextProvider");
	}
	return context;
};

const socketURL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
	const socketRef = useRef<Socket | null>(null);

	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const { authUser, isLoading } = useAuthContext();

	useEffect(() => {
		if (authUser && !isLoading) {
			const socket = io(socketURL, {
				query: {
					userId: authUser.id,
				},
				withCredentials: true,
				reconnectionAttempts: 5,   // How many times to try reconnecting
				reconnectionDelay: 1000,   // Delay between reconnection attempts
				reconnectionDelayMax: 5000 // Max delay before each reconnection attempt
			});
			socketRef.current = socket;

			socket.on("connect", () => {
				console.log("Connected with socket id:", socket.id);
			});

			socket.on("getOnlineUsers", (users: string[]) => {
				setOnlineUsers(users);
				// console.log(setOnlineUsers(users));
			});

			return () => {
				// socket.removeListener("getOnlineUsers");
				socket.off("newMessage");
				socket.close();
				socketRef.current = null;
			};
		} else if (!authUser && !isLoading) {
			if (socketRef.current) {
				socketRef.current.close();
				socketRef.current = null;
			}
		}
	}, [authUser, isLoading]);

	return (
		<SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>{children}</SocketContext.Provider>
	);
};

export default SocketContextProvider;