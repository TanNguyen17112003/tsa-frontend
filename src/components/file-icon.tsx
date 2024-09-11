import type { FC } from 'react';
import PropTypes from 'prop-types';

type Extension = 'jpeg' | 'jpg' | 'mp4' | 'pdf' | 'png' | 'xlsx' | string;

const icons: Record<Extension, any> = {
  jpeg: '/ui/icons/icon-jpg.svg',
  jpg: '/ui/icons/icon-jpg.svg',
  mp4: '/ui/icons/icon-mp4.svg',
  pdf: '/ui/icons/icon-pdf.svg',
  png: '/ui/icons/icon-png.svg',
  svg: '/ui/icons/icon-svg.svg'
};

interface FileIconProps {
  extension?: Extension | null;
}

export const FileIcon: FC<FileIconProps> = (props) => {
  const { extension } = props;

  let icon: string;

  if (!extension) {
    icon = '/assets/icons/icon-other.svg';
  } else {
    icon = icons[extension] || '/assets/icons/icon-other.svg';
  }

  return <img src={icon} />;
};

FileIcon.propTypes = {
  extension: PropTypes.string
};
