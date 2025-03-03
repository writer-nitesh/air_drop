// import React, { useState, useRef } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { RTCPeerConnection, RTCSessionDescription } from "react-native-webrtc";
// import { signaling } from "@/signaling";

// const configuration: RTCConfiguration = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// const Receiver: React.FC = () => {
//     const [status, setStatus] = useState("Waiting for sender...");
//     const [receivedData, setReceivedData] = useState<string[]>([]);
//     const peerConnection = useRef(new RTCPeerConnection(configuration));

//     signaling.onOfferReceived(async (offer) => {
//         await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

//         const answer = await peerConnection.current.createAnswer();
//         await peerConnection.current.setLocalDescription(answer);
//         signaling.sendAnswer(answer);
//     });

//     peerConnection.current.ondatachannel = (event) => {
//         const receiveChannel = event.channel;

//         receiveChannel.onopen = () => setStatus("Connected. Receiving file...");
//         receiveChannel.onmessage = (event) => handleReceivedData(event.data);
//         receiveChannel.onclose = () => setStatus("Connection closed.");
//     };

//     const handleReceivedData = (data: string) => {
//         if (data === "EOF") {
//             setStatus("File received successfully!");
//         } else {
//             setReceivedData((prev) => [...prev, data]);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.status}>{status}</Text>
//             {receivedData.length > 0 && <Text style={styles.fileText}>File received.</Text>}
//         </View>
//     );
// };

// export default Receiver;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 20,
//     },
//     status: {
//         fontSize: 16,
//         marginBottom: 20,
//     },
//     fileText: {
//         fontSize: 14,
//         color: "green",
//         marginTop: 10,
//     },
// });
