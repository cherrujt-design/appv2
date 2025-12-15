"use client";
import React, { useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MoreVertical, User } from "lucide-react";

type Props = {
    friend: { name: string; email: string };
    isVideo: boolean;
    onEnd: () => void;
};

export default function CallModal({ friend, isVideo, onEnd }: Props) {
    const [status, setStatus] = useState("Ringing...");
    const [duration, setDuration] = useState(0);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(isVideo);

    useEffect(() => {
        // Simulate connection after 2 seconds
        const t = setTimeout(() => {
            setStatus("Connected");
        }, 2000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        let int: NodeJS.Timeout;
        if (status === "Connected") {
            int = setInterval(() => setDuration(s => s + 1), 1000);
        }
        return () => clearInterval(int);
    }, [status]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="call-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
            <div style={{
                width: 350, height: 600, background: '#222', borderRadius: 12,
                display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid #333'
            }}>
                {/* Header */}
                <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', color: '#aeaeae' }}>
                    <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12 }}>🔒 End-to-end encrypted</span>
                    </div>
                    <MoreVertical size={20} />
                </div>

                {/* content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <User size={60} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#e1e1e1', margin: 0, fontWeight: 500, fontSize: 22 }}>{friend.name}</h2>
                        <div style={{ color: '#888', marginTop: 8 }}>
                            {status === "Connected" ? formatTime(duration) : status}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{
                    padding: 24,
                    background: '#1c1c1c',
                    borderRadius: '0 0 12px 12px',
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    alignItems: 'center'
                }}>
                    <button onClick={() => setCamOn(s => !s)} style={{
                        background: camOn ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: 'none', borderRadius: '50%', width: 50, height: 50, color: '#e1e1e1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        {camOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>

                    <button onClick={() => setMicOn(s => !s)} style={{
                        background: micOn ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: 'none', borderRadius: '50%', width: 50, height: 50, color: '#e1e1e1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>

                    <button onClick={onEnd} style={{
                        background: '#ea0038',
                        border: 'none', borderRadius: '50%', width: 50, height: 50, color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <PhoneOff size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
