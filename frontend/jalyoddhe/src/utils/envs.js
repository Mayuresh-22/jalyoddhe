class Env {
    ENV = import.meta.env.VITE_ENV;
    API_BASE_URL = this.ENV === "LOCAL" ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_PROD;
}

export const AppEnv = new Env();