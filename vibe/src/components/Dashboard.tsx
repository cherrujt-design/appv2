import React, { useState } from "react";
import { LogOut, Gamepad2, Lightbulb, MessageCircle, Grid3x3, Brain, Scissors, User } from "lucide-react";
import TicTacToe from "./games/TicTacToe";

type Friend = { email: string; name: string; photoURL?: string; status?: 'friend' | 'request' };
type UserData = { name: string; email: string; photoURL?: string };

type Props = {
    user: UserData;
    friends: Friend[];
    onSelectFriend: (f: Friend) => void;
    onSignOut: () => void;
};

export default function Dashboard({ user, friends, onSelectFriend, onSignOut }: Props) {
    const [activeGame, setActiveGame] = useState<string | null>(null);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1614730341194-75c60740a0fd?q=80&w=2874&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: 40,
            boxSizing: 'border-box',
            fontFamily: '"Outfit", sans-serif',
            color: 'white',
            overflow: 'hidden'
        }}>
            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }} />

            {/* Top Bar */}
            <div style={{
                width: '100%', maxWidth: 1200, height: 80,
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)',
                borderRadius: 50,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px',
                marginBottom: 30,
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', overflow: 'hidden', border: '2px solid white' }}>
                        {user.photoURL ? <img src={user.photoURL} alt="me" style={{ width: '100%', height: '100%' }} /> : <div style={{ width: '100%', height: '100%', background: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User /></div>}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Welcome, {user.name}</h2>
                        <div style={{ fontSize: 13, opacity: 0.8 }}>Stay chill.</div>
                    </div>
                </div>

                <button onClick={onSignOut} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 10 }}>
                    <LogOut size={24} />
                </button>
            </div>

            {/* Main Content or Game Overlay */}
            {activeGame === 'Chill Tac Toe' ? (
                <div style={{ flex: 1, width: '100%', maxWidth: 1200, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', borderRadius: 30, zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <TicTacToe onClose={() => setActiveGame(null)} />
                </div>
            ) : (
                <div style={{
                    width: '100%', maxWidth: 1200, flex: 1,
                    display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 30,
                    zIndex: 10
                }}>

                    {/* Left Panel - People Vibing Now */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                        borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)',
                        padding: 30, display: 'flex', flexDirection: 'column'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 22 }}>
                            <User size={24} color="#67E8F9" /> People Vibing Now
                        </h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15, overflowY: 'auto', alignContent: 'flex-start' }}>
                            {friends.length === 0 && <div style={{ opacity: 0.6 }}>No friends yet. Add some!</div>}

                            {friends.filter(f => f.status !== 'request').map(f => (
                                <div key={f.email} style={{
                                    width: '45%', flexGrow: 1, minWidth: 250,
                                    background: 'rgba(255,255,255,0.15)', borderRadius: 20,
                                    padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    border: '1px solid rgba(255,255,255,0.1)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontWeight: 'bold' }}>
                                            {f.photoURL ? <img src={f.photoURL} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : f.name[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{f.name}</div>
                                            <div style={{ fontSize: 11, opacity: 0.7 }}>Vibing lately...</div>
                                        </div>
                                    </div>
                                    <button onClick={() => onSelectFriend(f)} style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #00C6FF, #0072FF)', border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer',
                                        boxShadow: '0 4px 10px rgba(0,114,255,0.3)'
                                    }}>
                                        <MessageCircle size={20} fill="white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel - Mini Games & Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>

                        {/* Mini Games */}
                        <div style={{
                            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                            borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)',
                            padding: 30, flex: 1
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20 }}>
                                <Gamepad2 size={24} color="#67E8F9" /> Mini Games
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                                {[
                                    { name: 'Chill Tac Toe', icon: Grid3x3 },
                                    { name: 'Zen Memory', icon: Brain },
                                    { name: 'Rock Paper Scissors', icon: Scissors }
                                ].map(g => (
                                    <div key={g.name}
                                        onClick={() => g.name === 'Chill Tac Toe' ? setActiveGame(g.name) : alert('Coming soon!')}
                                        style={{
                                            padding: '15px 20px', borderRadius: 50, background: 'rgba(255,255,255,0.15)',
                                            display: 'flex', alignItems: 'center', gap: 15, cursor: 'pointer',
                                            border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                    >
                                        <g.icon size={20} color="#FDE68A" />
                                        <span style={{ fontWeight: 600 }}>{g.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Did you know? */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(244, 114, 182, 0.4))', // Purple/Pink
                            backdropFilter: 'blur(20px)',
                            borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)',
                            padding: 25, boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}>
                            <h4 style={{ margin: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                Did you know?
                            </h4>
                            <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.9, margin: 0 }}>
                                Listening to ocean sounds can reduce stress levels by 30%. Relax and enjoy.
                            </p>
                        </div>

                    </div>
                </div>
            )}

            {/* Music Widget */}
            <div style={{
                position: 'absolute', bottom: 30, left: 30, zIndex: 10,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 50,
                padding: '10px 20px',
                display: 'flex', alignItems: 'center', gap: 15,
                color: 'white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: 20 }}>🎵</div>
                <div style={{ fontWeight: 600, fontSize: 13, letterSpacing: 0.5 }}>Chill Lofi</div>
            </div>

        </div>
    );
}
