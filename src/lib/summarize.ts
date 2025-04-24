import axios from 'axios'

export async function summarizeWithHF(content: string): Promise<string> {
  const HF_API_URL =
    'https://api-inference.huggingface.co/models/facebook/bart-large-cnn'
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY

  const res = await axios.post(
    HF_API_URL,
    { inputs: content },
    {
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return res.data[0]?.summary_text || 'No summary available.'
}
