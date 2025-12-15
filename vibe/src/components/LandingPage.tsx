import React from "react";
import { Play, Volume2, Settings } from "lucide-react";

type Props = {
    onSignIn: () => void;
};

export default function LandingPage({ onSignIn }: Props) {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1614730341194-75c60740a0fd?q=80&w=2874&auto=format&fit=crop')", // Anime/Lofi style sunset
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            fontFamily: '"Outfit", sans-serif'
        }}>
            {/* Overlay Gradient for better text readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))' }} />

            {/* Top Right Settings */}
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: '50%', backdropFilter: 'blur(10px)', cursor: 'pointer' }}>
                    <Settings size={24} color="white" />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Title "VibeChat" */}
                <h1 style={{
                    fontSize: '6rem',
                    fontWeight: 900,
                    margin: 0,
                    lineHeight: 1,
                    background: 'linear-gradient(90deg, #FDE68A 0%, #FCA5A5 50%, #67E8F9 100%)', // Yellow -> Pink -> Cyan
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))',
                    letterSpacing: '-2px'
                }}>
                    VibeChat
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '1.5rem',
                    color: 'rgba(255,255,255,0.95)',
                    marginTop: 10,
                    marginBottom: 40,
                    fontWeight: 400,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    The chillest place to hang out with friends.
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 20 }}>
                    <button
                        onClick={onSignIn}
                        style={{
                            background: 'linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)',
                            border: 'none',
                            padding: '16px 40px',
                            borderRadius: 50,
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(0, 114, 255, 0.4)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Start Vibing
                    </button>

                    <button style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '16px 40px',
                        borderRadius: 50,
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'white',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                    }}>
                        Learn More
                    </button>
                </div>
            </div>

            {/* Bottom Left Music Widget */}
            <div style={{
                position: 'absolute', bottom: 30, left: 30, zIndex: 10,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 50,
                padding: '10px 20px',
                display: 'flex', alignItems: 'center', gap: 15,
                color: 'white'
            }}>
                <div style={{ fontSize: 20 }}>🎵</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Chill Lofi</div>
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.3)' }} />
                <Play size={18} fill="white" />
                <Volume2 size={18} />
            </div>

            {/* Bottom Center Text */}
            <div style={{ position: 'absolute', bottom: 30, zIndex: 10, opacity: 0.6, fontSize: 12 }}>
                Made for relaxation. Turn up the volume.
            </div>

        </div>
    );
}
