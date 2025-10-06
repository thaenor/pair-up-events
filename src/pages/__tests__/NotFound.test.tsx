import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type MockedFunction } from "vitest";

import NotFound from "../NotFound";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useLocation: vi.fn(),
        useNavigate: vi.fn(),
    };
});

describe("NotFound Page", () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        (useLocation as MockedFunction<typeof useLocation>).mockReturnValue({
            pathname: "/some-random-path",
            state: null,
            key: "test-key",
            search: "",
            hash: "",
        });
        (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(mockNavigate);
        mockNavigate.mockClear();
    });

    it("renders the 404 error message", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        expect(screen.getByText("404")).toBeInTheDocument();
        expect(screen.getByText("Page Not Found")).toBeInTheDocument();
        expect(
            screen.getByText(
                "The page you're looking for doesn't exist or has been moved."
            )
        ).toBeInTheDocument();
    });

    it("navigates to the home page when the button is clicked", () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("Return Home"));
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
});
