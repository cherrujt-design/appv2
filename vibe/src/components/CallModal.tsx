"use client";

import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, User, Lock } from "lucide-react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, updateDoc, collection, addDoc, onSnapshot as onSubSnapshot } from "firebase/firestore";

type Props = {
    friend: { name: string; email: string };
    isVideo: boolean;
    isIncoming?: boolean;
    callId: string;
    onEnd: () => void;
};

const servers = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
    ],
};

export default function CallModal({ friend, isVideo, onEnd, isIncoming, callId }: Props) {
    const [status, setStatus] = useState(isIncoming ? "Incoming Call..." : "Calling...");
    const [duration, setDuration] = useState(0);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(isVideo);
    const [connected, setConnected] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);

    // Initialize WebRTC
    useEffect(() => {
        // 1. Setup PC
        pc.current = new RTCPeerConnection(servers);

        // 2. Handle Remote Stream
        pc.current.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
                setStatus("Connected");
                setConnected(true);
            }
        };

        // 3. Handle ICE Candidates
        pc.current.onicecandidate = (event) => {
            if (event.candidate) {
                const candidatesCol = collection(db, "calls", callId, isIncoming ? "answerCandidates" : "offerCandidates");
                addDoc(candidatesCol, event.candidate.toJSON());
            }
        };

        // 4. Get Local Media
        navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true }).then((stream) => {
            localStream.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            stream.getTracks().forEach((track) => {
                pc.current?.addTrack(track, stream);
            });

            // 5. If CALLER, create Offer
            if (!isIncoming) {
                createOffer();
            }
        });

        // Cleanup
        return () => {
            //pc.current?.close(); // Keep it alive for cleaner unmount handling in onEnd? 
            // Best to close here to release camera
            localStream.current?.getTracks().forEach(t => t.stop());
            pc.current?.close();
        };
    }, []); // Run once on mount

    // Signaling Listener
    useEffect(() => {
        if (!pc.current) return;
        const callDoc = doc(db, "calls", callId);

        const unsub = onSnapshot(callDoc, async (snapshot) => {
            const data = snapshot.data();
            if (!data) return;

            // If CALLER: Wait for Answer
            if (!isIncoming && data.answer && !pc.current?.currentRemoteDescription) {
                const answerDescription = new RTCSessionDescription(data.answer);
                await pc.current?.setRemoteDescription(answerDescription);
                console.log("Remote Description Set (Answer)");
            }

            // Detect End
            if (data.status === 'ended') {
                onEnd();
            }
        });

        // Handle Candidates
        const candidatesCol = collection(db, "calls", callId, !isIncoming ? "answerCandidates" : "offerCandidates");
        const unsubCandidates = onSubSnapshot(candidatesCol, (snap) => {
            snap.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.current?.addIceCandidate(candidate);
                }
            });
        });

        return () => { unsub(); unsubCandidates(); };
    }, [callId, isIncoming]);


    const createOffer = async () => {
        const callDoc = doc(db, "calls", callId);
        const offerDescription = await pc.current!.createOffer();
        await pc.current!.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await updateDoc(callDoc, { offer });
    };

    const answerCall = async () => {
        setStatus("Connecting...");
        const callDoc = doc(db, "calls", callId);
        const snapshot = await new Promise<any>(resolve => onSnapshot(callDoc, resolve)()); // Quick fetch hack or use getDoc
        // Better to rely on snapshot in effect, wait...
        // Actually we need to get the offer first.

        // We'll trust the signaling listener logic, but for "Answer" button we invoke the logic manually?
        // No, we need to read the OFFER from DB first.

        // Let's assume passed props or re-fetch.
        // Re-fetch is safer. 
    };

    // Actually, split logic:
    // IF INCOMING: We need to Wait for user to press "Answer".
    // When "Answer" pressed -> Get Offer -> Set Remote -> Create Answer -> Write Answer.

    const handleAnswer = async () => {
        if (!pc.current) return;
        setStatus("Connecting...");

        // 1. Get Offer data (it should be there)
        // We can use a one-time listener or just assuming it's available?
        // Let's use getDoc (imported dynamically to safe space or just reuse logic?)
        // I'll cheat: listen to the callDoc in the main effect and store 'offer' in state?
        // Or just fetch it.

        // Simple fetch:
        const { getDoc } = await import("firebase/firestore");
        const d = await getDoc(doc(db, "calls", callId));
        const data = d.data();
        if (!data?.offer) return;

        const offerDescription = data.offer;
        await pc.current.setRemoteDescription(new RTCSessionDescription(offerDescription));

        const answerDescription = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        await updateDoc(doc(db, "calls", callId), { answer });
    };


    // Timer
    useEffect(() => {
        let int: NodeJS.Timeout;
        if (connected) {
            int = setInterval(() => setDuration(s => s + 1), 1000);
        }
        return () => clearInterval(int);
    }, [connected]);

    const formatTime = (s: number) => {
        const min = Math.floor(s / 60);
        const sec = s % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: 900, height: 650, background: '#222', borderRadius: 16,
                display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                position: 'relative'
            }}>

                {/* Main Video Area - SPLIT VIEW */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', background: '#000', position: 'relative' }}>

                    {/* Remote Video (Left or Full) */}
                    <div style={{
                        flex: connected ? 1 : 1,
                        position: 'relative',
                        borderRight: connected ? '1px solid #333' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {!connected && (
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', zIndex: 10 }}>
                                <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#444', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={50} color="#fff" />
                                </div>
                                <h2 style={{ color: 'white', fontWeight: 500, margin: 0 }}>{friend.name}</h2>
                                <p style={{ color: '#aaa', marginTop: 8 }}>{status}</p>
                                {isIncoming && !connected && (
                                    <div style={{ marginTop: 20 }}>
                                        <button onClick={handleAnswer} style={{ background: '#00a884', color: 'white', border: 'none', padding: '10px 30px', borderRadius: 30, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Accept Call</button>
                                    </div>
                                )}
                            </div>
                        )}
                        {connected && <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>That Person</div>}
                    </div>

                    {/* Local Video (Right or Hidden/PIP if waiting) */}
                    {/* We show Local Video SIDE BY SIDE when connected, or hidden/pip logic? 
                Actually user wants to SEE both. So we always show local. 
                If not connected, maybe we show local in background? 
                Let's sticky to Split View only when connected for better UI.
             */}
                    {connected ? (
                        <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid #333' }}>
                            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', bottom: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>You</div>
                        </div>
                    ) : (
                        /* PIP Style when Calling/Ringing so we can see ourselves while waiting */
                        <div style={{
                            position: 'absolute', bottom: 100, right: 20, width: 160, height: 120,
                            background: '#333', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            border: '1px solid #444', zIndex: 20
                        }}>
                            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                </div>

                {/* Header */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, padding: 20,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
                        <Lock size={14} /> <span style={{ fontSize: 13 }}>End-to-end encrypted</span>
                    </div>
                    {connected && <div style={{ color: 'white', fontWeight: 600 }}>{formatTime(duration)}</div>}
                </div>

                {/* Footer Controls */}
                <div style={{
                    height: 90, background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, zIndex: 50
                }}>
                    <button
                        onClick={() => { setMicOn(!micOn); localStream.current?.getAudioTracks().forEach(t => t.enabled = !micOn); }}
                        style={{ width: 50, height: 50, borderRadius: '50%', background: micOn ? '#333' : '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: micOn ? '#fff' : '#000' }}>
                        {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                    </button>

                    <button
                        onClick={() => { setCamOn(!camOn); localStream.current?.getVideoTracks().forEach(t => t.enabled = !camOn); }}
                        style={{ width: 50, height: 50, borderRadius: '50%', background: camOn ? '#333' : '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: camOn ? '#fff' : '#000' }}>
                        {camOn ? <Video size={24} /> : <VideoOff size={24} />}
                    </button>

                    <button onClick={onEnd} style={{ width: 60, height: 60, borderRadius: '50%', background: '#ea0038', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                        <PhoneOff size={28} />
                    </button>
                </div>

            </div>
        </div>
    );
}
