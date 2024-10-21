import type { PaletteOptions } from '@mui/material';
import { common } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import { neutral, withAlphas } from '../colors';
import type { ColorPreset, Contrast } from '../index';

interface Config {
  colorPreset?: ColorPreset;
  contrast?: Contrast;
}

export const createPalette = (config: Config): PaletteOptions => {
  const { contrast } = config;

  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha('#2970FF', 0.04),
      selected: alpha('#2970FF', 0.08)
    },
    background: {
      default: contrast === 'high' ? neutral[50] : common.white,
      paper: common.white
    },
    divider: '#E0E5EB',

    error: withAlphas({
      lightest: '#FEF3F2',
      light: '#FEE4E2',
      main: '#F04438',
      dark: '#B42318',
      darkest: '#7A271A',
      contrastText: common.white
    }),
    info: withAlphas({
      lightest: '#ECFDFF',
      light: '#CFF9FE',
      main: '#06AED4',
      dark: '#0E7090',
      darkest: '#164C63',
      contrastText: common.white
    }),
    mode: 'light',
    neutral,
    primary: withAlphas({
      lightest: '#F5F8FF',
      light: '#EBEFFF',
      main: '#2970FF',
      dark: '#004EEB',
      darkest: '#00359E',
      contrastText: common.white,
      hovered: '#2970FF0A'
    }),
    secondary: withAlphas({
      lightest: '#F8F9FA',
      light: '#F3F4F6',
      main: '#6C737F',
      dark: '#384250',
      darkest: '#111927',
      contrastText: common.white
    }),
    success: withAlphas({
      lightest: '#F6FEF9',
      light: '#EDFCF2',
      main: '#16B364',
      dark: '#087443',
      darkest: '#084C2E',
      contrastText: common.white
    }),
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900], 0.38)
    },
    warning: withAlphas({
      lightest: '#FFFAEB',
      light: '#FEF0C7',
      main: '#F79009',
      dark: '#B54708',
      darkest: '#7A2E0E',
      contrastText: common.white
    })
  };
};
