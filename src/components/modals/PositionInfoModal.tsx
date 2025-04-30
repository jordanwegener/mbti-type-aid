import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { PositionInfo } from '../../data/positionInfo';

interface PositionInfoModalProps {
  open: boolean;
  onClose: () => void;
  positionInfo: PositionInfo;
  isShadow?: boolean;
}

export const PositionInfoModal: React.FC<PositionInfoModalProps> = ({
  open,
  onClose,
  positionInfo,
  isShadow = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1,
        color: isShadow ? 'text.secondary' : 'primary.main'
      }}>
        <Typography variant="h6" component="span">
          {positionInfo.name}
        </Typography>
        <IconButton 
          onClick={onClose}
          size="small"
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {positionInfo.description}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}; 