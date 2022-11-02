import React, { FC, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import HideImageIcon from "@mui/icons-material/HideImage";
import SendIcon from "@mui/icons-material/Send";
import Snackbar from "@mui/material/Snackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { queryArtwork, rateArtwork } from "../../api";

type Artwork = {
    id: number;
    title: string;
    artist_title: string;
    image_id: string;
};

enum RatingStatus {
    NOT_RATED = "Not Rated",
    RATING_LOADING = "Rating Loading",
    RATING_ERROR = "Rating Error",
    RATING_SUCCESS = "Rating Success",
}

type ArtItemProps = {
    id: number;
    disabled: boolean;
};

export const ArtworkItem: FC<ArtItemProps> = (props) => {
    const { id, disabled } = props;

    const [rating, setRating] = useState<number>(0);
    const [artwork, setArtwork] = useState<Artwork>();
    const [ratingStatus, setRatingStatus] = useState<RatingStatus>(
        RatingStatus.NOT_RATED
    );
    const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

    const mediaQuery = useMediaQuery("(min-width:600px)");

    const color = useMemo(() => {
        switch (ratingStatus) {
            case RatingStatus.RATING_ERROR:
                return "error";
            case RatingStatus.RATING_SUCCESS:
                return "success";
            default:
                return "primary";
        }
    }, [ratingStatus]);

    const ratings = [1, 2, 3, 4, 5];

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    }

    const submitRating = async () => {
        setRatingStatus(RatingStatus.RATING_LOADING);
        try {
            const response = await rateArtwork({ id, rating });

            if (response.message === "Success") {
                setRatingStatus(RatingStatus.RATING_SUCCESS);
                setIsSnackbarOpen(true);
            } else {
                setRatingStatus(RatingStatus.RATING_ERROR);
            }
        } catch (error) {
            setRatingStatus(RatingStatus.RATING_ERROR);
        }
    };

    useEffect(() => {
        if (disabled) return;

        const getArtwork = async() => {
            const response = await queryArtwork(id);

            if (response.data) {
                setArtwork(response.data)
            }
        }

        getArtwork();
    }, [id, disabled]);

    return (
        <Card sx={{ width: 400 }}>
            {!artwork && disabled && (
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        padding: 0,
                    }}
                >
                    <HideImageIcon sx={{ width: 140, height: 140 }} />
                </CardContent>
            )}
            {artwork && !disabled && (
                <Box
                    sx={{
                        height: 420,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "auto",
                    }}
                >
                    <Box>
                        <CardMedia
                            component="img"
                            sx={{
                                maxWidth: 360,
                                maxHeight: 240,
                                objectFit: "contain",
                            }}
                            image={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`}
                            alt={artwork.title}
                        />
                        <CardContent>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                {artwork.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {artwork.artist_title}
                            </Typography>
                        </CardContent>
                    </Box>
                    
                    <CardActions
                        sx={{
                            paddingBottom: "16px",
                            display: "block",
                            textAlign: "center",
                        }}
                    >
                        {ratingStatus === RatingStatus.RATING_ERROR && (
                            <Typography
                                variant="caption"
                                component="div"
                                color="error.main"
                            >
                                Ran into an error, please refresh and try again
                            </Typography>
                        )}
                        {ratingStatus === RatingStatus.RATING_SUCCESS && (
                            <Typography
                                variant="caption"
                                component="div"
                                color="success.main"
                            >
                                Artwork rated successfully
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            <ButtonGroup
                                color={color}
                                orientation={
                                    mediaQuery ? "horizontal" : "vertical"
                                }
                            >
                                {ratings.map((r) => (
                                    <Button
                                        key={`${artwork.id}-${r}`}
                                        variant={
                                            r === rating
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() => setRating(r)}
                                        data-testid={`rate-${r}`}
                                        disabled={ratingStatus !== RatingStatus.NOT_RATED}
                                    >
                                        {r}
                                    </Button>
                                ))}
                                <LoadingButton
                                    loading={
                                        ratingStatus ===
                                        RatingStatus.RATING_LOADING
                                    }
                                    loadingPosition="start"
                                    startIcon={<SendIcon />}
                                    variant="outlined"
                                    onClick={submitRating}
                                    disabled={
                                        !rating ||
                                        ratingStatus !== RatingStatus.NOT_RATED
                                    }
                                    data-testid="submit-rating"
                                >
                                    Rate
                                </LoadingButton>
                            </ButtonGroup>
                        </Box>
                    </CardActions>
                </Box>
            )}
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={isSnackbarOpen} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Artwork successfully rated!
                </Alert>
            </Snackbar>
        </Card>
    );
};
