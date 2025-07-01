import React, { useState } from "react";
import { Typography, Paper, Box, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CognitiveFunction } from "@domain/function/function";
import { FunctionBlock } from "./FunctionBlock";
import { PrimaryPositionInfo, ShadowPositionInfo } from "../../data/positionInfo";
import { PositionInfoModal } from "../modals/PositionInfoModal";
import { designTokens } from "../../theme";

interface SortableFunctionSlotProps {
  id: string;
  label: string;
  function?: {
    id: string;
    type: CognitiveFunction;
  };
  isShadow?: boolean;
  onRemove?: (functionId: string) => void;
  isOverlay?: boolean;
  canAcceptDrop?: boolean;
  isInvalidDrop?: boolean;
}

export const SortableFunctionSlot: React.FC<SortableFunctionSlotProps> = ({ 
  id, 
  label, 
  function: func, 
  isShadow = false,
  onRemove,
  isOverlay = false,
  canAcceptDrop = true,
  isInvalidDrop = false
}) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({
    id,
    disabled: isShadow || isOverlay, // Enable dragging for slots with or without functions, except shadows
    data: {
      type: 'slot',
      function: func
    }
  });

  const style = isOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const positionInfo = isShadow 
    ? ShadowPositionInfo[label]
    : PrimaryPositionInfo[label];

  return (
    <Box 
      ref={setNodeRef} 
      style={style} 
      sx={{ 
        width: designTokens.slots.width,
        textAlign: "center",
        flexShrink: 0,
        ...(isOver && !isShadow && {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease',
        })
      }}
    >
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
          borderColor: isInvalidDrop ? "error.main" : 
                      canAcceptDrop && isOver && !isShadow ? "success.main" :
                      func ? "primary.main" : "divider",
          borderRadius: designTokens.borderRadius.lg / 8,
          opacity: isShadow ? 0.7 : 1,
          position: "relative",
          cursor: func && !isShadow && !isOverlay ? 'grab' : !isShadow ? 'copy' : 'default',
          background: func && !isShadow ? (theme) => 
            theme.palette.mode === 'dark' 
              ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.dark}15 100%)`
              : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}10 100%)`
            : undefined,
          transition: designTokens.transitions.normal,
          '&::before': isInvalidDrop ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(244, 67, 54, 0.1)',
            animation: 'pulse 1s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.1 },
              '50%': { opacity: 0.2 },
              '100%': { opacity: 0.1 }
            }
          } : {},
          '&:hover': func && !isShadow ? {
            borderColor: 'primary.dark',
            transform: 'translateY(-2px)',
            boxShadow: (theme) => 
              theme.palette.mode === 'dark' 
                ? designTokens.shadows.dark[3]
                : designTokens.shadows.light[3],
          } : !func && !isShadow ? {
            borderColor: 'primary.light',
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(99, 102, 241, 0.05)'
                : 'rgba(79, 70, 229, 0.03)',
          } : {},
          ...(isDragging && {
            cursor: 'grabbing',
            boxShadow: (theme) => 
              theme.palette.mode === 'dark' 
                ? designTokens.shadows.dark[4]
                : designTokens.shadows.light[4],
            transform: 'rotate(3deg)',
          }),
          ...(isOverlay && {
            boxShadow: (theme) => 
              theme.palette.mode === 'dark' 
                ? designTokens.shadows.dark[5]
                : designTokens.shadows.light[5],
            borderColor: 'primary.main',
            backgroundColor: 'background.paper',
            transform: 'rotate(-2deg)',
          }),
          ...(canAcceptDrop && isOver && !isShadow && {
            transform: 'scale(1.05)',
            borderColor: 'success.main',
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(76, 175, 80, 0.1)'
                : 'rgba(76, 175, 80, 0.05)',
          })
        }}
        {...(!isOverlay ? attributes : {})}
        {...(!isOverlay ? listeners : {})}
      >
        {func ? (
          <>
            <FunctionBlock
              id={func.id}
              cognitiveFunction={func.type}
              disabled={isShadow}
            />
            {!isShadow && onRemove && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(func.id);
                }}
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