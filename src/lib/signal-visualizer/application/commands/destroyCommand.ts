import type { Interpreter } from '@/lib/signal-visualizer/core/interpreter.ts'

export class DestroyCommand {
    interpreter: Interpreter

    async handle(): Promise<void> {
        await this.interpreter.destroy()
    }

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter
    }
}
