import { IconButton, VStack, Avatar , WrapItem} from "@chakra-ui/react";
import React from "react";
import { CloseButton } from "@chakra-ui/react";
const Singup = ({uri}) => {
  return (
    <VStack h="100vh" justifyContent={"center"} border="2px solid red">
      <VStack height={"400px"} w="400px" border={"2px solid blue"}>
        <IconButton>
          <CloseButton />
        </IconButton>

          <Avatar src={uri} />
      </VStack>
    </VStack>
  );
};

export default Singup;
