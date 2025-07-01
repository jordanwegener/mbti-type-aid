import React, { useState } from "react";
import { Typography, Paper, Box, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useDroppable } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { FunctionBlock } from "./FunctionBlock";
import { PrimaryPositionInfo, ShadowPositionInfo } from "../../data/positionInfo";
import { PositionInfoModal } from "../modals/PositionInfoModal";
import { designTokens } from "../../theme";

interface FunctionSlotProps {
  id: string;
  label: string;
  function?: {
    id: string;
    type: CognitiveFunction;
  };
  isShadow?: boolean;
  onRemove?: (functionId: string) => void;
}

export const FunctionSlot: React.FC<FunctionSlotProps> = ({ 
  id, 
  label, 
  function: func, 
  isShadow = false,
  onRemove
}) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { setNodeRef } = useDroppable({
    id,
    disabled: isShadow
  });

  const positionInfo = isShadow 
    ? ShadowPositionInfo[label]
    : PrimaryPositionInfo[label];

  return (
    <Box sx={{ 
      width: designTokens.slots.width, 
      textAlign: "center",
      flexShrink: 0
    }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 1,
          gap: 0.5,
          height: 20
        }}
      >
        <Typography 
          variant="caption" 
          color={isShadow ? "text.secondary" : "primary"}
          sx={{
            lineHeight: 1,
            mt: '1px'
          }}
        >
          {label}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setIsInfoModalOpen(true)}
          sx={{ 
            padding: 0,
            width: 16,
            height: 16,
            color: isShadow ? 'text.secondary' : 'primary.main',
            '&:hover': {
              backgroundColor: 'transparent'
            },
            '&:focus': {
              outline: 'none'
            },
            '& .MuiSvgIcon-root': {
              fontSize: 14
            }
          }}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Box>
      
      <Paper
        ref={setNodeRef}
        elevation={func ? 3 : 1}
        sx={{
          p: designTokens.spacing.lg / 8,
          height: designTokens.slots.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isShadow ? "action.disabledBackground" : "background.paper",
          border: func ? "2px solid" : "2px dashed",
          borderColor: func ? "primary.main" : "divider",
          borderRadius: designTokens.borderRadius.lg / 8,
          opacity: isShadow ? 0.7 : 1,
          position: "relative",
          background: func && !isShadow ? (theme) => 
            theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark}15 100%)`
              : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}10 100%)`
            : undefined,
          transition: designTokens.transitions.normal,
          '&:hover': func ? {} : {
            borderColor: 'primary.light',
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(99, 102, 241, 0.05)'
                : 'rgba(79, 70, 229, 0.03)',
          }
        }}
      >
        {func ? (
          <>
            <FunctionBlock
              id={func.id}
              cognitiveFunction={func.type}
              disabled={false}
            />
            {!isShadow && onRemove && (
              <IconButton
                size="small"
                onClick={() => onRemove(func.id)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  padding: 0.5,
                  backgroundColor: "background.paper",
                  "&:hover": {
                    backgroundColor: "action.hover"
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {isShadow ? "Mirror slot" : "Drop function here"}
          </Typography>
        )}
      </Paper>

      <PositionInfoModal
        open={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        positionInfo={positionInfo}
        isShadow={isShadow}
      />
    </Box>
  );
}; 