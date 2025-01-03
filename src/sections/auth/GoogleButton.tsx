import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import googleIcon from 'public/ui/google-icon.png';
import Image from 'next/image';
import { useMounted, useFirebaseAuth } from '@hooks';
import { useRouter } from 'next/router';
import { AuthContextType } from 'src/contexts/auth/firebase-context';
import useFunction from 'src/hooks/use-function';
import { paths } from 'src/paths';
function GoogleButton() {
  const isMounted = useMounted();
  const router = useRouter();

  const { signInWithGoogle } = useFirebaseAuth<AuthContextType>();
  const signInWithGoogleHelper = useFunction(signInWithGoogle, {
    onSuccess: () => {
      if (isMounted()) {
        router.push(paths.student.order.index);
      }
    }
  });
  return (
    <Button
      sx={{
        bgcolor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        borderRadius: 'full'
      }}
      className='flex gap-3 w-full hover:bg-gray-100'
      onClick={signInWithGoogleHelper.call}
    >
      <Box height={'100%'}>
        <Image src={googleIcon} height='20' objectFit='cover' alt='Google' />
      </Box>
      <Typography color='black' fontWeight={'bold'}>
        Đăng nhập với Google
      </Typography>
    </Button>
  );
}

export default GoogleButton;
