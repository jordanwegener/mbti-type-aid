import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { MBTIType, MBTITypeInfo } from '../../data/stack';

interface TypeInfoModalProps {
  open: boolean;
  onClose: () => void;
  type?: MBTIType;
  typeInfo?: MBTITypeInfo;
}

export const TypeInfoModal: React.FC<TypeInfoModalProps> = ({
  open,
  onClose,
  type,
  typeInfo
}) => {
  if (!type || !typeInfo) {
    return (
      <Dialog 
        open={false} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        sx={{ visibility: 'hidden' }}
      />
    );
  }

  const theme = useTheme();

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
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
        pb: 1
      }}>
        <Typography variant="h5">
          {type} - {typeInfo.nickname}
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

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {typeInfo.name}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {typeInfo.description}
        </Typography>

        <Box mb={2}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'success.main',
              borderBottom: 1,
              borderColor: 'divider',
              pb: 0.5
            }}
          >
            Strengths
          </Typography>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0 
          }}>
            {typeInfo.strengths.map((strength, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <Typography variant="body2">
                  • {strength}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>

        <Box>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'warning.main',
              borderBottom: 1,
              borderColor: 'divider',
              pb: 0.5
            }}
          >
            Challenges
          </Typography>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0 
          }}>
            {typeInfo.challenges.map((challenge, index) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <Typography variant="body2">
                  • {challenge}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 