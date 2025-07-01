import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  IconButton,
  LinearProgress,
  Collapse,
  Button
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { StackMatch } from "@utils/stackMatching";
import { MBTITypeDescriptions } from "@data/stack";
import { TypeInfoModal } from "../modals/TypeInfoModal";

interface MatchingResultsProps {
  matches: StackMatch[];
  maxMatches?: number;
}

export const MatchingResults: React.FC<MatchingResultsProps> = ({ 
  matches, 
  maxMatches = 5 
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayedMatches = showAll ? matches : matches.slice(0, maxMatches);
  const hasMore = matches.length > maxMatches;

  if (matches.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No matches found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add functions to your stack to see potential MBTI types
        </Typography>
      </Box>
    );
  }

  const handleInfoClick = (type: string) => {
    setSelectedType(type);
    setIsInfoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsInfoModalOpen(false);
    setSelectedType(null);
  };

  const getScorePercentage = (score: number) => {
    const maxPossibleScore = 10 * 4 + 10 * 3 + 10 * 2 + 10 * 1; // 100 points max
    return Math.min((score / maxPossibleScore) * 100, 100);
  };

  const getMatchColor = (score: number) => {
    const percentage = getScorePercentage(score);
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    if (percentage >= 40) return "info";
    return "error";
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Potential Matches ({matches.length})
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Types are ordered by how well they match your current stack. 
        Higher scores indicate better matches.
      </Typography>

      <Stack spacing={2}>
        {displayedMatches.map((match, index) => {
          const typeInfo = MBTITypeDescriptions[match.type];
          const percentage = getScorePercentage(match.score);
          const matchColor = getMatchColor(match.score);
          
          return (
            <Card key={match.type} variant="outlined">
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="h6" color="primary">
                        #{index + 1} {match.type}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleInfoClick(match.type)}
                        sx={{ padding: 0.5 }}
                      >
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {typeInfo.nickname}
                    </Typography>
                  </Box>
                  
                  <Box textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Match Score
                    </Typography>
                    <Typography variant="h6" color={`${matchColor}.main`}>
                      {percentage.toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    color={matchColor}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {match.matchedPositions.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Exact position matches: {match.matchedPositions.length} out of 4
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {match.matchedPositions.map((position) => (
                        <Chip
                          key={position}
                          label={`Position ${position + 1}`}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}

        {hasMore && (
          <Box textAlign="center">
            <Button
              variant="outlined"
              onClick={() => setShowAll(!showAll)}
              startIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showAll ? 'Show Less' : `Show All ${matches.length} Matches`}
            </Button>
          </Box>
        )}
      </Stack>

      {selectedType && (
        <TypeInfoModal
          open={isInfoModalOpen}
          onClose={handleCloseModal}
          type={selectedType as any}
        />
      )}
    </Box>
  );
};