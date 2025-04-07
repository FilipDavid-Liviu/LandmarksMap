import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddScreen } from "../pages/AddScreen";
import { vi } from "vitest";
import { useLandmarks } from "../contexts/LandmarkContext";

const mockAddLandmark = vi.fn();
vi.mock("../contexts/LandmarkContext", () => ({
    useLandmarks: () => ({
        landmarks: [
            {
                id: 1,
                name: "Existing Landmark",
                type: "Monument",
                lat: 0,
                lng: 0,
                description: "",
            },
        ],
        addLandmark: mockAddLandmark,
    }),
}));

vi.mock("../contexts/MarkerContext", () => ({
    useMarker: () => ({
        markerPosition: { lat: 40, lng: -70 },
        setMarkerPosition: vi.fn(),
    }),
}));

describe("AddScreen CRUD operations", () => {
    it("should create a new landmark and reset form when submitted", async () => {
        render(<AddScreen />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText(
            "Enter name"
        ) as HTMLInputElement;
        const descriptionInput = screen.getByPlaceholderText(
            "Enter description"
        ) as HTMLTextAreaElement;
        const typeDropdown = screen.getByText("Select a type");

        await user.type(nameInput, "Test Location");
        await user.type(descriptionInput, "Test Description");
        await user.click(typeDropdown);
        await user.click(screen.getByText("Monument"));

        await user.click(screen.getByText("Add Landmark"));

        await waitFor(() => {
            expect(nameInput.value).toBe("");
            expect(descriptionInput.value).toBe("");
            expect(typeDropdown.textContent).toBe("Select a type");
        });

        expect(mockAddLandmark).toHaveBeenCalledWith({
            id: expect.any(Number),
            name: "Test Location",
            description: "Test Description",
            type: "Monument",
            lat: 40,
            lng: -70,
        });
    });

    it("should show validation error with partial form completion", async () => {
        render(<AddScreen />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText(
            "Enter name"
        ) as HTMLInputElement;
        await user.type(nameInput, "Test Location");

        await user.click(screen.getByText("Add Landmark"));

        const errorMessage = screen.getByText(
            "*Please fill out the name and type fields and select a location on the map"
        );
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.className).not.toContain("inv");
    });

    it("should not add landmark when validation fails", async () => {
        render(<AddScreen />);
        const user = userEvent.setup();

        await user.click(screen.getByText("Add Landmark"));

        const errorMessage = screen.getByText(
            "*Please fill out the name and type fields and select a location on the map"
        );
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.className).not.toContain("inv");

        const { landmarks } = useLandmarks();
        expect(landmarks).toEqual([
            {
                id: 1,
                name: "Existing Landmark",
                type: "Monument",
                lat: 0,
                lng: 0,
                description: "",
            },
        ]);
        expect(landmarks.length).toBe(1);
    });
});
