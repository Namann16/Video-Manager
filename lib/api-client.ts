import {IVideo} from "@/models/videos.models"

export type VideFormData = Omit<IVideo, "_id">

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any
    headers?: Record<string, string>;
}

class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ) : Promise<T> {
        const {method = "GET", body, headers = {}} = options;
        const defaultHeaders =  {
                "Content-Type": "application/json",
                ...headers
            }

           const response =  await fetch(`/api/${endpoint}`, {
            method,
            headers: defaultHeaders,
            body: body ? JSON.stringify(body) : undefined
        })
            if(!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            return response.json() as Promise<T>;
        };
    
        async getVideos() {
            return this.fetch("/Video")
        }

        async createVideo(videoData: VideFormData) {
            return this.fetch("/Video", {
                method: "POST",
                body: videoData
            });
        }
}

export const apiClient = new ApiClient();