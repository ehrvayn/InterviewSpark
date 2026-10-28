"use client";

type ExportResultPdfOptions = {
  fileName?: string;
};

const CAPTURE_BACKGROUND = "#000000";
const PDF_PAGE_BACKGROUND = "#ffffff";

/**
 * Finds a row without text near `targetY` so a page break does not cut
 * through a line of text. Falls back to the target row when none is found.
 * Expects the light (white background) version of the result.
 */
function findSafeBreakRow(
  pixels: Uint8ClampedArray,
  width: number,
  canvasHeight: number,
  targetY: number,
  minY: number,
) {
  const rowIsEmpty = (y: number) => {
    const rowStart = y * width * 4;
    let contentPixels = 0;
    let sampledPixels = 0;

    for (let offset = 0; offset < width * 4; offset += 4 * 3) {
      const index = rowStart + offset;
      const luminance =
        0.299 * pixels[index] +
        0.587 * pixels[index + 1] +
        0.114 * pixels[index + 2];

      if (luminance < 200) contentPixels += 1;
      sampledPixels += 1;
    }

    return sampledPixels > 0 && contentPixels / sampledPixels < 0.005;
  };

  const scanFloor = Math.max(minY, targetY - 180);
  const start = Math.min(targetY, canvasHeight - 1);

  for (let y = start; y >= scanFloor; y -= 1) {
    if (rowIsEmpty(y)) return y;
  }

  return targetY;
}

/** Inverts the monochrome result so the PDF is white with dark text. */
function invertToLightTheme(pixels: Uint8ClampedArray) {
  for (let index = 0; index < pixels.length; index += 4) {
    pixels[index] = 255 - pixels[index];
    pixels[index + 1] = 255 - pixels[index + 1];
    pixels[index + 2] = 255 - pixels[index + 2];
  }
}

function toFileNamePart(value: string) {
  return value
    .trim()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildResultFileName(role: string) {
  const rolePart = toFileNamePart(role);
  const datePart = new Date().toISOString().slice(0, 10);

  return `InterviewSpark-Result${rolePart ? `-${rolePart}` : ""}-${datePart}.pdf`;
}

/**
 * Captures the given element and downloads it as a multi-page PDF.
 * Elements marked with `data-pdf-hide` are removed from the capture.
 */
export async function exportResultPdf(
  element: HTMLElement,
  { fileName = "interview-result.pdf" }: ExportResultPdfOptions = {},
) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: CAPTURE_BACKGROUND,
    useCORS: true,
    logging: false,
    onclone: (clonedDocument) => {
      clonedDocument
        .querySelectorAll<HTMLElement>("[data-pdf-hide]")
        .forEach((node) => node.remove());

      // Finished animations would otherwise be captured mid-transition.
      clonedDocument.querySelectorAll<HTMLElement>("*").forEach((node) => {
        node.style.animation = "none";
        node.style.transition = "none";
      });
    },
  });

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Could not read the result canvas.");
  }

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  invertToLightTheme(imageData.data);
  context.putImageData(imageData, 0, 0);

  const pixels = imageData.data;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageHeightInPixels = Math.floor(
    (canvas.width / pageWidth) * pageHeight,
  );

  let cursor = 0;
  let pageIndex = 0;

  while (cursor < canvas.height) {
    const remaining = canvas.height - cursor;
    let sliceHeight = Math.min(pageHeightInPixels, remaining);

    if (remaining > pageHeightInPixels) {
      const target = cursor + pageHeightInPixels;
      const safeBreak = findSafeBreakRow(
        pixels,
        canvas.width,
        canvas.height,
        target,
        cursor + Math.floor(pageHeightInPixels * 0.55),
      );

      sliceHeight = Math.max(safeBreak - cursor, 1);
    }

    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = sliceHeight;

    const sliceContext = slice.getContext("2d");

    if (!sliceContext) {
      throw new Error("Could not create the result page.");
    }

    sliceContext.fillStyle = PDF_PAGE_BACKGROUND;
    sliceContext.fillRect(0, 0, slice.width, slice.height);
    sliceContext.drawImage(
      canvas,
      0,
      cursor,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight,
    );

    if (pageIndex > 0) pdf.addPage();

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    const imageHeight = (sliceHeight / canvas.width) * pageWidth;
    pdf.addImage(
      slice.toDataURL("image/png"),
      "PNG",
      0,
      0,
      pageWidth,
      imageHeight,
      undefined,
      "FAST",
    );

    cursor += sliceHeight;
    pageIndex += 1;
  }

  pdf.save(fileName);
}
