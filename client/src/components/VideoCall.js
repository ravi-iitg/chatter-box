import React, { useRef, useEffect, useState } from "react";
import { SocketState } from "../contexts/SocketProvider";
import { useNavigate, useParams } from "react-router-dom";
import { ChatState } from "../contexts/ChatProvider";
import { Box, Button } from "@chakra-ui/react";

const VideoCall = () => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  //   const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  const socket = SocketState();
  const { roomId } = useParams();
  const { reciever, caller } = ChatState();
  const [otherPerson, setOtherPerson] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (caller) setOtherPerson(caller);
    if (reciever) setOtherPerson(reciever);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socket.emit("join room", roomId);

        socket.on("other user", (userID) => {
          callUser(userID);
          otherUser.current = userID;
        });

        socket.on("user joined", (userID) => {
          otherUser.current = userID;
        });

        socket.on("offer", handleRecieveCall);

        socket.on("answer", handleAnswer);

        socket.on("ice-candidate", handleNewICECandidateMsg);
      });
  }, []);

  useEffect(() => {
    socket.on("user-disconnected", () => {
      navigate("/chats");
      window.location.reload();
    });
  });

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  }

  function createPeer(userID) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer()
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming) {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socket.id,
          sdp: peerRef.current.localDescription,
        };
        socket.emit("answer", payload);
      });
  }

  function handleAnswer(message) {
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socket.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  function handleTrackEvent(e) {
    partnerVideo.current.srcObject = e.streams[0];
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box boxShadow="dark-lg" margin="4" height="60vh">
        <video autoPlay ref={userVideo} />
      </Box>
      <Box boxShadow="dark-lg" margin="4" height="60vh">
        <video autoPlay ref={partnerVideo} />
      </Box>
      <Button
        onClick={() => {
          navigate("/chats");
          socket.emit("user-disconnected", otherPerson);
          window.location.reload();
        }}>
        Disconnect
      </Button>
    </Box>
  );
};

export default VideoCall;
