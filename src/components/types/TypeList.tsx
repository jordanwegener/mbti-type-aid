import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { MBTIType, MBTITypeDescriptions, stackMap } from "@data/stack";
import { CognitiveFunction } from "@domain/function/function";
import { TypeInfoModal } from "../modals/TypeInfoModal";

interface TypeCardProps {
  type: MBTIType;
  stack: CognitiveFunction[];
  onInfoClick: (type: MBTIType) => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ type, stack, onInfoClick }) => {
  const typeInfo = MBTITypeDescriptions[type];
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h5" component="h2" color="primary">
            {type}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onInfoClick(type)}
            sx={{ padding: 0.5 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {typeInfo.nickname}
        </Typography>
        
        <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={2}>
          {stack.map((func, index) => (
            <Chip
              key={index}
              label={func}
              size="small"
              color={index === 0 ? "primary" : index === 1 ? "secondary" : "default"}
              sx={{ mb: 0.5 }}
            />
          ))}
        </Stack>
        
        <Typography variant="body2" color="text.secondary">
          {typeInfo.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const TypeList: React.FC = () => {
  const [selectedType, setSelectedType] = useState<MBTIType | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Convert stackMap to array of type data
  const typeData = Object.entries(stackMap).map(([stackString, type]) => ({
    type,
    stack: stackString.split(',') as CognitiveFunction[]
  }));

  // Sort by type name for consistent ordering
  typeData.sort((a, b) => a.type.localeCompare(b.type));

  const handleInfoClick = (type: MBTIType) => {
    setSelectedType(type);
    setIsInfoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsInfoModalOpen(false);
    setSelectedType(null);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        MBTI Types & Cognitive Function Stacks
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse all 16 MBTI personality types and their cognitive function stacks. 
        Click the info icon to learn more about each type.
      </Typography>

      <Grid container spacing={3}>
        {typeData.map(({ type, stack }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={type}>
            <TypeCard 
              type={type} 
              stack={stack} 
              onInfoClick={handleInfoClick}
            />
          </Grid>
        ))}
      </Grid>

      {selectedType && (
        <TypeInfoModal
          open={isInfoModalOpen}
          onClose={handleCloseModal}
          type={selectedType}
        />
      )}
    </Box>
  );
};