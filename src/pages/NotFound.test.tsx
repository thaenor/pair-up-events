import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NotFound from "./NotFound";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useLocation: vi.fn(),
    };
});

describe("NotFound Page", () => {
    beforeEach(() => {
        (useLocation as jest.Mock).mockReturnValue({
            pathname: "/some-random-path",
        });
        // Mock window.location.href
        Object.defineProperty(window, "location", {
            writable: true,
            value: { href: "" },
        });
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
        expect(window.location.href).toBe("/");
    });
});
