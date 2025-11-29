// ====  ONLY PARTICLE SECTION UPDATED  ====
// ==== FULL CHAT COMPONENT INCLUDED BELOW ====

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const Chat = () => {
	const { target } = useParams();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isOnline, setIsOnline] = useState(false);
	const [lastSeen, setLastSeen] = useState(null);
	const [isTyping, setIsTyping] = useState(false);
	const [partnerName, setPartnerName] = useState("Partner");

	const user = useSelector((store) => store.user);
	const userId = user?._id;

	const chatEndRef = useRef(null);
	const typingTimeoutRef = useRef(null);
	const socketRef = useRef(null);

	/* AUTO SCROLL */
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	/* FETCH CHATS */
	const fetchChats = async () => {
		try {
			const chats = await axios.get(BASE_URL + "/chat/" + target, { withCredentials: true });

			const chatMsg = (chats?.data?.message || []).map((msg) => ({
				firstName: msg.senderId.firstName,
				text: msg.text,
				time: msg.createdAt,
				seen: msg.seen || false,
			}));

			const partnerMsg = chatMsg.find((m) => m.firstName !== user.firstName);
			if (partnerMsg) setPartnerName(partnerMsg.firstName);

			setMessages(chatMsg);
		} catch (err) {
			console.error("Fetch chats error:", err);
		}
	};

	/* MARK AS SEEN */
	useEffect(() => {
		if (target) {
			fetchChats();
			if (socketRef.current) {
				socketRef.current.emit("markAsSeen", { senderId: userId, targetId: target });
			}
		}
	}, [target]);

	/* TIME AGO */
	const timeAgo = (iso) => {
		if (!iso) return "";
		const diff = Date.now() - new Date(iso).getTime();
		if (diff < 60000) return "Just now";
		if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
		if (diff < 86400000) return `${Math.floor(diff / 3600000)} hr ago`;
		return new Date(iso).toLocaleDateString();
	};

	/* SOCKET SETUP */
	useEffect(() => {
		if (!userId || !target) return;

		const socket = createSocketConnection();
		socketRef.current = socket;

		socket.emit("joinChat", { firstName: user.firstName, userId, target });
		socket.emit("requestStatus", { userId: target });

		socket.on("messageReceived", ({ firstName, text, time }) => {
			setMessages((prev) => [...prev, { firstName, text, time }]);
		});

		socket.on("targetTyping", ({ senderName }) => {
			setPartnerName(senderName);
			setIsTyping(true);
		});
		socket.on("targetStopTyping", () => setIsTyping(false));

		socket.on("seenReceipt", () => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.firstName === user.firstName ? { ...msg, seen: true } : msg
				)
			);
		});

		socket.on("userOnline", (uid) => {
			if (uid === target) {
				setIsOnline(true);
				setLastSeen(null);
			}
		});

		socket.on("userOffline", ({ userId: uid, lastSeen }) => {
			if (uid === target) {
				setIsOnline(false);
				setLastSeen(lastSeen);
			}
		});

		socket.on("initialStatus", ({ isOnline, lastSeen }) => {
			setIsOnline(isOnline);
			setLastSeen(lastSeen);
		});

		return () => socket.disconnect();
	}, [userId, target]);

	/* HANDLE TYPING */
	const handleTypingEvent = (value) => {
		setNewMessage(value);

		const socket = socketRef.current;
		if (!socket) return;

		socket.emit("typing", { target, senderName: user.firstName });

		clearTimeout(typingTimeoutRef.current);
		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("stopTyping", { target });
		}, 900);
	};

	/* SEND MESSAGE */
	const sendMessage = () => {
		if (!newMessage.trim()) return;

		const socket = socketRef.current;
		if (!socket) return;

		const time = new Date().toISOString();

		clearTimeout(typingTimeoutRef.current);
		socket.emit("stopTyping", { target });

		socket.emit("sendMessage", {
			firstName: user.firstName,
			userId,
			target,
			text: newMessage.trim(),
			time,
		});

		setMessages((prev) => [...prev, { firstName: user.firstName, text: newMessage.trim(), time }]);
		setNewMessage("");
	};

	/* -----------------------------------------------------------
       🎯 FIXED: INTERACTIVE PARTICLE BACKGROUND (cursor enabled)
	----------------------------------------------------------- */
	useEffect(() => {
		const canvas = document.getElementById("chat-particles");
		if (!canvas) return;

		const ctx = canvas.getContext("2d");

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);

		const particles = [];
		const maxDist = 130;
		const cursor = { x: null, y: null };

		class Node {
			constructor(x, y) {
				this.x = x ?? Math.random() * canvas.width;
				this.y = y ?? Math.random() * canvas.height;
				this.vx = (Math.random() - 0.5) * 0.4;
				this.vy = (Math.random() - 0.5) * 0.4;
			}

			update() {
				this.x += this.vx;
				this.y += this.vy;

				if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
				if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

				// Cursor attraction
				if (cursor.x !== null) {
					let dx = cursor.x - this.x;
					let dy = cursor.y - this.y;
					let dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < 180) {
						this.x += dx * 0.01;
						this.y += dy * 0.01;
					}
				}
			}

			draw() {
				ctx.beginPath();
				ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
				ctx.fillStyle = "#00ff8f";
				ctx.shadowBlur = 12;
				ctx.shadowColor = "#00ff8f";
				ctx.fill();
			}
		}

		// SPAWN NODES
		for (let i = 0; i < 70; i++) particles.push(new Node());

		// CURSOR TRACKING
		canvas.addEventListener("mousemove", (e) => {
			cursor.x = e.clientX;
			cursor.y = e.clientY;
		});

		// ADD PARTICLE ON CLICK
		canvas.addEventListener("click", (e) => {
			particles.push(new Node(e.clientX, e.clientY));
		});

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((p) => {
				p.update();
				p.draw();
			});

			// Node connections
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					let dx = particles[i].x - particles[j].x;
					let dy = particles[i].y - particles[j].y;
					let dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < maxDist) {
						ctx.strokeStyle = `rgba(0,255,143,${1 - dist / maxDist})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						ctx.stroke();
					}
				}
			}

			// Cursor → Node Lines
			if (cursor.x !== null) {
				particles.forEach((p) => {
					let dx = cursor.x - p.x;
					let dy = cursor.y - p.y;
					let dist = Math.sqrt(dx * dx + dy * dy);

					if (dist < maxDist) {
						ctx.strokeStyle = `rgba(0,255,143,${1 - dist / maxDist})`;
						ctx.lineWidth = 1;
						ctx.beginPath();
						ctx.moveTo(cursor.x, cursor.y);
						ctx.lineTo(p.x, p.y);
						ctx.stroke();
					}
				});
			}

			requestAnimationFrame(animate);
		};

		animate();

		return () => window.removeEventListener("resize", resize);
	}, []);

	/* -----------------------------------------------------------
       JSX
	----------------------------------------------------------- */
	return (
		<div className="relative min-h-screen flex items-center justify-center bg-black">

			{/* PARTICLE CANVAS (cursor-enabled now!) */}
			<canvas
				id="chat-particles"
				className="fixed inset-0 z-0 opacity-[0.45]"
				style={{ pointerEvents: "auto" }}
			></canvas>

			{/* CHAT BOX */}
			<div className="relative z-10 w-full max-w-3xl h-[80vh] flex flex-col rounded-2xl 
                        overflow-hidden border border-green-400/40 
                        shadow-[0_0_25px_#00ff8f60] 
                        bg-black/50 backdrop-blur-xl">

				{/* HEADER */}
				<div className="p-5 border-b border-green-400/30 bg-black/60 backdrop-blur-xl">
					<h1 className="text-3xl font-mono font-bold text-green-400 drop-shadow-[0_0_8px_#00ff8f]">
						DevVerse Chat Nexus 💬
					</h1>

					<p className="text-sm text-green-300 font-mono mt-1">
						Chatting with <span className="text-green-400 font-bold">{partnerName}</span>
					</p>

					<p className="text-xs text-gray-400 font-mono">
						{isOnline ? (
							<span className="flex items-center gap-2 text-green-400">
								<span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
								Online
							</span>
						) : (
							<span>Last seen: {lastSeen ? timeAgo(lastSeen) : "Offline"}</span>
						)}
					</p>
				</div>

				{/* MESSAGES */}
				<div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
					{messages.map((msg, i) => {
						const isMine = msg.firstName === user?.firstName;
						return (
							<div key={i} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>

								<span className="text-xs text-green-300 font-mono mb-1">{msg.firstName}</span>

								<div
									className={`px-4 py-3 max-w-xs rounded-2xl font-mono shadow-[0_0_12px_#00ff8f50]
									${isMine
										? "bg-green-400 text-black rounded-br-none"
										: "bg-black/70 border border-green-400/40 rounded-bl-none"}`}
								>
									{msg.text}
								</div>

								<span className="text-[10px] text-gray-400 mt-1 font-mono">
									{msg.time ? timeAgo(msg.time) : ""}
									{isMine && msg.seen && <span className="ml-1 text-green-400">✓ Seen</span>}
								</span>
							</div>
						);
					})}

					<div ref={chatEndRef} />
				</div>

				{/* TYPING INDICATOR */}
				{isTyping && (
					<div className="px-5 py-2 text-sm font-mono text-green-400 bg-black/40 border-t border-green-400/30 flex items-center gap-2">
						<b>{partnerName}</b> is typing
						<span className="flex gap-1">
							<span className="h-2 w-2 bg-green-400 rounded-full animate-bounce"></span>
							<span className="h-2 w-2 bg-green-400 rounded-full animate-bounce delay-150"></span>
							<span className="h-2 w-2 bg-green-400 rounded-full animate-bounce delay-300"></span>
						</span>
					</div>
				)}

				{/* INPUT BOX */}
				<div className="p-5 border-t border-green-400/30 flex items-center gap-3 bg-black/50 backdrop-blur">
					<input
						value={newMessage}
						onChange={(e) => handleTypingEvent(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && sendMessage()}
						placeholder="Enter your message..."
						className="flex-1 px-4 py-3 bg-black/60 border border-green-400/40 rounded-xl text-white font-mono outline-none"
					/>

					<button
						onClick={sendMessage}
						className="px-6 py-3 bg-green-400 text-black font-bold rounded-xl 
                                   hover:bg-green-300 hover:scale-105 transition-all shadow-[0_0_20px_#00ff8f80]"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
