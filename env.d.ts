declare module "bun" {
    interface Env {
        BOT_TOKEN: string
        MIN_XP: number
        MAX_XP: number
        XP_TIMEOUT: number
        LEVELING_CHANNEL: string
        PREFIX: string
        GUILD_ID: string
    }
}