import React, { useState } from "react";
import { Typography, Paper, Box, IconButton } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useDroppable } from "@dnd-kit/core";
import { CognitiveFunction } from "@domain/function/function";
import { FunctionBlock } from "./FunctionBlock";
import { PrimaryPositionInfo, ShadowPositionInfo } from "../../data/positionInfo";
import { PositionInfoModal } from "../modals/PositionInfoModal";

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
    <Box sx={{ minWidth: 150, textAlign: "center" }}>
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
        sx={{
          p: 2,
          minHeight: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isShadow ? "action.disabledBackground" : "background.paper",
          border: "2px dashed",
          borderColor: func ? "primary.main" : "divider",
          opacity: isShadow ? 0.7 : 1,
          position: "relative"
        }}
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