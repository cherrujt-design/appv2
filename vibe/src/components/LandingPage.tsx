import React from "react";
import { Play, Volume2, Settings } from "lucide-react";

type Props = {
    onSignIn: () => void;
};

export default function LandingPage({ onSignIn }: Props) {
    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1614730341194-75c60740a0fd?q=80&w=2874&auto=format&fit=crop')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            fontFamily: '"Outfit", sans-serif'
        }}>
            {/* Settings Icon */}
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: 10, borderRadius: '50%', backdropFilter: 'blur(10px)', cursor: 'pointer' }}>
                    <Settings size={24} color="white" />
                </div>
            </div>

            {/* Glassmorphic Sign In Card */}
            <div style={{
                width: 420,
                padding: '60px 40px',
                background: 'rgba(255, 255, 255, 0.1)', // Very translucent white
                backdropFilter: 'blur(16px)', // Heavy blur
                borderRadius: 24,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 10
            }}>

                {/* Title */}
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    margin: 0,
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    Welcome Back
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginTop: 8,
                    marginBottom: 40,
                    fontWeight: 400
                }}>
                    Ready to chill with your friends?
                </p>

                {/* Google Sign In Button */}
                <button
                    onClick={onSignIn}
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: 50,
                        padding: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#333',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fff'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                >
                    {/* Google G Logo */}
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                </button>

                {/* Footer Text */}
                <div style={{
                    marginTop: 30,
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    maxWidth: 240,
                    lineHeight: 1.4
                }}>
                    By joining, you agree to spread good vibes only.
                </div>

            </div>

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
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
                <Play size={16} fill="white" style={{ cursor: 'pointer' }} />
                <Volume2 size={16} style={{ cursor: 'pointer' }} />
            </div>

        </div>
    );
}
