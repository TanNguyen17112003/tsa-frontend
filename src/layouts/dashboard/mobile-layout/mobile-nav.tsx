import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Box, Drawer, IconButton, Link, Stack, SvgIcon, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import type { FC } from 'react';
import { useMemo } from 'react';
import { RouterLink } from '@components';
import { Scrollbar } from 'src/components/scrollbar';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import type { NavColor } from 'src/types/settings';
import { Section } from '../config/config';

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
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleScrollToSection = (ref: string) => {
    router.push(`/#${ref}`);
    onClose?.();
  };

  return (
    <Drawer
      anchor='right'
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: '#34a853',
          color: 'white',
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
            sx={{ p: 3, justifyContent: 'space-between', alignItems: 'center' }}
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
              {/* <Logo /> */}
            </Box>
            <IconButton onClick={onClose} color='inherit'>
              <CloseIcon />
            </IconButton>
          </Stack>
          {user?.email && (
            <Stack mb={2}>
              <Stack direction={'row'}>
                <Link component={RouterLink} href={paths.dashboard.index} underline='none'>
                  <Stack
                    direction={'row'}
                    spacing={1.5}
                    sx={{
                      p: 2,
                      position: 'sticky',
                      cursor: 'pointer',
                      bottom: 0,
                      backgroundColor: 'white'
                    }}
                  >
                    <Avatar
                      sx={{
                        height: 40,
                        width: 40
                      }}
                      src={user?.photoUrl}
                    >
                      <SvgIcon>
                        <User01Icon />
                      </SvgIcon>
                    </Avatar>
                    <Typography color={'black'} fontWeight={600}>
                      {user.lastName} {user.firstName}
                    </Typography>
                  </Stack>
                </Link>
              </Stack>
            </Stack>
          )}
          <Stack
            component='nav'
            spacing={2}
            sx={{
              flexGrow: 1,
              px: 2
            }}
            alignItems={'flex-start'}
          >
            {props?.sections?.map((section, index) => (
              <IconButton
                key={index}
                sx={{
                  color: 'var(--nav-item-color)',
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'var(--nav-item-hover-bg)'
                  },
                  '&:active': {
                    backgroundColor: 'var(--nav-item-active-bg)',
                    color: 'var(--nav-item-active-color)'
                  },
                  '&:disabled': {
                    color: 'var(--nav-item-disabled-color)'
                  }
                }}
                // onClick={() => handleScrollToSection(section.ref)}
              >
                <Typography variant='subtitle2' color='white'>
                  {section.items[0].title}
                </Typography>
              </IconButton>
            ))}
            {user?.email && (
              <IconButton
                sx={{
                  color: 'var(--nav-item-color)',
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'var(--nav-item-hover-bg)'
                  },
                  '&:active': {
                    backgroundColor: 'var(--nav-item-active-bg)',
                    color: 'var(--nav-item-active-color)'
                  },
                  '&:disabled': {
                    color: 'var(--nav-item-disabled-color)'
                  },
                  justifyContent: 'start'
                }}
                onClick={signOut}
              >
                <Typography variant='subtitle2' color='white'>
                  Đăng xuất
                </Typography>
              </IconButton>
            )}
          </Stack>
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
