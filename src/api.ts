export const queryArtwork = async (id: number) => {
    try {
        const response = await fetch(
            "https://api.artic.edu/api/v1/artworks/" +
                id +
                "?fields=id,title,artist_title,image_id"
        );
        const responseBody = await response.json();

        return responseBody;
    } catch (error) {
        return error;
    }
}

type ArtworkRating = {
    id: number;
    rating: number;
}

export const rateArtwork = async (rating: ArtworkRating) => {
    try {
        const response = await fetch("https://v0867.mocklab.io/rating", {
            method: "POST",
            body: JSON.stringify(rating),
        });

        const responseBody = await response.json();

        return responseBody;
    } catch (error) {
        return error;
    }
}

export default { queryArtwork, rateArtwork}