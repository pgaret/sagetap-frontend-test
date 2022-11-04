import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { queryArtwork } from "../../api";
import { Paper } from "@mui/material";

export type ArtworkMeta = {
    id: number;
    disabled: boolean;
};

type NewArtFormProps = {
    artworks: ArtworkMeta[];
    handleAddArtwork: (id: number) => void;
    handleSnackbarMessage: (message: string) => void;
};

export const NewArtworkForm: FC<NewArtFormProps> = (props) => {
    const { artworks, handleAddArtwork, handleSnackbarMessage } = props;

    const isDesktop = useMediaQuery("(min-width:600px)");

    const [artworkId, setArtworkId] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleIdChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (error) setError("");
        setArtworkId(event.currentTarget.value);
    };

    const onArtworkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const id = Number(artworkId);

        if (artworks.findIndex((art) => art.id === id) > -1) {
            setError("Artwork already listed");
            return;
        }

        try {
            const response = await queryArtwork(id);

            if (!response.data) {
                setError("Artwork does not exist");
            } else {
                handleAddArtwork(id);
                setArtworkId("");
                setError("");
                handleSnackbarMessage("Artwork successfully added");
            }
        } catch {
            setError("Artwork does not exist");
        }
    };

    return (
        <form onSubmit={onArtworkSubmit}>
            <Paper
                sx={{
                    display: "flex",
                    alignItems: isDesktop ? "end" : "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    flexDirection: isDesktop ? "row" : "column",
                    width: "50vw",
                    marginLeft: "25vw",
                    paddingTop: "16px",
                    paddingBottom: "32px",
                }}
            >
                <Typography variant="h6" sx={{ marginLeft: "4px" }}>
                    Add Artwork:
                </Typography>
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
                        margin: "0 4px",
                    }}
                    inputProps={{
                        "data-testid": "new-art-input",
                    }}
                />
                <Button
                    variant="contained"
                    disabled={!artworkId}
                    type="submit"
                    data-testid="new-art-submit"
                >
                    Submit
                </Button>
                {error && (
                    <Typography
                        color="error.main"
                        component="div"
                        sx={{ marginLeft: "4px" }}
                    >
                        {error}
                    </Typography>
                )}
            </Paper>
        </form>
    );
};
