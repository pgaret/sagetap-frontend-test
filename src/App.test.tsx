import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "./App";

jest.mock("./api");

test("has title", () => {
    render(<App />);
    const title = screen.getByText("Art Rater");
    expect(title).toBeInTheDocument();
});

test("for an art item, submit button is disabled until a rating is selected", async () => {
    render(<App />);

    await waitFor(() =>
        expect(screen.queryAllByTestId("submit-rating").length).toBeGreaterThan(
            0
        )
    );

    const ratingButtons = screen.queryAllByTestId("submit-rating");
    ratingButtons.forEach((btn) => {
        expect(btn).toHaveAttribute("disabled");
    });

    fireEvent.click(screen.queryAllByTestId("rate-1")[0] as HTMLElement);

    expect(ratingButtons[0]).not.toHaveAttribute("disabled");
});

test("for an art item, clicking numbered button updates rating display below image to be that number", async () => {
    render(<App />);

    await waitFor(() =>
        expect(screen.queryAllByTestId("submit-rating").length).toBeGreaterThan(
            0
        )
    );

    const rateBtn = screen.queryAllByTestId("rate-1")[0] as HTMLElement;

    expect(rateBtn.classList.contains("MuiButton-outlined")).toBeTruthy();
    expect(rateBtn.classList.contains("MuiButton-contained")).toBeFalsy();

    fireEvent.click(rateBtn);

    expect(rateBtn.classList.contains("MuiButton-outlined")).toBeFalsy();
    expect(rateBtn.classList.contains("MuiButton-contained")).toBeTruthy();
});

test("for an art item, clicking numbered button updates rating display below image to be that number, clicking two different numbers one after the other", async () => {
    render(<App />);

    await waitFor(() =>
        expect(screen.queryAllByTestId("submit-rating").length).toBeGreaterThan(
            0
        )
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

test("for an art item, clicking submit POSTs update, displays a toast success message, hides buttons", async () => {
    // The endpoint and payload for the submit button can be found in the submit method in `App.tsx`.
    // For the purpose of this test, please use a mock function instead.
    render(<App />);

    await waitFor(() =>
        expect(screen.queryAllByTestId("submit-rating").length).toBeGreaterThan(
            0
        )
    );

    const ratingButtons = screen.queryAllByTestId("submit-rating");

    fireEvent.click(screen.queryAllByTestId("rate-1")[0] as HTMLElement);

    fireEvent.click(ratingButtons[0]);

    await waitFor(() => expect(screen.getByText('Artwork successfully rated!')).toBeInTheDocument());
});
