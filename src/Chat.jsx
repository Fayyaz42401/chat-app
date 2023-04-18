import { Box, Button, Container, Input, VStack } from "@chakra-ui/react";
import Messages from "./Messages";
import { useEffect, useRef, useState } from "react";
import { app } from "./firebase";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const auth = getAuth(app);

const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => {
  signOut(auth);
};

const Chat = () => {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messageArr, setMessageArr] = useState([]);
  const divToScroll = useRef();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");

      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      divToScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const logout = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unSubscribeForMessage = onSnapshot(q, (snap) => {
      setMessageArr(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      logout();
      unSubscribeForMessage();
    };
  }, []);
  return (
    <Box>
      {user ? (
        <Container h={"100vh"} bg="#fff" shadow={'dark-lg'} >
          <VStack h="full" position={"relative"}>
            <Button colorScheme={"red"} w="full" onClick={logoutHandler}>
              Logout
            </Button>

            <VStack
              w="full"
              h="89%"
              overflowY={"auto"}
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messageArr.map((item) => (
                <Messages
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}

              <div ref={divToScroll}></div>
            </VStack>

            <form
              onSubmit={submitHandler}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                position: "absolute",
                bottom: "5px",
                padding: "0 5px",
              }}
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter Your Message..."
                w="85%"
                bg="#fff"
                focusBorderColor="gray.500"
              />
              <Button type="submit" colorScheme={"red"}>
                Send
              </Button>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack bg="white" justifyContent={"center"} h="100vh">
          <Button onClick={loginHandler} colorScheme={"red"}>
            Sign In With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Chat;
