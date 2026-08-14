import { extractText, getDocumentProxy } from "unpdf";
import { getSignedCloudinaryDownloadUrl } from "./cloudinary.js";


export type PdfExtractResult = {
    text: string;
    pages: string[];
    pageCount: number;
};


async function downloadPdf(url: string) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to download PDF (${response.status})`);
    }

    return response.arrayBuffer(); //This converts the PDF into binary data stored in memory.
}

//This function takes the PDF's binary data and extracts the text from it.
export async function extractPdfFromBuffer(
    buffer: ArrayBuffer | Buffer,
): Promise<PdfExtractResult> {
    //Step 1: Convert the input into an ArrayBuffer
    const arrayBuffer =
        buffer instanceof Buffer
            ? (buffer.buffer.slice(
                  buffer.byteOffset,
                  buffer.byteOffset + buffer.byteLength,
              ) as ArrayBuffer)
            : buffer;

    //Step 2: Read the PDF
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer)); //The binary PDF data is converted into a PDF document object.

    //Step 3: Extract the text
    const { totalPages, text } = await extractText(pdf, { mergePages: false });

    //Step 4: Clean the text
    const pages = Array.isArray(text)
        ? text.map((page) => page.trim())
        : [String(text).trim()];

    //Step 5: Combine all pages
    const joined = pages.filter(Boolean).join("\n\n");

    if (!joined) {
        throw new Error("No text could be extracted from the PDF");
    }
    
    //Step 6: Return the extracted data
    return {
        text: joined,
        pages,
        pageCount: totalPages,
    };
}


export async function extractPdfFromCloudinary(input: {
    fileUrl: string;
    publicId?: string;
    resourceType?: "raw" | "image";
}): Promise<PdfExtractResult> {
    try {
        //Step 1: Download the PDF from Cloudinary
        const buffer = await downloadPdf(input.fileUrl);
        
        //Step 2: Extract the text
        return await extractPdfFromBuffer(buffer);
    } catch (error) {
        //Step 3: Handle private PDFs
        const isUnauthorized =
            error instanceof Error && error.message.includes("(401)");

        if (!isUnauthorized || !input.publicId) {
            throw error;
        }

        const signedUrl = getSignedCloudinaryDownloadUrl(
            input.publicId,
            input.resourceType ?? "raw",
        );

        if (!signedUrl) {
            throw new Error(
                "PDF download requires authentication. Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to server/.env, or re-upload the PDF.",
            );
        }

        const buffer = await downloadPdf(signedUrl);
        return extractPdfFromBuffer(buffer);
    }
}