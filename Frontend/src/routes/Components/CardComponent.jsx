import React from "react";
import {
  Paper,
  Box,
  Avatar,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CardComponent = ({ data, handleDelete, handleEdit }) => {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,

        transition: "all 0.25s ease",

        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      {/* Avatar e informações */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
      >
        <Avatar
          src={data.image}
          alt={data.title}
          sx={{ width: 56, height: 56, flexShrink: 0 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" noWrap>
            {data.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ wordBreak: "break-word" }}
          >
            {data.message}
          </Typography>
        </Box>
      </Box>

      {/* Botões de ação */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: { xs: 2, sm: 0 },
          alignSelf: { xs: "flex-end", sm: "center" },
        }}
      >
        <IconButton
          color="primary"
          onClick={() => handleEdit(data.id, data.deleteCode)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDelete(data.id, data.deleteCode)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default CardComponent;
