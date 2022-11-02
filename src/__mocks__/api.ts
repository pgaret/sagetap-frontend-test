export const queryArtwork = async (id: number) => {
    return {
        data: {
            id: id,
            artist_title: "asdf",
            image_id: "2d484387-2509-5e8e-2c43-22f9981972eb",
            title: "title",
        },
    };
};

type ArtworkRating = {
    id: number;
    rating: number;
};

export const rateArtwork = async (rating: ArtworkRating) => {
    return {
        message: "Success",
    };
};
