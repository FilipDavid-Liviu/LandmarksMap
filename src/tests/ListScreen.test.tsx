import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ListScreen } from "../pages/ListScreen";
import { vi } from "vitest";

const mockLandmarks = [
    {
        id: 1,
        name: "Eiffel Tower",
        type: "Monument",
        lat: 48.8584,
        lng: 2.2945,
        description: "Famous tower",
    },
    {
        id: 2,
        name: "Colosseum",
        type: "Monument",
        lat: 41.8902,
        lng: 12.4922,
        description: "Ancient arena",
    },
    {
        id: 3,
        name: "St. Peter",
        type: "Religious Monument",
        lat: 41.9022,
        lng: 12.4539,
        description: "Church",
    },
    {
        id: 4,
        name: "Stonehenge",
        type: "Monument",
        lat: 51.1789,
        lng: -1.8262,
        description: "Stone circle",
    },
];

vi.mock("../contexts/LandmarkContext", () => ({
    useLandmarks: () => ({
        landmarks: mockLandmarks,
    }),
}));

describe("ListScreen", () => {
    it("should display landmarks correctly", () => {
        render(<ListScreen />);

        expect(screen.getByText(/Eiffel Tower/)).toBeTruthy();
        expect(screen.getByText(/Colosseum/)).toBeTruthy();
    });

    it("should filter landmarks by search", async () => {
        render(<ListScreen />);
        const user = userEvent.setup();

        const searchInput = screen.getByPlaceholderText(
            "Search by name or type"
        );

        await user.type(searchInput, "Religious");

        expect(screen.getByText(/St. Peter/)).toBeTruthy();
        expect(screen.queryByText(/Eiffel Tower/)).toBeFalsy();
    });

    it("should sort landmarks by latitude when checkbox is clicked", async () => {
        render(<ListScreen />);
        const user = userEvent.setup();

        const sortCheckbox = screen.getByText("Sort by Latitude");
        await user.click(sortCheckbox);

        const landmarks = screen.getAllByRole("listitem");

        expect(landmarks[0].textContent).toContain("Stonehenge");
    });

    it("should show 'No landmarks found' when search has no results", async () => {
        render(<ListScreen />);
        const user = userEvent.setup();

        const searchInput = screen.getByPlaceholderText(
            "Search by name or type"
        );
        await user.type(searchInput, "nonexistent");

        expect(screen.getByText("No landmarks found")).toBeTruthy();
    });
});
