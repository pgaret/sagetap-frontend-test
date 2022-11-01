import React, { FC, useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import HideImageIcon from '@mui/icons-material/HideImage';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

type Artwork = {
    id: number;
    title: string;
    artist_title: string;
    image_id: string;
};

async function getArtwork(id: number) {
    return fetch(
        "https://api.artic.edu/api/v1/artworks/" +
            id +
            "?fields=id,title,artist_title,image_id"
    );
}

function getImageUrl(id: string) {
    return "https://www.artic.edu/iiif/2/" + id + "/full/843,/0/default.jpg";
}

enum RatingStatus {
    NOT_RATED = 'Not Rated',
    RATING_LOADING = 'Rating Loading',
    RATING_ERROR = 'Rating Error',
    RATING_SUCCESS = 'Rating Success'
}

type ArtItemProps = {
    id: number;
    disabled: boolean;
};

export const Artwork: FC<ArtItemProps> = (props) => {
    const { id, disabled } = props;

    const [rating, setRating] = useState<number>(0);
    const [artwork, setArtwork] = useState<Artwork>();
    const [ratingStatus, setRatingStatus] = useState<RatingStatus>(RatingStatus.NOT_RATED);

    const mediaQuery = useMediaQuery("(min-width:600px)");

    const color = useMemo(() => {
        switch (ratingStatus) {
            case RatingStatus.RATING_ERROR:
                return 'error';
            case RatingStatus.RATING_SUCCESS:
                return 'success';
            default:
                return 'primary';
        }
    }, [ratingStatus])
    
    const ratings = [1, 2, 3, 4, 5];

    const submitRating = async () => {
        setRatingStatus(RatingStatus.RATING_LOADING);
        try {
            const response = await fetch('https://v0867.mocklab.io/rating', {
                method: 'POST',
                body: JSON.stringify({
                    id,
                    rating
                })
            })

            const responseBody = await response.json();

            if (responseBody.message === 'Success') {
                setRatingStatus(RatingStatus.RATING_SUCCESS);
            } else {
                setRatingStatus(RatingStatus.RATING_ERROR)
            }

        } catch(error) {
            setRatingStatus(RatingStatus.RATING_ERROR)
        }
        /* 
      Please have the submit button POST to https://v0867.mocklab.io/rating with the following payload:
  
        {
          "id": {#id},
          "rating": {#rating}
        }
  
      Where id is the artwork's id, and rating is the selected rating.
  
      The endpoint should return the following:
  
      {
        "message": "Success"
      }
    */
    };

    useEffect(() => {
        if (disabled) return;
        getArtwork(id)
            .then((r) => r.json())
            .then((json) => {
                setArtwork(json.data);
            });
    }, [id, disabled]);

    return (
        <Card sx={{ width: 400 }}>
            {!artwork && disabled && (
                <CardContent sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    padding: 0
                }}>
                    <HideImageIcon sx={{ width: 140, height: 140 }} />
                </CardContent>
            ) }
            {artwork && !disabled && (
                <Box sx={{
                    height: 420,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'auto'
                }}>
                    <Box>
                        <CardMedia
                            component="img"
                            sx={{
                                maxWidth: 360,
                                maxHeight: 240,
                                objectFit: "contain",
                            }}
                            image={getImageUrl(artwork.image_id)}
                            alt={artwork.title}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {artwork.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {artwork.artist_title}
                            </Typography>
                        </CardContent>
                    </Box>
                    <CardActions sx={{
                        paddingBottom: '16px',
                        display: 'block',
                        textAlign: 'center'
                    }}>
                        { ratingStatus === RatingStatus.RATING_ERROR && <Typography variant="caption" component="div" color="error.main">Ran into an error, please refresh and try again</Typography> }
                        { ratingStatus === RatingStatus.RATING_SUCCESS && <Typography variant="caption" component="div" color="success.main">Artwork rated successfully</Typography> }
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <ButtonGroup color={color} orientation={mediaQuery ? 'horizontal' : 'vertical'}>
                                {ratings.map(r => <Button key={`${artwork.id}-${r}`} variant={r === rating ? 'contained' : 'outlined'} onClick={() => setRating(r)}>{r}</Button>)}
                                <LoadingButton
                                    loading={ratingStatus === RatingStatus.RATING_LOADING}
                                    loadingPosition="start"
                                    startIcon={<SendIcon />}
                                    variant="outlined"
                                    onClick={submitRating}
                                    disabled={!rating || ratingStatus !== RatingStatus.NOT_RATED}
                                >
                                    Rate
                                </LoadingButton>
                            </ButtonGroup>
                        </Box>
                    </CardActions>
                </Box>
            )}
        </Card>
    );
};