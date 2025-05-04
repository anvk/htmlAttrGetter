import axios from "axios"

/**
 * Fetches HTML content from a URL
 * @param url - The URL to fetch HTML from
 * @returns Promise resolving to the HTML content
 */
export async function fetchHTML(url: string): Promise<string> {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error("Error fetching HTML:", error)
        throw error
    }
}
