import React, { FC, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { queryArtwork } from "../../api";

export type ArtworkMeta = {
    id: number;
    disabled: boolean;
}

type NewArtFormProps = {
    handleAddArtwork: (id: number) => void;
    artworks: ArtworkMeta[]
}

export const NewArtworkForm: FC<NewArtFormProps> = (props) => {
    const { artworks, handleAddArtwork } = props;

    const isDesktop = useMediaQuery("(min-width:600px)");

    const [artworkId, setArtworkId] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (error) setError("");
        setArtworkId(event.currentTarget.value);
    }

    const onArtworkSubmit = async () => {
        const id = Number(artworkId);

        if (artworks.findIndex(art => art.id === id) > -1) {
            setError('Artwork already listed');
            return;
        }

        try {
            const response = await queryArtwork(id);

            if (!response.data) {
                setError('Artwork does not exist');
            } else {
                handleAddArtwork(id);
                setArtworkId("");
                setError("");
            }
        } catch {
            setError('Artwork does not exist');
        }

    }

    return (
        <Box display="flex" alignItems={isDesktop ? 'end' : 'center'} justifyContent="center" flexWrap="wrap" flexDirection={isDesktop ? 'row' : 'column'}>
            <Typography variant="h6">Add Artwork:</Typography>
            <TextField
                id="new-art-id"
                value={artworkId}
                onChange={handleIdChange}
                label="Artwork Id"
                variant="standard"
                size="small"
                required
                error={!!error}
                sx={{
                    margin: '0 4px'
                }}
            />
            <Button variant="contained" disabled={!artworkId} onClick={onArtworkSubmit}>Submit</Button>
            { error && <Typography color="error.main" component="div" sx={{ marginLeft: '4px' }}>{error}</Typography>}
        </Box>
    );
};
