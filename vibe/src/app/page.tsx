"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import CallModal from "../components/CallModal";
import LandingPage from "../components/LandingPage";

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
	const [callId, setCallId] = useState<string | null>(null);
	const [incomingCall, setIncomingCall] = useState<any>(null);

	// 1. Auth Listener
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (u) => {
			if (u) {
				setUser(u);
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

	// 2. Friends Listener
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

	// 3. Messages Listener
	useEffect(() => {
		if (!user) return;
		const q = query(collection(db, "messages"), orderBy("ts", "asc"));
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

	// 4. Incoming Call Listener
	useEffect(() => {
		if (!user) return;
		// Listen for calls offered TO me
		const q = query(
			collection(db, "calls"),
			where("to", "==", user.email),
			where("status", "==", "offer")
		);
		const unsub = onSnapshot(q, (snap) => {
			if (!snap.empty) {
				const doc = snap.docs[0];
				const data = doc.data();
				// Check if call is stale (older than 1 minute)
				if (data.ts && (Date.now() - data.ts.toMillis()) > 60000) return;

				setIncomingCall({ id: doc.id, ...data });
				setCallId(doc.id);
			} else {
				setIncomingCall(null);
			}
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
		try { await signInWithPopup(auth, googleProvider); }
		catch (e) { console.error(e); alert("Login failed"); }
	}

	async function handleSignOut() { await signOut(auth); }

	async function addFriend(f: Friend) {
		if (!user) return;

		const q = query(collection(db, "users"), where("email", "==", f.email));
		const snap = await getDocs(q);

		if (snap.empty) {
			alert("User not found on Vibe!");
			return;
		}

		const targetUser = snap.docs[0];
		const targetData = targetUser.data();

		await setDoc(doc(db, "users", user.uid, "contacts", f.email), {
			name: targetData.name || f.email,
			email: f.email,
			photoURL: targetData.photoURL || "",
			uid: targetUser.id
		});

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
		await setDoc(doc(db, "users", user.uid, "contacts", f.email), {
			name: f.name, email: f.email, photoURL: f.photoURL || "", uid: f.uid
		});
		await deleteDoc(doc(db, "users", user.uid, "requests", f.email));
	}

	async function blockRequest(f: Friend) {
		if (!user) return;
		await deleteDoc(doc(db, "users", user.uid, "requests", f.email));
	}

	async function sendMsg(m: Msg) {
		if (!user) return;
		await addDoc(collection(db, "messages"), { ...m, participants: [m.from, m.to] });
	}

	async function startCall(video: boolean) {
		if (!user || !selected) return;

		const callDoc = await addDoc(collection(db, "calls"), {
			from: user.email,
			to: selected,
			status: "offer",
			video: video,
			ts: serverTimestamp()
		});

		setCallId(callDoc.id);
		setCallActive(true);
		setCallVideo(video);
	}

	const currentFriend = friends.find(f => f.email === selected) || null;
	const currentUser = user ? { name: user.displayName || user.email || 'User', email: user.email || '' } : null;
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
					onCallStart={startCall}
				/>
			</div>
			{(callActive || incomingCall) && (
				<CallModal
					friend={incomingCall ? { name: incomingCall.from, email: incomingCall.from } : currentFriend!}
					isVideo={incomingCall ? incomingCall.video : callVideo}
					isIncoming={!!incomingCall}
					callId={callId!}
					onEnd={async () => {
						setCallActive(false);
						setIncomingCall(null);
						setCallId(null);
						// Cleanup call doc
						if (callId) await setDoc(doc(db, "calls", callId), { status: 'ended' }, { merge: true });
					}}
				/>
			)}
		</div>
	);
}