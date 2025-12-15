"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import CallModal from "../components/CallModal";

// Firebase
import { auth, db, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import {
	collection, query, where, onSnapshot, addDoc, setDoc, doc, getDocs, orderBy, serverTimestamp
} from "firebase/firestore";

type Friend = { email: string; name: string; uid?: string; photoURL?: string };
type Msg = { from: string; to: string; text: string; ts: number };

export default function Page() {
	const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light');
	const [customBg, setCustomBg] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:bg')) || '');
	const [customText, setCustomText] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:text')) || '');
	const [uiStyle, setUiStyle] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:ui')) || 'square');

	// Real Data State
	const [user, setUser] = useState<User | null>(null);
	const [friends, setFriends] = useState<Friend[]>([]);
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
			snap.forEach(d => list.push(d.data() as Friend));
			setFriends(list);
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
		// Search for user by email
		const q = query(collection(db, "users"), where("email", "==", f.email));
		const snap = await getDocs(q);

		if (snap.empty) {
			alert("User not found on Vibe!");
			return;
		}

		const friendData = snap.docs[0].data();

		// Add to my contacts
		await setDoc(doc(db, "users", user.uid, "contacts", f.email), {
			name: friendData.name || f.email,
			email: f.email,
			photoURL: friendData.photoURL || "",
			uid: snap.docs[0].id
		});
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

	return (
		<div style={{ padding: 0 }}>
			<div className="app-root">
				<Sidebar
					friends={friends}
					onAddFriend={addFriend}
					onSelectFriend={f => setSelected(f.email)}
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