"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import CallModal from "../components/CallModal";

// Firebase
import { auth, db, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import {
	collection, query, where, onSnapshot, addDoc, setDoc, doc, getDocs, orderBy, serverTimestamp, deleteDoc
} from "firebase/firestore";

type Friend = { email: string; name: string; uid?: string; photoURL?: string; status?: 'friend' | 'request' };
type Msg = { from: string; to: string; text: string; ts: number };

export default function Page() {
	const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light');
	const [customBg, setCustomBg] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:bg')) || '');
	const [customText, setCustomText] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:text')) || '');
	const [uiStyle, setUiStyle] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:ui')) || 'square');

	// Real Data State
	const [user, setUser] = useState<User | null>(null);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [requests, setRequests] = useState<Friend[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [messages, setMessages] = useState<Msg[]>([]);

	// Call State
	const [callActive, setCallActive] = useState(false);
	const [callVideo, setCallVideo] = useState(false);

	// 1. Auth Listener
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (u) => {
			if (u) {
				setUser(u);
				// Ensure user exists in DB
				await setDoc(doc(db, "users", u.uid), {
					name: u.displayName,
					email: u.email,
					photoURL: u.photoURL,
					lastSeen: serverTimestamp()
				}, { merge: true });
			} else {
				setUser(null);
				setFriends([]);
				setRequests([]);
				setMessages([]);
			}
		});
		return () => unsub();
	}, []);

	// 2. Friends Listener (Contacts subcollection)
	useEffect(() => {
		if (!user) return;
		const q = collection(db, "users", user.uid, "contacts");
		const unsub = onSnapshot(q, (snap) => {
			const list: Friend[] = [];
			snap.forEach(d => list.push({ ...d.data(), status: 'friend' } as Friend));
			setFriends(list);
		});
		return () => unsub();
	}, [user]);

	// 2.5 Requests Listener
	useEffect(() => {
		if (!user) return;
		const q = collection(db, "users", user.uid, "requests");
		const unsub = onSnapshot(q, (snap) => {
			const list: Friend[] = [];
			snap.forEach(d => list.push({ ...d.data(), status: 'request' } as Friend));
			setRequests(list);
		});
		return () => unsub();
	}, [user]);

	// 3. Messages Listener (Global or specific)
	// For simplicity, we listen to all messages where I am sender OR receiver
	useEffect(() => {
		if (!user) return;

		// Firestore OR queries are tricky. We'll listen to sent and received separately or use a composite ID.
		// Simple approach: Listen to 'messages' collection ordered by ts.
		// WARNING: In production, this needs composite index or specific filtering.
		// We will just listen to ALL messages for this prototype and filter client side
		// to avoid index setup complexity for the user right now (if permission allows).
		// Actually, 'array-contains' is better if we store participants field.

		const q = query(
			collection(db, "messages"),
			orderBy("ts", "asc")
		);

		const unsub = onSnapshot(q, (snap) => {
			const msgs: Msg[] = [];
			snap.forEach(d => {
				const data = d.data() as Msg;
				if (data.from === user.email || data.to === user.email) {
					msgs.push(data);
				}
			});
			setMessages(msgs);
		});

		return () => unsub();
	}, [user]);


	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
		document.body.setAttribute('data-ui', uiStyle || 'square');
		if (customBg) document.body.style.setProperty('--custom-bg', customBg);
		else document.body.style.removeProperty('--custom-bg');
		if (customText) document.body.style.setProperty('--custom-text', customText);
		else document.body.style.removeProperty('--custom-text');
		try { localStorage.setItem('theme', theme); } catch (e) { }
	}, [theme]);

	// Theme Effects
	useEffect(() => { if (customBg) document.body.style.setProperty('--custom-bg', customBg); else document.body.style.removeProperty('--custom-bg'); localStorage.setItem('vibe:setting:bg', customBg || ''); }, [customBg]);
	useEffect(() => { if (customText) document.body.style.setProperty('--custom-text', customText); else document.body.style.removeProperty('--custom-text'); localStorage.setItem('vibe:setting:text', customText || ''); }, [customText]);
	useEffect(() => { document.body.setAttribute('data-ui', uiStyle || 'square'); localStorage.setItem('vibe:setting:ui', uiStyle || 'square'); }, [uiStyle]);

	function resetSettings() {
		setCustomBg(''); setCustomText(''); setUiStyle('square');
		try { localStorage.removeItem('vibe:setting:bg'); localStorage.removeItem('vibe:setting:text'); localStorage.removeItem('vibe:setting:ui'); } catch (e) { }
	}

	function toggleTheme() { setTheme(t => t === 'light' ? 'dark' : 'light'); }

	async function handleSignIn() {
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (e) {
			console.error(e);
			alert("Login failed");
		}
	}

	async function handleSignOut() { await signOut(auth); }

	async function addFriend(f: Friend) {
		if (!user) return;

		// 1. Search for user by email
		const q = query(collection(db, "users"), where("email", "==", f.email));
		const snap = await getDocs(q);

		if (snap.empty) {
			alert("User not found on Vibe!");
			return;
		}

		const targetUser = snap.docs[0];
		const targetData = targetUser.data();

		// 2. Add to MY contacts immediately (optimistic friend adding)
		await setDoc(doc(db, "users", user.uid, "contacts", f.email), {
			name: targetData.name || f.email,
			email: f.email,
			photoURL: targetData.photoURL || "",
			uid: targetUser.id
		});

		// 3. Send REQUEST to THEM
		await setDoc(doc(db, "users", targetUser.id, "requests", user.email!), {
			name: user.displayName || user.email,
			email: user.email,
			photoURL: user.photoURL || "",
			uid: user.uid
		});

		alert(`Added ${f.email} and sent them a connection request!`);
	}

	async function acceptRequest(f: Friend) {
		if (!user || !f.uid) return;
		// Move from requests to contacts
		await setDoc(doc(db, "users", user.uid, "contacts", f.email), {
			name: f.name,
			email: f.email,
			photoURL: f.photoURL || "",
			uid: f.uid
		});
		// Delete request
		await deleteDoc(doc(db, "users", user.uid, "requests", f.email));
		// Also ensure they have me in contacts (should be done by their addFriend, but good to ensure bi-directional)
		// For now, assume single directional accept is enough to chat.
	}

	async function blockRequest(f: Friend) {
		if (!user) return;
		await deleteDoc(doc(db, "users", user.uid, "requests", f.email));
	}

	async function sendMsg(m: Msg) {
		if (!user) return;
		// Add participants array for easier querying in future
		await addDoc(collection(db, "messages"), {
			...m,
			participants: [m.from, m.to]
		});
		// Optimistic update not needed as onSnapshot will catch it fast
	}

	const currentFriend = friends.find(f => f.email === selected) || null;

	// Adapt user object for child components to match expected shape
	const currentUser = user ? { name: user.displayName || user.email || 'User', email: user.email || '' } : null;

	// Combine requests and friends for the sidebar, but we might pass them separately or handle in Sidebar
	// For simplicity, we can pass a combined list if Sidebar handles 'status' check.
	const allContacts = [...requests, ...friends];

	return (
		<div style={{ padding: 0 }}>
			<div className="app-root">
				<Sidebar
					friends={allContacts}
					onAddFriend={addFriend}
					onAcceptRequest={acceptRequest}
					onBlockRequest={blockRequest}
					onSelectFriend={f => f.status === 'friend' ? setSelected(f.email) : null}
					selected={selected}
					signedIn={!!user}
					currentUser={currentUser}
					onSignIn={handleSignIn}
					onSignOut={handleSignOut}
					theme={theme}
					toggleTheme={toggleTheme}
					customBg={customBg}
					customText={customText}
					uiStyle={uiStyle}
					setCustomBg={setCustomBg}
					setCustomText={setCustomText}
					setUiStyle={setUiStyle}
					resetSettings={resetSettings}
				/>
				<ChatWindow
					me={currentUser}
					friend={currentFriend}
					messages={messages}
					onSend={sendMsg}
					onCallStart={(video) => { setCallVideo(video); setCallActive(true); }}
				/>
			</div>
			{callActive && currentFriend && (
				<CallModal
					friend={currentFriend}
					isVideo={callVideo}
					onEnd={() => setCallActive(false)}
				/>
			)}
		</div>
	);
}