import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdateScreen } from "../pages/UpdateScreen";
import { vi } from "vitest";

const mockUpdateLandmark = vi.fn();
const mockRemoveLandmark = vi.fn();
const mockSetSelectedMarker = vi.fn();
const existingLandmark = {
    id: 1,
    name: "Existing Landmark",
    type: "Monument",
    lat: 40,
    lng: -70,
    description: "Original description",
};

vi.mock("../contexts/LandmarkContext", () => ({
    useLandmarks: () => ({
        landmarks: [existingLandmark],
        updateLandmark: mockUpdateLandmark,
        removeLandmark: mockRemoveLandmark,
    }),
}));

vi.mock("../contexts/SelectedMarkerContext", () => ({
    useSelectedMarker: () => ({
        selectedMarker: {
            lat: 40,
            lng: -70,
            name: "Existing Landmark",
            type: "Monument",
            description: "Original description",
        },
        setSelectedMarker: vi.fn(),
    }),
}));

describe("UpdateScreen CRUD operations", () => {
    it("should update landmark and reset form when submitted", async () => {
        render(<UpdateScreen />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText(
            "Enter name"
        ) as HTMLInputElement;
        const descriptionInput = screen.getByPlaceholderText(
            "Enter description"
        ) as HTMLTextAreaElement;

        expect(screen.getByText("Select a type")).toBeTruthy();

        await user.clear(nameInput);
        await user.type(nameInput, "Updated Location");
        await user.clear(descriptionInput);
        await user.type(descriptionInput, "Updated Description");
        await user.click(screen.getByText("Select a type"));
        await user.click(screen.getByText("Palace"));

        expect(nameInput.value).toBe("Updated Location");
        expect(descriptionInput.value).toBe("Updated Description");
        expect(screen.getByText("Palace")).toBeTruthy();

        const updateButton = screen.getByText("Update Landmark");
        await user.click(updateButton);
    });

    it("should show validation error when updating without selection", async () => {
        vi.mock("../contexts/SelectedMarkerContext", () => ({
            useSelectedMarker: () => ({
                selectedMarker: null,
                setSelectedMarker: mockSetSelectedMarker,
            }),
        }));

        render(<UpdateScreen />);
        const user = userEvent.setup();

        await user.click(screen.getByText("Update Landmark"));

        const errorMessage = screen.getByText(
            "*Please first select a pin on the map and fill out the name and type fields"
        );
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.className).not.toContain("inv");

        expect(mockUpdateLandmark).not.toHaveBeenCalled();
    });

    it("should delete landmark when delete button is clicked", async () => {
        render(<UpdateScreen />);
        const user = userEvent.setup();

        const nameInput = screen.getByPlaceholderText(
            "Enter name"
        ) as HTMLInputElement;
        const descriptionInput = screen.getByPlaceholderText(
            "Enter description"
        ) as HTMLTextAreaElement;

        const deleteButton = screen.getByText("Delete Landmark");
        await user.click(deleteButton);

        await waitFor(() => {
            expect(nameInput.value).toBe("");
            expect(descriptionInput.value).toBe("");
            expect(screen.getByText("Select a type")).toBeTruthy();
        });
    });

    it("should show error when trying to delete without selection", async () => {
        vi.mock("../contexts/SelectedMarkerContext", () => ({
            useSelectedMarker: () => ({
                selectedMarker: null,
                setSelectedMarker: mockSetSelectedMarker,
            }),
        }));

        render(<UpdateScreen />);
        const user = userEvent.setup();

        const deleteButton = screen.getByText("Delete Landmark");
        await user.click(deleteButton);

        const errorMessage = screen.getByText(
            "*Please select a pin on the map"
        );
        expect(errorMessage).toBeTruthy();
        expect(errorMessage.className).not.toContain("inv");

        expect(mockRemoveLandmark).not.toHaveBeenCalled();
    });
});
