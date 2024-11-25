import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import { useMemo } from 'react';
import { RouterLink } from '@components';
import { Scrollbar } from 'src/components/scrollbar';
import { useAuth } from 'src/hooks/use-auth';
import { useFirebaseAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import type { NavColor } from 'src/types/settings';
import { Section } from '../config/config';
import { MobileNavSection } from './mobile-nav-section';
import logo from 'public/logo.png';
import Image from 'next/image';

const MOBILE_NAV_WIDTH: number = 280;

const useCssVars = (color: NavColor): Record<string, string> => {
  const theme = useTheme();

  return useMemo((): Record<string, string> => {
    switch (color) {
      // Blend-in and discreet have no difference on mobile because
      // there's a backdrop and differences are not visible
      case 'blend-in':
      case 'discreet':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': theme.palette.background.default,
            '--nav-color': theme.palette.neutral[100],
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[900],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': 'primary.main',
            '--nav-item-disabled-color': theme.palette.neutral[600],
            '--nav-item-icon-color': theme.palette.neutral[900],
            '--nav-item-icon-active-color': 'primary.main',
            '--nav-item-icon-disabled-color': theme.palette.neutral[700],
            '--nav-item-chevron-color': theme.palette.neutral[700],
            '--nav-scrollbar-color': theme.palette.neutral[400]
          };
        } else {
          return {
            '--nav-bg': theme.palette.background.default,
            '--nav-color': theme.palette.text.primary,
            '--nav-logo-border': theme.palette.neutral[100],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[900],
            '--nav-item-hover-bg': theme.palette.action.hover,
            '--nav-item-active-bg': theme.palette.action.selected,
            '--nav-item-active-color': 'primary.main',
            '--nav-item-disabled-color': theme.palette.neutral[400],
            '--nav-item-icon-color': theme.palette.neutral[900],
            '--nav-item-icon-active-color': 'primary.main',
            '--nav-item-icon-disabled-color': theme.palette.neutral[400],
            '--nav-item-chevron-color': theme.palette.neutral[400],
            '--nav-scrollbar-color': theme.palette.neutral[900]
          };
        }

      case 'evident':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': theme.palette.neutral[800],
            '--nav-color': theme.palette.common.white,
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[900],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': 'primary.main',
            '--nav-item-disabled-color': theme.palette.neutral[500],
            '--nav-item-icon-color': theme.palette.neutral[900],
            '--nav-item-icon-active-color': 'primary.main',
            '--nav-item-icon-disabled-color': theme.palette.neutral[500],
            '--nav-item-chevron-color': theme.palette.neutral[600],
            '--nav-scrollbar-color': theme.palette.neutral[400]
          };
        } else {
          return {
            '--nav-bg': theme.palette.neutral[800],
            '--nav-color': theme.palette.common.white,
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[900],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': 'primary.main',
            '--nav-item-disabled-color': theme.palette.neutral[500],
            '--nav-item-icon-color': theme.palette.neutral[900],
            '--nav-item-icon-active-color': 'primary.main',
            '--nav-item-icon-disabled-color': theme.palette.neutral[500],
            '--nav-item-chevron-color': theme.palette.neutral[600],
            '--nav-scrollbar-color': theme.palette.neutral[400]
          };
        }

      default:
        return {};
    }
  }, [theme, color]);
};

interface MobileNavProps {
  color?: NavColor;
  onClose?: () => void;
  open?: boolean;
  sections?: Section[];
}

export const MobileNav: FC<MobileNavProps> = (props) => {
  const { color = 'evident', open, onClose } = props;
  const cssVars = useCssVars(color);
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebaseAuth();
  const router = useRouter();

  return (
    <Drawer
      anchor='right'
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: '#f8f9fa',
          color: 'black',
          width: MOBILE_NAV_WIDTH
        }
      }}
      variant='temporary'
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)'
          }
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack
            alignItems='center'
            direction='row'
            spacing={2}
            sx={{ p: 2, justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Box
              component={RouterLink}
              href={paths.index}
              sx={{
                display: 'flex',
                height: 40,
                width: '40%'
              }}
            >
              <Image alt='Logo' height={40} src={logo} width={40} />
            </Box>
            <IconButton onClick={onClose} color='inherit'>
              <CloseIcon color='success' />
            </IconButton>
          </Stack>

          <Stack
            component='nav'
            spacing={2}
            sx={{
              px: 2
            }}
            alignItems={'flex-start'}
          >
            {props.sections?.map((section, index) => (
              <MobileNavSection
                key={index}
                items={section.items}
                pathname={router.pathname}
                subheader={section.subheader}
              />
            ))}
          </Stack>
          <Divider className='py-2' />
          {(user?.email || firebaseUser?.email) && (
            <Stack mb={2}>
              <Stack direction={'row'} alignItems={'center'}>
                <Link
                  component={RouterLink}
                  href={paths.dashboard.index}
                  underline='none'
                  width={'100%'}
                >
                  <Stack
                    direction={'row'}
                    alignItems={'center'}
                    spacing={1.5}
                    width={'100%'}
                    sx={{
                      p: 2,
                      position: 'sticky',
                      cursor: 'pointer',
                      bottom: 0,
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <Avatar
                      sx={{
                        height: 45,
                        width: 45,
                        borderWidth: 2
                      }}
                      src={user?.photoUrl || firebaseUser?.photoUrl}
                    >
                      <SvgIcon>
                        <User01Icon />
                      </SvgIcon>
                    </Avatar>
                    <Stack>
                      <Typography fontSize={10} color={'black'} fontWeight={600}>
                        {user?.lastName || firebaseUser?.lastName}{' '}
                        {user?.firstName || firebaseUser?.firstName}
                      </Typography>
                    </Stack>
                  </Stack>
                </Link>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

MobileNav.propTypes = {
  color: PropTypes.oneOf<NavColor>(['blend-in', 'discreet', 'evident']),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool
};
