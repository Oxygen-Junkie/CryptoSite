// Generated by nitro

// App Config
import type { Defu } from 'defu'

import type { default as appConfig0 } from "C:/Users/FarmUser/Desktop/Web3-Starter-Template/app.config";

type UserAppConfig = Defu<{}, [typeof appConfig0]>

declare module 'nitropack' {
  interface AppConfig extends UserAppConfig {}
}
    
export {}