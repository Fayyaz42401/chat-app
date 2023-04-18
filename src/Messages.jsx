import { HStack ,Text ,Avatar, VStack} from '@chakra-ui/react'
import React from 'react'

const Messages = ({text , uri , user='other' }) => {
  return (
    <>
    <HStack  alignSelf={user === 'other' ? 'flex-start' : 'flex-end' }   bg='#efefef' p='3'  borderRadius='base'>
      {
        user === 'other' ? <Avatar  size={'md'} src={uri} /> :'' 
      }
        <Text fontSize={'1rem'} >{text}</Text>
      {
        user === 'me' ? <Avatar  size={'md'} src={uri} /> :'' 
      }
    </HStack>
      </>
  )
}

export default Messages