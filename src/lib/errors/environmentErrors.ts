export class EnvVarError extends Error {
    constructor(envVarName: string, message: string) {
        super(`${envVarName} -> ${message}`);
        this.name = this.constructor.name;
    }
}

export function checkEnvVar(envVar: string, message: string) {
    let env = process.env[envVar];
    if (!env) {
        throw new EnvVarError(envVar, message);
    }
}

export function checkEnvVars(envVars: string[], message: string) {
    for (const envVar of envVars) {
        checkEnvVar(envVar, message);
    }
}