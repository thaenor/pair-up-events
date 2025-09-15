import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Logo from "./Logo";

describe("Logo", () => {
    it("renders the image logo", () => {
        render(<Logo />);
        expect(screen.getByAltText("Pair Up Events logo")).toBeInTheDocument();
    });

    it("applies the correct size classes to the image", () => {
        const { rerender } = render(<Logo size="xs" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-3 w-3"
        );

        rerender(<Logo size="sm" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-4 w-4"
        );

        rerender(<Logo size="md" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-6 w-6"
        );

        rerender(<Logo size="lg" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-8 w-8"
        );

        rerender(<Logo size="xl" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-12 w-12"
        );

        rerender(<Logo size="xxl" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-16 w-16"
        );

        rerender(<Logo size="xxxl" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-24 w-24"
        );

        rerender(<Logo size="hero" />);
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-64 w-64 md:h-80 md:w-80"
        );

        rerender(<Logo size={"invalid" as any} />); // Test default case
        expect(screen.getByAltText("Pair Up Events logo")).toHaveClass(
            "h-6 w-6"
        );
    });

    it('renders the text "PairUp Events" when showText is true', () => {
        render(<Logo showText={true} />);
        expect(screen.getByText("Pair")).toBeInTheDocument();
        expect(screen.getByText("Up Events")).toBeInTheDocument();
    });

    it("applies the correct text size classes", () => {
        const { rerender } = render(<Logo size="xs" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-xs");

        rerender(<Logo size="sm" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-sm");

        rerender(<Logo size="md" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-base");

        rerender(<Logo size="lg" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-lg");

        rerender(<Logo size="xl" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-xl");

        rerender(<Logo size="xxl" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-2xl");

        rerender(<Logo size="xxxl" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-3xl");

        rerender(<Logo size="hero" showText={true} />);
        expect(screen.getByText("Pair").parentElement).toHaveClass(
            "text-4xl md:text-5xl lg:text-6xl"
        );

        rerender(<Logo size={"invalid" as any} showText={true} />); // Test default case
        expect(screen.getByText("Pair").parentElement).toHaveClass("text-base");
    });

    it("does not render the text when showText is false", () => {
        render(<Logo showText={false} />);
        expect(screen.queryByText("Pair")).not.toBeInTheDocument();
        expect(screen.queryByText("Up Events")).not.toBeInTheDocument();
    });
});
