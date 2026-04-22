import ngrok from "ngrok";

export const startNgrok = async (): Promise<string | null> => {
  try {
    const url = await ngrok.connect(5000);
    console.log(`🌐 ngrok tunnel: ${url}`);
    return url as string;
  } catch (error) {
    console.error("ngrok failed:", error);
    return null;
  }
};
