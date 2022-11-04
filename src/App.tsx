/* eslint-disable */

import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { ArtworkItem } from "./components/ArtworkItem/ArtworkItem";
import {
    NewArtworkForm,
    ArtworkMeta,
} from "./components/NewArtworkForm/NewArtworkForm";
import { TopBar } from "./components/TopBar/TopBar";
import { AlertDialog } from "./components/AlertDialog/AlertDialog";

export const App = () => {
    const [artworks, setArtworks] = useState<ArtworkMeta[]>([
        { id: 27992, disabled: false },
        { id: 27998, disabled: false },
        { id: 27999, disabled: false },
        { id: 27997, disabled: true },
        { id: 27993, disabled: false },
    ]);
    const [artworkToDelete, setArtworkToDelete] = useState<number>(-1);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");

    const handleAddArtwork = (id: number) => {
        setArtworks([...artworks, { id, disabled: false }]);
    };

    const handleRemoveArtwork = () => {
        setArtworks(artworks.filter((art) => art.id !== artworkToDelete));
        setArtworkToDelete(-1);
        setSnackbarMessage("Artwork successfully deleted");
    };

    return (
        <Box className="App">
            <TopBar />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    columnGap: "8px",
                    rowGap: "16px",
                    width: "70vw",
                    padding: "16px",
                    paddingLeft: "15vw",
                    paddingRight: "15vw",
                    marginTop: "16px",
                    height: "calc(100vh - 208px)",
                    overflow: "auto",
                }}
            >
                {artworks.map((art: any) => (
                    <ArtworkItem
                        key={art.id}
                        id={art.id}
                        disabled={art.disabled}
                        handleRemoveArtwork={setArtworkToDelete}
                        handleSnackbarMessage={setSnackbarMessage}
                    />
                ))}
            </Box>
            <NewArtworkForm
                handleAddArtwork={handleAddArtwork}
                handleSnackbarMessage={setSnackbarMessage}
                artworks={artworks}
            />
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={!!snackbarMessage}
                onClose={() => setSnackbarMessage("")}
            >
                <Alert
                    onClose={() => setSnackbarMessage("")}
                    severity="success"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {artworkToDelete >= 0 && (
                <AlertDialog
                    title="Delete Artwork"
                    body="Are you sure you want to delete this artwork?"
                    color="error"
                    handleCancel={() => setArtworkToDelete(-1)}
                    handleConfirm={handleRemoveArtwork}
                />
            )}
        </Box>
    );
};
