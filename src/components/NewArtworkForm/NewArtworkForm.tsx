import React, { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type ArtworkMeta = {
    id: number;
    disabled: boolean;
  }
  

type NewArtFormProps = {
    handleAddArtwork: (artwork: ArtworkMeta) => void;
}

export const NewArtworkForm: FC<NewArtFormProps> = (props) => {
    const { handleAddArtwork } = props;
    return (
        <Box display="flex" alignItems="end" justifyContent="center" flexWrap="wrap">
            <Typography variant="h6">Add Artwork:</Typography>
            <TextField
                id="new-art-id"
                label="Artwork Id"
                variant="standard"
                size="small"
                sx={{
                    margin: '0 4px'
                }}
            />
            <Button variant="contained">Submit</Button>
        </Box>
    );
};
