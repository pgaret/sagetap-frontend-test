import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App";
import api from "./api";

type ArtworkRating = {
    id: number;
    rating: number;
};

jest.mock("./api", () => ({
    queryArtwork: async (id: number) => {
        return {
            data: {
                id: id,
                artist_title: "asdf",
                image_id: "2d484387-2509-5e8e-2c43-22f9981972eb",
                title: "title",
            },
        };
    },
    rateArtwork: async (rating: ArtworkRating) => {
        return {
            message: "Success",
        };
    },
}));

beforeEach(() => {
    api.queryArtwork = jest.fn(async (id: number) => {
        return {
            data: {
                id: id,
                artist_title: "asdf",
                image_id: "2d484387-2509-5e8e-2c43-22f9981972eb",
                title: "title",
            },
        };
    });

    api.rateArtwork = jest.fn(async (rating: ArtworkRating) => {
        return {
            message: "Success",
        };
    });
});

describe("layout", () => {
    test("title should render", () => {
        render(<App />);
        const title = screen.getByText("Art Rater");
        expect(title).toBeInTheDocument();
    });
});

describe("for an art item", () => {
    test("submit button should be disabled until a rating is selected", async () => {
        render(<App />);

        await waitFor(() =>
            expect(
                screen.queryAllByTestId("submit-rating").length
            ).toBeGreaterThan(0)
        );

        const ratingButtons = screen.queryAllByTestId("submit-rating");
        ratingButtons.forEach((btn) => {
            expect(btn).toHaveAttribute("disabled");
        });

        fireEvent.click(screen.queryAllByTestId("rate-1")[0] as HTMLElement);

        expect(ratingButtons[0]).not.toHaveAttribute("disabled");
    });

    test("clicking numbered buttons should update rating display below image to be that number", async () => {
        render(<App />);

        await waitFor(() =>
            expect(
                screen.queryAllByTestId("submit-rating").length
            ).toBeGreaterThan(0)
        );

        const rateBtn = screen.queryAllByTestId("rate-1")[0] as HTMLElement;

        expect(rateBtn.classList.contains("MuiButton-outlined")).toBeTruthy();
        expect(rateBtn.classList.contains("MuiButton-contained")).toBeFalsy();

        fireEvent.click(rateBtn);

        expect(rateBtn.classList.contains("MuiButton-outlined")).toBeFalsy();
        expect(rateBtn.classList.contains("MuiButton-contained")).toBeTruthy();
    });

    test("clicking numbered button should update rating display below image to be that number, clicking two different numbers one after the other", async () => {
        render(<App />);

        await waitFor(() =>
            expect(
                screen.queryAllByTestId("submit-rating").length
            ).toBeGreaterThan(0)
        );

        const rate1 = screen.queryAllByTestId("rate-1")[0] as HTMLElement;
        const rate2 = screen.queryAllByTestId("rate-2")[0] as HTMLElement;

        expect(rate1.classList.contains("MuiButton-outlined")).toBeTruthy();
        expect(rate1.classList.contains("MuiButton-contained")).toBeFalsy();
        expect(rate2.classList.contains("MuiButton-outlined")).toBeTruthy();
        expect(rate2.classList.contains("MuiButton-contained")).toBeFalsy();

        fireEvent.click(rate1);

        expect(rate1.classList.contains("MuiButton-outlined")).toBeFalsy();
        expect(rate1.classList.contains("MuiButton-contained")).toBeTruthy();
        expect(rate2.classList.contains("MuiButton-outlined")).toBeTruthy();
        expect(rate2.classList.contains("MuiButton-contained")).toBeFalsy();

        fireEvent.click(rate2);

        expect(rate1.classList.contains("MuiButton-outlined")).toBeTruthy();
        expect(rate1.classList.contains("MuiButton-contained")).toBeFalsy();
        expect(rate2.classList.contains("MuiButton-outlined")).toBeFalsy();
        expect(rate2.classList.contains("MuiButton-contained")).toBeTruthy();
    });

    test("clicking submit should POST update, display a toast success message, hide/disable buttons", async () => {
        // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
        // For the purpose of this test, please use a mock function instead.
        render(<App />);

        await waitFor(() =>
            expect(
                screen.queryAllByTestId("submit-rating").length
            ).toBeGreaterThan(0)
        );

        const ratingButtons = screen.queryAllByTestId("submit-rating");

        fireEvent.click(screen.queryAllByTestId("rate-1")[0] as HTMLElement);

        fireEvent.click(ratingButtons[0]);

        // Note: I am assuming users should not be able to delete rated pieces, so that is included in the test
        for (let i = 0; i <= 5; i++) {
            expect(screen.getAllByRole("button")[i]).toHaveAttribute(
                "disabled"
            );
        }

        // eslint-disable-next-line testing-library/prefer-find-by
        await waitFor(() =>
            expect(
                screen.getByText("Artwork successfully rated")
            ).toBeInTheDocument()
        );
    });

    test("clicking delete should remove item from list", async () => {
        // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
        // For the purpose of this test, please use a mock function instead.
        render(<App />);

        await waitFor(() =>
            expect(
                screen.queryAllByTestId("submit-rating").length
            ).toBeGreaterThan(0)
        );

        const itemLength = screen.queryAllByTestId("submit-rating").length;

        fireEvent.click(screen.queryAllByTestId("delete-item")[0]);

        fireEvent.click(screen.queryAllByTestId("confirm-dialog")[0]);

        // eslint-disable-next-line testing-library/prefer-find-by
        await waitFor(() =>
            expect(
                screen.getByText("Artwork successfully deleted")
            ).toBeInTheDocument()
        );

        expect(screen.queryAllByTestId("submit-rating").length).toBeLessThan(
            itemLength
        );
    });
});

describe("new art form", () => {
    test("submitting a piece already on the list should throw an error", async () => {
        // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
        // For the purpose of this test, please use a mock function instead.
        render(<App />);

        fireEvent.input(screen.queryByTestId("new-art-input") as HTMLElement, {
            target: { value: "27993" },
        });

        fireEvent.click(screen.queryByTestId("new-art-submit") as HTMLElement);

        // eslint-disable-next-line testing-library/prefer-find-by
        await waitFor(() =>
            expect(
                screen.getByText("Artwork already listed")
            ).toBeInTheDocument()
        );
    });

    test("submitting a non-existent piece should throw an error", async () => {
        // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
        // For the purpose of this test, please use a mock function instead.
        api.queryArtwork = jest.fn(async (id: number) => ({ status: 400 }));

        render(<App />);

        fireEvent.input(screen.queryByTestId("new-art-input") as HTMLElement, {
            target: { value: "asdf" },
        });

        fireEvent.click(screen.queryByTestId("new-art-submit") as HTMLElement);

        // eslint-disable-next-line testing-library/prefer-find-by
        await waitFor(() =>
            expect(
                screen.getByText("Artwork does not exist")
            ).toBeInTheDocument()
        );
    });

    test("submitting a valid piece should add the piece and send up a toast message", async () => {
        // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
        // For the purpose of this test, please use a mock function instead.
        render(<App />);

        fireEvent.input(screen.queryByTestId("new-art-input") as HTMLElement, {
            target: { value: "123" },
        });

        fireEvent.click(screen.queryByTestId("new-art-submit") as HTMLElement);

        // eslint-disable-next-line testing-library/prefer-find-by
        await waitFor(() =>
            expect(
                screen.getByText("Artwork successfully added")
            ).toBeInTheDocument()
        );
    });
});
