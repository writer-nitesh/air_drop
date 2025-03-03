// import React, { useState, useRef } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import * as DocumentPicker from "expo-document-picker";
// import * as FileSystem from "expo-file-system";
// import { RTCPeerConnection, RTCDataChannel, RTCSessionDescription } from "react-native-webrtc";
// import { signaling } from "@/signaling";

// const configuration: RTCConfiguration = {
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// const Sender: React.FC = () => {
//     const [file, setFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
//     const [status, setStatus] = useState("Select a file to send...");
//     const peerConnection = useRef(new RTCPeerConnection(configuration));
//     const dataChannel = useRef<RTCDataChannel | null>(null);

//     // Pick a file
//     const pickFile = async () => {
//         try {
//             const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
//             if (result.type === "success") {
//                 setFile(result);
//                 setStatus(`Selected File: ${result.name}`);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     // Setup WebRTC connection
//     const setupConnection = async () => {
//         dataChannel.current = peerConnection.current.createDataChannel("fileTransfer");

//         dataChannel.current.onopen = () => setStatus("Connected. Sending file...");
//         dataChannel.current.onclose = () => setStatus("Connection closed.");

//         const offer = await peerConnection.current.createOffer();
//         await peerConnection.current.setLocalDescription(offer);

//         signaling.sendOffer(offer);
//     };

//     // Send file in chunks
//     const sendFile = async () => {
//         if (!file || !dataChannel.current) return;

//         const fileUri = file.uri;
//         const fileInfo = await FileSystem.getInfoAsync(fileUri);
//         const chunkSize = 16 * 1024; // 16 KB
//         let offset = 0;

//         const sendChunk = async () => {
//             if (offset < fileInfo.size) {
//                 const chunk = await FileSystem.readAsStringAsync(fileUri, {
//                     encoding: FileSystem.EncodingType.Base64,
//                     position: offset,
//                     length: chunkSize,
//                 });

//                 dataChannel.current?.send(chunk);
//                 offset += chunkSize;
//                 setTimeout(sendChunk, 100); // Prevent overwhelming the channel
//             } else {
//                 dataChannel.current?.send("EOF");
//                 setStatus("File sent successfully!");
//             }
//         };

//         sendChunk();
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.status}>{status}</Text>

//             <TouchableOpacity style={styles.button} onPress={pickFile}>
//                 <Text style={styles.buttonText}>Select File</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.button} onPress={setupConnection}>
//                 <Text style={styles.buttonText}>Start Connection</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.button} onPress={sendFile} disabled={!file}>
//                 <Text style={styles.buttonText}>Send File</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default Sender;

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
//     button: {
//         backgroundColor: "#007bff",
//         padding: 12,
//         borderRadius: 5,
//         marginVertical: 10,
//     },
//     buttonText: {
//         color: "white",
//         fontSize: 16,
//     },
// });
