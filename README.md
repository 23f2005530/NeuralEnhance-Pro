# NeuralEnhance-Pro
AI image enhancer and Background remover upto 16K resolution.
# NeuralEnhance Pro (Free Edition) 🚀

NeuralEnhance Pro is a powerful, React-based web application that leverages Google's **Gemini 2.5 Flash Image** model to perform ultra-realistic image upscaling and background removal. 

Designed for the Free Tier, this application uses advanced prompt engineering to simulate high-definition outputs (up to 16K resolution targets) without requiring expensive paid model subscriptions.

## ✨ Features

- **Ultra-Realistic Upscaling**: Enhance images with prompt-engineered detail targeting resolutions from **1K up to 16K**.
- **Smart Background Removal**: Isolate subjects and remove backgrounds with high edge precision using the Gemini Vision capabilities.
- **Before/After Comparison**: interactive side-by-side or slider views to compare the original and processed images.
- **Drag & Drop Interface**: Modern, responsive UI for easy image uploading.
- **Free Tier Optimized**: Utilizes `gemini-2.5-flash-image` to ensure broad accessibility without requiring a paid GCP project (standard rate limits apply).
- **Downloadable Results**: One-click download for enhanced images.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS (via CDN for lightweight setup)
- **AI Model**: Google Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)
- **SDK**: Google GenAI SDK (`@google/genai`)
- **Build Tooling**: Vite (Recommended for local dev)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Cloud API Key with access to Generative AI (Gemini).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neural-enhance-pro.git
   cd neural-enhance-pro
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

   > **Note:** If running within the Google AI Studio web environment, the API key is handled automatically via the `window.aistudio` integration.

4. **Run the Application**
   ```bash
   npm run dev
   ```

## 📖 Usage Guide

1. **Upload an Image**: Drag and drop a valid image file (JPG, PNG, WEBP) onto the drop zone.
2. **Select Mode**:
   - **Upscale**: Enhances details, lighting, and texture.
   - **Remove BG**: Removes the background and places the subject on a white canvas.
3. **Select Resolution**: Choose a target detail level (1K, 2K, 4K, 8K, or 16K). 
   *Note: "16K" adds specific prompts for microscopic detail, though the physical output dimensions depend on the model's generation limits.*
4. **Custom Instructions**: (Optional) Add specific text prompts like "Make the lighting cinematic" or "Fix the blurry eyes".
5. **Process**: Click "Start Enhancement".
6. **Compare & Download**: Use the slider to see the difference and download your result.

## ⚠️ Important Notes

- **Resolution**: The `gemini-2.5-flash-image` model creates square aspect ratio images by default in this configuration. The "16K" setting creates extremely high-density visual information via prompt engineering, but the actual pixel count is determined by the model's output limitations (typically 1024x1024 or 2048x2048 depending on the active model version).
- **Free Tier Limits**: This app is optimized for the free tier, but standard Gemini API rate limits apply.

## 📄 License

MIT License. Free to use and modify.
