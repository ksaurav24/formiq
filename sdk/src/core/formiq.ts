// CORE formiq 
class Formiq {
    constructor(apiKey: string, projectId: string) {
        // encode the api key to base64 in the browser
        this.apiKey = apiKey
        this.projectId = projectId;
    }
    apiKey: string;
    projectId: string;

    private static API_BASE_URL = "https://api.formiq.devxsaurav.in/api";

    async submitForm(
        data: Record<string, any>,
        options?: { ipAddress?: string; userAgent?: string; origin?: string }
    ) {
        const response = await fetch(
            `${Formiq.API_BASE_URL}/v1/submissions/project/${this.projectId}/submit`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.apiKey}`,
                    "X-Formiq-Key": this.apiKey,
                },
                body: JSON.stringify({ fields:data, options }),
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error(`Error submitting form: ${response.statusText}`);
        }
        return response.json();
    }
}

export default Formiq;
