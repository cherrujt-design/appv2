"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

type Friend = { email: string; name: string };
type Msg = { from: string; to: string; text: string; ts: number };

export default function Page() {
	const [theme, setTheme] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('theme')) || 'light');
	const [customBg, setCustomBg] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:bg')) || '');
	const [customText, setCustomText] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:text')) || '');
	const [uiStyle, setUiStyle] = useState(() => (typeof window !== 'undefined' && localStorage.getItem('vibe:setting:ui')) || 'square');
	const [user, setUser] = useState<{ name: string, email: string } | null>(null);
	const [friends, setFriends] = useState<Friend[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [messages, setMessages] = useState<Msg[]>([]);

	useEffect(() => {
		document.body.setAttribute('data-theme', theme);
		document.body.setAttribute('data-ui', uiStyle || 'square');
		if (customBg) document.body.style.setProperty('--custom-bg', customBg);
		else document.body.style.removeProperty('--custom-bg');
		if (customText) document.body.style.setProperty('--custom-text', customText);
		else document.body.style.removeProperty('--custom-text');
		try { localStorage.setItem('theme', theme); } catch (e) { }
	}, [theme]);

	useEffect(() => {
		if (customBg) document.body.style.setProperty('--custom-bg', customBg);
		else document.body.style.removeProperty('--custom-bg');
		localStorage.setItem('vibe:setting:bg', customBg || '');
	}, [customBg]);

	useEffect(() => {
		if (customText) document.body.style.setProperty('--custom-text', customText);
		else document.body.style.removeProperty('--custom-text');
		localStorage.setItem('vibe:setting:text', customText || '');
	}, [customText]);

	useEffect(() => {
		document.body.setAttribute('data-ui', uiStyle || 'square');
		localStorage.setItem('vibe:setting:ui', uiStyle || 'square');
	}, [uiStyle]);

	function resetSettings() {
		setCustomBg('');
		setCustomText('');
		setUiStyle('square');
		try { localStorage.removeItem('vibe:setting:bg'); localStorage.removeItem('vibe:setting:text'); localStorage.removeItem('vibe:setting:ui'); } catch (e) { }
	}

	useEffect(() => {
		const raw = localStorage.getItem('vibe:f'); if (raw) setFriends(JSON.parse(raw));
		const rawm = localStorage.getItem('vibe:m'); if (rawm) setMessages(JSON.parse(rawm));
		const u = localStorage.getItem('vibe:u'); if (u) setUser(JSON.parse(u));
	}, []);

	useEffect(() => { localStorage.setItem('vibe:f', JSON.stringify(friends)); }, [friends]);
	useEffect(() => { localStorage.setItem('vibe:m', JSON.stringify(messages)); }, [messages]);
	useEffect(() => { localStorage.setItem('vibe:u', JSON.stringify(user)); }, [user]);

	function toggleTheme() { setTheme(t => t === 'light' ? 'dark' : 'light'); }

	function handleSignIn() {
		// Simulated Google sign-in: prompt for name/email
		const name = prompt('Simulated Google Sign-in\nEnter your full name:');
		if (!name) return;
		const email = prompt('Enter your Google email:');
		if (!email) return;
		const u = { name, email };
		setUser(u);
	}

	function handleSignOut() { setUser(null); }

	function addFriend(f: Friend) {
		if (friends.find(x => x.email === f.email)) return alert('Friend already added');
		setFriends(s => [...s, f]);
	}

	function sendMsg(m: Msg) { setMessages(s => [...s, m]); }

	const currentFriend = friends.find(f => f.email === selected) || null;

	return (
		<div style={{ padding: 20 }}>
			<Header user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} theme={theme} toggleTheme={toggleTheme} />

			<div className="app-root">
				<Sidebar
					friends={friends}
					onAddFriend={addFriend}
					onSelectFriend={f => setSelected(f.email)}
					selected={selected}
					signedIn={!!user}
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
				<ChatWindow me={user} friend={currentFriend} messages={messages} onSend={sendMsg} />
			</div>
		</div>
	);
}

