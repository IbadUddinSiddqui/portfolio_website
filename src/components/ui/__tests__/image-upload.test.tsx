/**
 * ImageUpload Component Tests
 *
 * Tests the drag-and-drop image uploader:
 * - Initial state rendering with semantic tokens
 * - Drag state visual feedback (border-accent-engineering, bg-accent-engineering/5)
 * - File validation (type and size)
 * - Upload progress (Loader2 spinner)
 * - Preview mode with image
 * - Remove button
 *
 * RUN: npx vitest run src/components/ui/__tests__/image-upload.test.tsx
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageUpload } from "../image-upload";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ImageUpload — initial state (no image)", () => {
  it("renders the drop zone with correct border tokens", () => {
    const { container } = render(<ImageUpload />);
    const dropZone = container.querySelector('[class*="border-dashed"]');
    expect(dropZone).toBeInTheDocument();
    // Should have border-card-border/50 in default state
    expect(dropZone?.className).toContain("border-card-border/50");
  });

  it("renders upload icon with text-muted-foreground", () => {
    const { container } = render(<ImageUpload />);
    const iconContainer = container.querySelector('[class*="rounded-xl"]');
    expect(iconContainer).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<ImageUpload label="Custom Label" />);
    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("renders default label when none provided", () => {
    render(<ImageUpload />);
    expect(screen.getByText("Upload Image")).toBeInTheDocument();
  });

  it("renders instructions text", () => {
    render(<ImageUpload />);
    expect(screen.getByText(/Drop image here or click to browse/i)).toBeInTheDocument();
  });

  it("renders file format hint", () => {
    render(<ImageUpload />);
    expect(screen.getByText(/PNG, JPG, WebP.*5MB/i)).toBeInTheDocument();
  });

  it("has a hidden file input", () => {
    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("hidden");
  });

  it("accepts the correct file types", () => {
    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toHaveAttribute(
      "accept",
      "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
    );
  });
});

describe("ImageUpload — drag state", () => {
  it("applies accent-engineering border on drag over", () => {
    const { container } = render(<ImageUpload />);
    const dropZone = container.querySelector('[class*="border-dashed"]')!;

    fireEvent.dragOver(dropZone);

    // After drag, should show accent-engineering classes
    expect(dropZone.className).toContain("border-accent-engineering");
    expect(dropZone.className).toContain("bg-accent-engineering/5");
  });

  it("removes drag classes on drag leave", () => {
    const { container } = render(<ImageUpload />);
    const dropZone = container.querySelector('[class*="border-dashed"]')!;

    fireEvent.dragOver(dropZone);
    expect(dropZone.className).toContain("border-accent-engineering");

    fireEvent.dragLeave(dropZone);
    // Should revert to default
    expect(dropZone.className).toContain("border-card-border/50");
  });
});

describe("ImageUpload — file validation", () => {
  it("rejects invalid file types", async () => {
    const { toast } = await import("sonner");
    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]')!;

    const badFile = new File(["test"], "test.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [badFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("Only images")
      );
    });
  });

  it("rejects files larger than 5MB", async () => {
    const { toast } = await import("sonner");
    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]')!;

    const bigFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      "large.jpg",
      { type: "image/jpeg" }
    );
    fireEvent.change(input, { target: { files: [bigFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining("max 5MB")
      );
    });
  });

  it("allows valid files", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ file: { url: "/uploads/test.jpg" } }),
    });

    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]')!;

    const validFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/upload", expect.any(Object));
    });
  });
});

describe("ImageUpload — upload state", () => {
  it("shows spinner while uploading", async () => {
    // Keep the promise pending to keep uploading state active
    mockFetch.mockImplementationOnce(() => new Promise(() => {}));

    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]')!;

    const validFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(container.querySelector('[class*="animate-spin"]')).toBeInTheDocument();
      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });
  });

  it("shows error toast on upload failure", async () => {
    const { toast } = await import("sonner");
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { container } = render(<ImageUpload />);
    const input = container.querySelector('input[type="file"]')!;

    const validFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});

describe("ImageUpload — preview state", () => {
  it("shows preview image when currentImage is provided", () => {
    render(<ImageUpload currentImage="/uploads/photo.jpg" />);
    const img = screen.getByAltText("Upload preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/uploads/photo.jpg");
  });

  it("renders change and remove buttons in preview mode", () => {
    render(<ImageUpload currentImage="/uploads/photo.jpg" />);
    expect(screen.getByText("Change")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  it("renders preview container with border-card-border token", () => {
    const { container } = render(<ImageUpload currentImage="/test.jpg" />);
    const previewContainer = container.querySelector('[class*="overflow-hidden"]');
    expect(previewContainer?.className).toContain("border-card-border/50");
  });
});
