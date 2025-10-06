import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useScrollToElement } from "./useScrollToElement";

const mockLogError = vi.fn();

vi.mock("@/utils/logger", () => ({
  logError: (...args: unknown[]) => mockLogError(...args)
}));

describe("useScrollToElement", () => {
  it("scrolls to registered elements with smooth behavior", () => {
    const element = document.createElement("div");
    const scrollIntoView = vi.fn();
    (element as HTMLElement & { scrollIntoView: () => void }).scrollIntoView = scrollIntoView;

    const { result } = renderHook(() => useScrollToElement());

    act(() => {
      result.current.registerElement("target", element);
      result.current.scrollToElement("target");
    });

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start"
    });
  });

  it("logs an error if the element cannot be found", () => {
    const { result } = renderHook(() => useScrollToElement());

    act(() => {
      result.current.scrollToElement("missing");
    });

    expect(mockLogError).toHaveBeenCalledWith(
      'Element with id "missing" not found in registered elements',
      null,
      {
        component: "useScrollToElement",
        action: "scrollToElement",
        additionalData: { id: "missing" }
      }
    );
  });
});
